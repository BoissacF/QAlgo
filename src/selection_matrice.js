/* QAlgo — sélection d'une partie du circuit, pour en générer la matrice
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */

/* Le bouton « Générer la matrice d'une sélection sur le circuit » ouvre ici.
 * La fenêtre de création de porte se referme — elle masque le canvas — et un
 * cadre apparaît sur le circuit, qu'on déplace et redimensionne. Les portes
 * retenues s'entourent de vert, celles que le cadre contient mais qu'on ne
 * peut pas prendre s'entourent de rouge. « Valider » calcule la matrice de la
 * sélection et rouvre la fenêtre avec elle.
 *
 * TROIS RÈGLES, qui tiennent toutes à la même idée : une matrice ne décrit une
 * sélection que si cette sélection est refermée sur elle-même.
 *
 *   1. Une porte n'est prise que si TOUTES les lignes quantiques qu'elle
 *      touche sont dans le cadre — ses propres entrées, et les lignes d'où
 *      viennent ses contrôles. Un CNOT dont le contrôle est dehors agirait
 *      sur un qubit absent de la matrice : il est refusé, et dessiné en rouge
 *      pour qu'on voie pourquoi.
 *   2. Neuf lignes quantiques au plus, comme l'éditeur de matrice.
 *   3. Pas de mesure dans la sélection : une mesure n'est pas unitaire, sa
 *      « matrice » changerait à chaque tirage.
 *
 * COMMENT LA MATRICE EST CALCULÉE. Le cadre retient une bande de k lignes
 * consécutives. On décale les numéros de ligne des éléments retenus de la
 * première ligne de la bande, ce qui les ramène à 0..k-1, puis on fait tourner
 * le moteur réel sur un registre de k qubits : pour chaque état de base, on le
 * met à 1, on applique les seules portes retenues dans l'ordre d'intrication,
 * et le vecteur de sortie donne une colonne. Les numéros de ligne sont ensuite
 * remis en place. Aucun calcul n'est réécrit : c'est
 * `calcul_nQbits_apres_passage_dune_porte` qui travaille, exactement comme
 * pour un circuit ordinaire.
 */

var SelectionCircuit = (function () {
  "use strict";

  var MAX_LIGNES = 9;        // le plafond de l'éditeur de matrice
  var MARGE = 34;            // hauteur prise au-dessus et en dessous d'une ligne
  var POIGNEE = 11;          // côté des carrés de redimensionnement
  var BORD = 9;              // épaisseur sensible d'un bord, hors des carrés
  var DUREE_MESSAGE = 2500;  // ms d'affichage d'un refus

  var actif = false;
  var ligneHaut = 0, ligneBas = 0;   // indices de lignes quantiques, bornes incluses
  var xMin = 0, xMax = 0;            // bornes horizontales, en pixels du canvas
  var prise = null;                  // ce que la souris tient : voir attrape()
  var message = "", messageJusqua = 0;
  var retenues = [];                 // sommets que le calcul applique
  var bloquantes = [];               // portes liées à des lignes hors sélection

  // --- les textes, dans les deux langues --------------------------------

  function texte(cle) {
    var fr = {
      valider: "✓ Valider la sélection",
      annuler: "✗ Annuler",
      aide: "Déplace le cadre, ou tire ses bords. Entrée pour valider ; Échap, ou un clic hors du cadre, pour sortir.",
      tropDeLignes: "Tu ne peux pas sélectionner plus que " + MAX_LIGNES + " lignes quantiques.",
      vide: "La sélection ne contient aucune porte.",
      pasDeCircuit: "Il n'y a pas encore de ligne quantique à sélectionner.",
      lien: "Sélection impossible car une porte ou un contrôle est lié à d'autres lignes quantiques hors sélection.",
    };
    var en = {
      valider: "✓ Use this selection",
      annuler: "✗ Cancel",
      aide: "Move the frame, or drag its edges. Enter to confirm; Esc, or a click outside the frame, to leave.",
      tropDeLignes: "You cannot select more than " + MAX_LIGNES + " quantum lines.",
      vide: "The selection contains no gate.",
      pasDeCircuit: "There is no quantum line to select yet.",
      lien: "Selection impossible: a gate or a control is linked to other quantum lines outside the selection.",
    };
    return (typeof langue !== "undefined" && langue === 1) ? en[cle] : fr[cle];
  }

  function annonce(cle) {
    message = texte(cle);
    messageJusqua = millis() + DUREE_MESSAGE;
  }

  // --- géométrie ---------------------------------------------------------

  function nbLignes() {
    if (typeof G === "undefined" || !G || !G.lignes_quantiques) return 0;
    return G.lignes_quantiques.length;
  }

  /* L'ordonnée d'une ligne quantique : celle de son qubit d'entrée, qui est
     toujours son premier élément. Le canvas étant libre, c'est la seule
     référence stable — une porte de la ligne peut être dessinée un peu plus
     haut ou plus bas sans changer de ligne. */
  function yLigne(j) {
    var ligne = G.lignes_quantiques[j];
    if (!ligne || !ligne[0]) return 0;
    return ligne[0].y;
  }

  function yHaut() { return yLigne(ligneHaut) - MARGE; }
  function yBas() { return yLigne(ligneBas) + MARGE; }

  // la ligne quantique dont l'ordonnée est la plus proche de y
  function ligneLaPlusProche(y) {
    var meilleure = 0, ecart = Infinity;
    for (var j = 0; j < nbLignes(); j++) {
      var d = Math.abs(yLigne(j) - y);
      if (d < ecart) { ecart = d; meilleure = j; }
    }
    return meilleure;
  }

  // --- quelles portes la sélection retient -------------------------------

  /* Les lignes quantiques que touche un élément : ses propres entrées, et
     celles d'où partent ses contrôles. C'est cette liste qui doit tenir tout
     entière dans le cadre. */
  function lignesTouchees(sommet) {
    var lignes = [];
    var i, j;
    for (i = 0; i < sommet.num_ligne.length; i++)
      if (sommet.num_ligne[i] >= 0) lignes.push(sommet.num_ligne[i]);

    /* Une arête de contrôle se lit **dans les deux sens**, et c'est tout
       l'intérêt : `numSommetDepart` est le point de contrôle, `numSommetArrive`
       la porte qu'il commande, et l'arête figure dans les deux listes. Vu de la
       porte, on remonte à la ligne du contrôle ; vu du contrôle, on descend
       aux lignes de la porte. Chacun des deux désigne donc l'autre, et une
       sélection qui ne prend qu'un bout du lien se voit refuser.

       Le sommet lui-même apparaît comme l'une des deux extrémités : on le
       saute, ses propres lignes étant déjà comptées. */
    if (sommet.aretes_controle)
      for (i = 0; i < sommet.aretes_controle.length; i++) {
        var a = sommet.aretes_controle[i];
        var bouts = [G.TabSommets[a.numSommetDepart],
                     G.TabSommets[a.numSommetArrive]];
        for (j = 0; j < 2; j++) {
          var autre = bouts[j];
          if (!autre || autre === sommet) continue;
          for (var k = 0; k < autre.num_ligne.length; k++)
            if (autre.num_ligne[k] >= 0) lignes.push(autre.num_ligne[k]);
        }
      }
    return lignes;
  }

  function dansLaBande(ligne) {
    return (ligne >= ligneHaut) && (ligne <= ligneBas);
  }

  /* Ce qu'une sélection prend. En sont écartés, et ne sont donc ni comptés,
     ni cerclés, ni appliqués :

       - les qubits d'entrée (type <= 2), qui sont l'état de départ ;
       - les personnages (128, 129, 130), qui sont du décor ;
       - les lecteurs de probabilités (type 64), qui lisent sans rien changer ;
       - les mesures (type 65), qui ne sont pas réversibles.

     Aucun d'eux ne peut rendre une sélection impossible, puisqu'aucun n'est
     lié à une autre ligne quantique : ils sortent de la sélection sans rien
     bloquer. Seules les portes peuvent bloquer, et seulement par un lien. */
  function participeAuCalcul(sommet) {
    return (sommet.type > 2) && ((sommet.type & 128) === 0) &&
           (sommet.type !== 64) && (sommet.type !== 65);
  }

  //les points de contrôle et d'anticontrôle
  function estUnControle(sommet) {
    return (sommet.type === 16) || (sommet.type === 17);
  }

  /* Ce que l'utilisateur appelle une porte : ni un point de contrôle, qui fait
     partie de la porte qu'il commande, ni un lecteur de probabilités. C'est
     cette liste qu'on cercle en vert et qu'on compte. */
  function estUnePorte(sommet) {
    return participeAuCalcul(sommet) && !estUnControle(sommet);
  }

  /* Les portes à cercler de vert. Une porte qui bloque n'est jamais retenue,
     puisqu'on ne saurait pas l'appliquer : la liste des retenues suffit. */
  function portesCerclees() {
    var liste = [];
    for (var i = 0; i < retenues.length; i++)
      if (estUnePorte(retenues[i])) liste.push(retenues[i]);
    return liste;
  }

  /* Recalcule `retenues`, ce que le calcul applique, et `bloquantes`, ce qui
     interdit de valider.

     Une porte est dans le cadre si son abscisse y est et si sa ligne
     principale est dans la bande. Elle est alors retenue si TOUTES les lignes
     qu'elle touche sont dans la bande ; sinon elle bloque. C'est le seul
     blocage possible, et il ne peut venir que d'un contrôle ou d'une porte
     multiligne : rien d'autre n'est lié à une autre ligne quantique.

     Les points de contrôle sont examinés comme les portes, et pour la même
     raison : un contrôle posé sur une ligne sélectionnée commande une porte
     qui est peut-être ailleurs. Si elle est hors de la bande, la ligne n'est
     pas indépendante et il n'y a rien à en tirer : le contrôle bloque. C'est
     ce qui manquait — on pouvait sélectionner la seule première ligne du
     codage superdense, qui porte deux H et deux contrôles commandés sur la
     seconde, et obtenir H·H = I, une matrice qui ne décrit rien.

     Un contrôle vient en outre avec la porte qu'il commande MÊME si le cadre
     coupe son abscisse : sans cela une porte contrôlée pouvait être appliquée
     sans son contrôle, donc inconditionnellement, et la matrice était fausse
     sans que rien ne le signale. */
  function recalculeSelection() {
    retenues = [];
    bloquantes = [];
    if (!nbLignes()) return;

    var compagnons = [];
    var i, j;

    for (i = 0; i < G.TabSommets.length; i++) {
      var s = G.TabSommets[i];
      if (s === undefined) continue;
      if (!participeAuCalcul(s)) continue;
      if (s.x < xMin || s.x > xMax) continue;
      if (!dansLaBande(s.num_ligne[0])) continue;

      var lignes = lignesTouchees(s);
      var complet = true;
      for (j = 0; j < lignes.length; j++)
        if (!dansLaBande(lignes[j])) { complet = false; break; }

      if (!complet) { bloquantes.push(s); continue; }

      retenues.push(s);
      if (s.aretes_controle)
        for (j = 0; j < s.aretes_controle.length; j++) {
          var depart = G.TabSommets[s.aretes_controle[j].numSommetDepart];
          if (depart && depart !== s && compagnons.indexOf(depart) < 0)
            compagnons.push(depart);
        }
    }

    for (i = 0; i < compagnons.length; i++)
      if (retenues.indexOf(compagnons[i]) < 0) retenues.push(compagnons[i]);
  }

  // --- le cadre de départ : tout le circuit, dans la limite des 9 lignes --

  function cadreInitial() {
    var n = nbLignes();
    ligneHaut = 0;
    ligneBas = Math.min(n - 1, MAX_LIGNES - 1);

    var g = Infinity, d = -Infinity;
    for (var i = 0; i < G.TabSommets.length; i++) {
      var s = G.TabSommets[i];
      if (s === undefined) continue;
      if (s.x - s.diametre < g) g = s.x - s.diametre;
      if (s.x + s.diametre > d) d = s.x + s.diametre;
    }
    if (g === Infinity) { g = 0; d = width; }
    xMin = g - MARGE / 2;
    xMax = d + MARGE / 2;
  }

  // --- les deux boutons, dessinés sur le canvas ---------------------------

  /* Des boutons peints plutôt que des éléments HTML : le cadre vit sur le
     canvas, et deux balises à positionner par-dessus demanderaient une mise en
     page qui se déréglerait au premier redimensionnement. */
  function boites() {
    var h = 34, marge = 10;
    textSize(16);
    var lv = textWidth(texte("valider")) + 26;
    var la = textWidth(texte("annuler")) + 26;
    var total = lv + la + marge;
    var x0 = width / 2 - total / 2;
    return {
      valider: { x: x0, y: 12, l: lv, h: h },
      annuler: { x: x0 + lv + marge, y: 12, l: la, h: h },
    };
  }

  function dansBoite(b) {
    return (mouseX >= b.x) && (mouseX <= b.x + b.l) &&
           (mouseY >= b.y) && (mouseY <= b.y + b.h);
  }

  function dessineBouton(b, libelle, fond) {
    push();
    stroke(40); strokeWeight(1); fill(fond);
    rect(b.x, b.y, b.l, b.h, 6);
    noStroke(); fill(255);
    textSize(16); textAlign(CENTER, CENTER);
    text(libelle, b.x + b.l / 2, b.y + b.h / 2);
    pop();
  }

  // --- les poignées ------------------------------------------------------

  /* Huit poignées : les quatre coins et le milieu des quatre bords. Chacune
     dit quels bords elle déplace. */
  function poignees() {
    var g = xMin, d = xMax, h = yHaut(), b = yBas();
    var cx = (g + d) / 2, cy = (h + b) / 2;
    return [
      { x: g,  y: h,  bords: "gh" }, { x: cx, y: h,  bords: "h" },
      { x: d,  y: h,  bords: "dh" }, { x: d,  y: cy, bords: "d" },
      { x: d,  y: b,  bords: "db" }, { x: cx, y: b,  bords: "b" },
      { x: g,  y: b,  bords: "gb" }, { x: g,  y: cy, bords: "g" },
    ];
  }

  function poigneeSousLaSouris() {
    var p = poignees();
    for (var i = 0; i < p.length; i++)
      if (Math.abs(mouseX - p[i].x) <= POIGNEE && Math.abs(mouseY - p[i].y) <= POIGNEE)
        return p[i];
    return null;
  }

  /* Quels bords la souris désigne, par leur initiale : "" si elle ne désigne
     aucun bord. Les carrés passent d'abord, puis le bord **sur toute sa
     longueur**.

     Sans cela, redimensionner verticalement était presque impossible, et
     l'échec n'avait rien d'évident : le carré du haut est posé au milieu
     horizontal du cadre, et ce cadre fait souvent plusieurs centaines de
     pixels de large, alors qu'il n'est haut que d'une centaine. Viser le carré
     du bord gauche, lui, demandait de tomber au milieu d'une hauteur courte :
     on y arrivait par accident. En manquant le carré du haut, on attrapait
     l'intérieur du cadre, donc un déplacement d'ensemble — qui ne pouvait pas
     bouger non plus, puisque le cadre de départ couvre déjà tout le circuit.
     Le cadre paraissait donc bloqué en vertical et libre en horizontal. */
  function bordsSousLaSouris() {
    var p = poigneeSousLaSouris();
    if (p) return p.bords;

    var g = xMin, d = xMax, h = yHaut(), b = yBas();
    if (mouseX < g - BORD || mouseX > d + BORD) return "";
    if (mouseY < h - BORD || mouseY > b + BORD) return "";

    var bords = "";
    if (Math.abs(mouseX - g) <= BORD) bords = bords + "g";
    else if (Math.abs(mouseX - d) <= BORD) bords = bords + "d";
    if (Math.abs(mouseY - h) <= BORD) bords = bords + "h";
    else if (Math.abs(mouseY - b) <= BORD) bords = bords + "b";
    return bords;
  }

  // --- dessin ------------------------------------------------------------

  function dessine() {
    if (!actif) return;
    if (!nbLignes()) { actif = false; return; }

    var g = xMin, d = xMax, h = yHaut(), b = yBas();

    push();

    // le cadre
    noStroke();
    fill(120, 130, 145, 60);
    rect(g, h, d - g, b - h);
    noFill();
    stroke(60, 90, 160); strokeWeight(2);
    rect(g, h, d - g, b - h);

    /* Les anneaux verts, autour des seules portes : ni les points de
       contrôle, qui font partie de la porte qu'ils commandent, ni les lecteurs
       de probabilités, qui ne changent rien à l'état. */
    var i;
    var vertes = portesCerclees();
    strokeWeight(3); noFill();
    stroke(30, 160, 70);
    for (i = 0; i < vertes.length; i++)
      ellipse(vertes[i].x, vertes[i].y, vertes[i].diametre * 1.45);

    /* Ce qui interdit de valider : un anneau rouge épais, et une croix rouge
       par-dessus la porte. Elle doit sauter aux yeux, c'est elle qui explique
       le message. */
    for (i = 0; i < bloquantes.length; i++) {
      var s0 = bloquantes[i];
      var rayon = s0.diametre * 0.80;

      noFill(); stroke(200, 25, 25); strokeWeight(5);
      ellipse(s0.x, s0.y, rayon * 2);

      strokeWeight(7); stroke(255, 255, 255, 200);
      line(s0.x - rayon * 0.62, s0.y - rayon * 0.62, s0.x + rayon * 0.62, s0.y + rayon * 0.62);
      line(s0.x + rayon * 0.62, s0.y - rayon * 0.62, s0.x - rayon * 0.62, s0.y + rayon * 0.62);
      strokeWeight(5); stroke(200, 25, 25);
      line(s0.x - rayon * 0.62, s0.y - rayon * 0.62, s0.x + rayon * 0.62, s0.y + rayon * 0.62);
      line(s0.x + rayon * 0.62, s0.y - rayon * 0.62, s0.x - rayon * 0.62, s0.y + rayon * 0.62);
    }

    /* Les poignées. Celle du bord que la souris tient — ou, à défaut, qu'elle
       survole — est pleine : c'est le seul signe qui dise « tu l'as » avant
       que le cadre ne bouge, et un bord vertical ne bouge que d'un interligne
       à la fois, donc après un bon centimètre de souris. */
    var p = poignees();
    var tenus = prise ? prise.bords : bordsSousLaSouris();
    stroke(60, 90, 160); strokeWeight(1);
    for (i = 0; i < p.length; i++) {
      if (tenus !== "" && p[i].bords === tenus) fill(60, 90, 160);
      else fill(255);
      rect(p[i].x - POIGNEE / 2, p[i].y - POIGNEE / 2, POIGNEE, POIGNEE);
    }

    // le compte des lignes retenues, dans le coin du cadre
    noStroke(); fill(60, 90, 160);
    textSize(15); textAlign(LEFT, BOTTOM);
    var k = ligneBas - ligneHaut + 1;
    var np = vertes.length;
    text("q" + ligneHaut + " → q" + ligneBas + "  (" + k +
         (k > 1 ? " lignes" : " ligne") + ", " + np +
         (np > 1 ? " portes)" : " porte)"), g + 4, h - 4);

    // les boutons et l'aide
    var bo = boites();
    if (bloquantes.length > 0)
      dessineBouton(bo.valider, texte("valider"), color(140, 140, 140));
    else
      dessineBouton(bo.valider, texte("valider"), dansBoite(bo.valider) ?
                    color(30, 140, 60) : color(40, 110, 50));
    dessineBouton(bo.annuler, texte("annuler"), dansBoite(bo.annuler) ?
                  color(150, 60, 60) : color(110, 50, 50));

    noStroke(); fill(70); textSize(14); textAlign(CENTER, TOP);
    text(texte("aide"), width / 2, bo.valider.y + bo.valider.h + 6);

    /* Le message rouge. Celui d'une porte qui bloque reste affiché tant
       qu'elle bloque : c'est lui qui dit pourquoi « Valider » ne répond pas.
       Les autres, comme le plafond de neuf lignes, s'effacent au bout de deux
       secondes et demie. */
    var aDire = "";
    if (bloquantes.length > 0) aDire = texte("lien");
    else if (message !== "" && millis() < messageJusqua) aDire = message;
    else message = "";

    if (aDire !== "") {
      textSize(20); textAlign(CENTER, CENTER);
      var l = textWidth(aDire) + 30;
      noStroke(); fill(255, 240, 240, 245);
      rect(width / 2 - l / 2, 78, l, 40, 6);
      stroke(190, 40, 40); strokeWeight(1.5); noFill();
      rect(width / 2 - l / 2, 78, l, 40, 6);
      noStroke(); fill(170, 30, 30);
      text(aDire, width / 2, 98);
    }

    pop();
  }

  // --- déplacement et redimensionnement ----------------------------------

  function attrape() {
    var bords = bordsSousLaSouris();
    if (bords !== "") {
      /* On retient l'écart entre la souris et la ligne que le bord suit.
         La poignée est posée à MARGE au-dessus (ou en dessous) de cette
         ligne, et l'écart entre deux lignes quantiques n'est pas constant :
         il vaut une centaine de pixels sur un circuit de deux lignes, mais
         tombe à une vingtaine sur un circuit de dix-huit. Viser la ligne la
         plus proche de la souris elle-même désignerait alors une ligne ou
         deux trop haut : le bord sauterait à l'instant où on l'attrape, et
         sur une sélection déjà à neuf lignes le plafond le renverrait
         aussitôt en place — la poignée paraîtrait morte. En suivant
         l'écart, attraper sans bouger ne change rien, et déplacer la souris
         d'un interligne déplace le bord d'une ligne. */
      prise = { bords: bords,
                dyH: mouseY - yLigne(ligneHaut),
                dyB: mouseY - yLigne(ligneBas) };
      return true;
    }

    if (mouseX >= xMin && mouseX <= xMax && mouseY >= yHaut() && mouseY <= yBas()) {
      prise = { bords: "", dx: mouseX - xMin, dLigne: ligneLaPlusProche(mouseY) - ligneHaut };
      return true;
    }
    return false;
  }

  /* Appelé à chaque image tant que la souris tient quelque chose. Les bords
     horizontaux suivent la souris au pixel ; les bords verticaux s'accrochent
     à une ligne quantique, puisqu'on ne sélectionne pas une demi-ligne. */
  function suit() {
    if (!prise) return;
    var n = nbLignes();

    if (prise.bords === "") {                     // déplacement d'ensemble
      var largeur = xMax - xMin;
      xMin = mouseX - prise.dx;
      xMax = xMin + largeur;
      var hauteur = ligneBas - ligneHaut;
      var haut = ligneLaPlusProche(mouseY) - prise.dLigne;
      haut = Math.max(0, Math.min(haut, n - 1 - hauteur));
      ligneHaut = haut;
      ligneBas = haut + hauteur;
    } else {
      if (prise.bords.indexOf("g") >= 0) xMin = Math.min(mouseX, xMax - 20);
      if (prise.bords.indexOf("d") >= 0) xMax = Math.max(mouseX, xMin + 20);

      if (prise.bords.indexOf("h") >= 0) {
        var nh = Math.min(ligneLaPlusProche(mouseY - prise.dyH), ligneBas);
        if (ligneBas - nh + 1 > MAX_LIGNES) { annonce("tropDeLignes"); nh = ligneBas - MAX_LIGNES + 1; }
        ligneHaut = nh;
      }
      if (prise.bords.indexOf("b") >= 0) {
        var nb = Math.max(ligneLaPlusProche(mouseY - prise.dyB), ligneHaut);
        if (nb - ligneHaut + 1 > MAX_LIGNES) { annonce("tropDeLignes"); nb = ligneHaut + MAX_LIGNES - 1; }
        ligneBas = nb;
      }
    }
    recalculeSelection();
  }

  // --- le calcul de la matrice -------------------------------------------

  /* Les portes retenues, dans l'ordre où le moteur les applique. Cet ordre
     n'est pas celui du dessin : il place chaque contrôle avant la porte qu'il
     commande, ce qui est indispensable à l'intrication. On se contente donc de
     filtrer la liste que le moteur a déjà construite. */
  function portesOrdonnees() {
    var dedans = [];
    var liste = G.Liste_ordonnee_pour_intrication || [];
    for (var i = 0; i < liste.length; i++)
      if (retenues.indexOf(liste[i]) >= 0) dedans.push(liste[i]);
    return dedans;
  }

  /* Décale les numéros de ligne des éléments retenus pour que la bande
     commence à 0, et rend de quoi tout remettre en place. Le moteur lit
     `num_ligne` pour placer les bits, et `calcul_Liste_controle` lit celui des
     sommets de contrôle : les deux sont dans `retenues`, puisqu'une porte
     n'est prise que si ses contrôles le sont. */
  function decaleLignes(portes) {
    var sauvegarde = [];
    for (var i = 0; i < portes.length; i++) {
      sauvegarde.push({ porte: portes[i], lignes: portes[i].num_ligne.slice() });
      for (var j = 0; j < portes[i].num_ligne.length; j++)
        if (portes[i].num_ligne[j] >= 0) portes[i].num_ligne[j] -= ligneHaut;
    }
    return sauvegarde;
  }

  function remetLignes(sauvegarde) {
    for (var i = 0; i < sauvegarde.length; i++)
      sauvegarde[i].porte.num_ligne = sauvegarde[i].lignes;
  }

  function calculeMatrice() {
    var k = ligneBas - ligneHaut + 1;
    var n = Math.pow(2, k);
    var portes = portesOrdonnees();

    var sauvegardeLignes = decaleLignes(retenues);
    var sauvegardeEtat = G.n_Qbits_sortie;
    var M = new matrice_porte(n);

    try {
      for (var i = 0; i < n; i++) {
        var v = new vecteur_etat(n);
        v.ecrit(i, 1, 0);                   // l'état de base numéro i, seul
        G.n_Qbits_sortie = v;

        for (var p = 0; p < portes.length; p++) {
          var porte = portes[p];
          if (porte.nAretes_entrantes <= 0) continue;
          var depart = G.TabSommets[porte.aretes_entrantes[0].numSommetDepart];
          if (!depart) continue;
          G.calcul_nQbits_apres_passage_dune_porte(
            porte, depart.Qbit[0], porte.num_ligne[0], k);
        }

        // le vecteur obtenu est la colonne i de la matrice
        for (var l = 0; l < n; l++)
          M.ecrit(l, i, G.n_Qbits_sortie.re[l], G.n_Qbits_sortie.im[l]);
      }
    } finally {
      G.n_Qbits_sortie = sauvegardeEtat;
      remetLignes(sauvegardeLignes);
    }
    return M;
  }

  // --- entrée et sortie du mode sélection --------------------------------

  function demarre() {
    if (!nbLignes()) { alert(texte("pasDeCircuit")); return; }

    // la fenêtre de matrice masque le canvas : il faut la refermer pour voir
    // le circuit, et on la rouvrira avec la matrice calculée
    document.getElementById("affichagematrice").style.display = "none";
    ferme_fenetre_met_a_jour_parametres();

    cadreInitial();
    recalculeSelection();
    prise = null;
    message = "";
    actif = true;
    Selection = -1;                 // rien du circuit ne doit suivre la souris
    loop();
  }

  function arrete() {
    actif = false;
    prise = null;
    message = "";
    retenues = [];
    bloquantes = [];
  }

  function valide() {
    /* Tant qu'une porte bloque, on ne calcule rien : sa croix rouge et le
       message disent déjà pourquoi. */
    if (bloquantes.length > 0) { annonce("lien"); return; }
    if (!portesCerclees().length) { annonce("vide"); return; }

    var k = ligneBas - ligneHaut + 1;
    noLoop();
    matrice_generee = calculeMatrice();

    /* Le moteur a écrit les coefficients affichés de chaque porte au fil des
       2^k passages : on lui fait refaire un calcul propre pour que le circuit
       retrouve l'état qu'il montrait. */
    G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();

    arrete();
    ouvreFenetreAvecLaMatrice(k);
    loop();
  }

  function ouvreFenetreAvecLaMatrice(k) {
    ouvre_fenetre_met_a_jour_parametres();
    document.getElementById("affichagematrice").style.display = "inline";
    document.getElementById("nombrelignequantique").value = k.toString();
    document.getElementById("nombrelignequantique").disabled = false;
    Bouton_mis_a_jour_matrice = undefined;   // « Valider » créera une porte neuve

    M = new AfficheMatrix();
    document.getElementById("texteindice").textContent = "0,0";
    document.getElementById("coeffa1").value = matrice_generee.re[0].toString();
    document.getElementById("coeffb1").value = matrice_generee.im[0].toString();
    recupere_coeff_matrice_et_affiche_matrice();
    M.affiche_matrice_generee();
    M.setMatrixColor(0, 0, true);
  }

  /* On quitte la sélection sans rien calculer, et **sans revenir** dans la
     fenêtre de création : le cadre disparaît, la fenêtre reste fermée, et la
     matrice en cours d'édition est libérée. C'est ce que fait « Annuler »,
     et c'est aussi ce que fait toute autre action — un clic hors du cadre,
     une touche, le chargement d'un exemple, l'ouverture d'une autre fenêtre.

     Au moindre doute on sort. Rester dans un mode qui avale les clics serait
     bien pire qu'en sortir une fois de trop : le cadre se repose d'un clic. */
  function abandonne() {
    if (!actif) return;
    arrete();
    document.getElementById("affichagematrice").style.display = "none";
    ferme_fenetre_met_a_jour_parametres();
    matrice_generee = undefined;
    loop();
  }

  // --- ce que sketch.js vient demander ------------------------------------

  function estActif() { return actif; }

  // Rend true quand le clic a été consommé : le circuit ne doit alors rien voir.
  function clic() {
    if (!actif) return false;
    var bo = boites();
    if (dansBoite(bo.valider)) { valide(); return true; }
    if (dansBoite(bo.annuler)) { abandonne(); return true; }
    if (attrape()) return true;

    /* Un clic ailleurs qu'au cadre veut dire autre chose : poser un qbit,
       déplacer une porte, en supprimer une. On sort du mode, et on laisse le
       clic passer pour que le geste compte du premier coup. */
    abandonne();
    return false;
  }

  function declic() {
    if (!actif) return false;
    prise = null;
    return true;
  }

  function touche(code) {
    if (!actif) return false;
    if (code === 13) { valide(); return true; }    // Entrée
    if (code === 27) { abandonne(); return true; }  // Échap

    /* Maj, Ctrl et Alt seules ne font rien : les avaler sans sortir évite de
       perdre le cadre parce qu'un doigt s'est posé à côté. */
    if (code === 16 || code === 17 || code === 18) return true;

    /* Toute autre touche veut dire autre chose — Suppr pour effacer une porte,
       une lettre pour un raccourci. On sort, et on la laisse reprendre son
       rôle dans le circuit. */
    abandonne();
    return false;
  }

  return {
    demarre: demarre,
    estActif: estActif,
    dessine: dessine,
    suit: suit,
    clic: clic,
    declic: declic,
    touche: touche,
    abandonne: abandonne,
    // pour les tests
    _etat: function () {
      return { actif: actif, ligneHaut: ligneHaut, ligneBas: ligneBas,
               xMin: xMin, xMax: xMax, retenues: retenues,
               bloquantes: bloquantes, portes: portesCerclees(),
               message: message };
    },
    _boites: boites,
    _cadre: function (h, b, g, d) {
      ligneHaut = h; ligneBas = b; xMin = g; xMax = d; recalculeSelection();
    },
    _calculeMatrice: calculeMatrice,
    _valide: valide,
    _max: MAX_LIGNES,
  };
})();
