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
  var DUREE_MESSAGE = 2500;  // ms d'affichage d'un refus

  var actif = false;
  var ligneHaut = 0, ligneBas = 0;   // indices de lignes quantiques, bornes incluses
  var xMin = 0, xMax = 0;            // bornes horizontales, en pixels du canvas
  var prise = null;                  // ce que la souris tient : voir attrape()
  var message = "", messageJusqua = 0;
  var retenues = [];                 // sommets pris dans la matrice
  var refusees = [];                 // sommets dans le cadre, mais non prenables

  // --- les textes, dans les deux langues --------------------------------

  function texte(cle) {
    var fr = {
      valider: "✓ Valider la sélection",
      annuler: "✗ Annuler",
      aide: "Déplace le cadre, ou tire ses poignées. Entrée pour valider, Échap pour annuler.",
      tropDeLignes: "Tu ne peux pas sélectionner plus que " + MAX_LIGNES + " lignes quantiques.",
      vide: "La sélection ne contient aucune porte.",
      mesure: "Une sélection qui contient une mesure n'a pas de matrice : une mesure n'est pas réversible.",
      pasDeCircuit: "Il n'y a pas encore de ligne quantique à sélectionner.",
      refusee: "Porte refusée : son contrôle vient d'une ligne hors du cadre.",
    };
    var en = {
      valider: "✓ Use this selection",
      annuler: "✗ Cancel",
      aide: "Move the frame, or drag its handles. Enter to confirm, Esc to cancel.",
      tropDeLignes: "You cannot select more than " + MAX_LIGNES + " quantum lines.",
      vide: "The selection contains no gate.",
      mesure: "A selection containing a measurement has no matrix: a measurement is not reversible.",
      pasDeCircuit: "There is no quantum line to select yet.",
      refusee: "Gate refused: its control comes from a line outside the frame.",
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
    var i;
    for (i = 0; i < sommet.num_ligne.length; i++)
      if (sommet.num_ligne[i] >= 0) lignes.push(sommet.num_ligne[i]);

    if (sommet.aretes_controle)
      for (i = 0; i < sommet.aretes_controle.length; i++) {
        var depart = G.TabSommets[sommet.aretes_controle[i].numSommetDepart];
        if (depart && depart.num_ligne[0] >= 0) lignes.push(depart.num_ligne[0]);
      }
    return lignes;
  }

  function dansLaBande(ligne) {
    return (ligne >= ligneHaut) && (ligne <= ligneBas);
  }

  /* Un élément participe au calcul s'il a un type qui agit sur l'état. Les
     personnages (128, 129, 130) sont du décor, les qubits d'entrée (type <= 2)
     sont l'état de départ et non une porte. */
  function participeAuCalcul(sommet) {
    return (sommet.type > 2) && ((sommet.type & 128) === 0);
  }

  /* Recalcule `retenues` et `refusees`. Un élément est dans le cadre si son
     abscisse y est et si sa ligne principale est dans la bande ; il est retenu
     si, en plus, toutes les lignes qu'il touche sont dans la bande. */
  function recalculeSelection() {
    retenues = [];
    refusees = [];
    if (!nbLignes()) return;

    for (var i = 0; i < G.TabSommets.length; i++) {
      var s = G.TabSommets[i];
      if (s === undefined) continue;
      if (!participeAuCalcul(s)) continue;
      if (s.x < xMin || s.x > xMax) continue;
      if (!dansLaBande(s.num_ligne[0])) continue;

      var lignes = lignesTouchees(s);
      var complet = true;
      for (var j = 0; j < lignes.length; j++)
        if (!dansLaBande(lignes[j])) { complet = false; break; }

      if (complet) retenues.push(s); else refusees.push(s);
    }
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

    // les anneaux autour des portes
    strokeWeight(3);
    var i;
    for (i = 0; i < retenues.length; i++) {
      stroke(30, 160, 70);
      ellipse(retenues[i].x, retenues[i].y, retenues[i].diametre * 1.45);
    }
    for (i = 0; i < refusees.length; i++) {
      stroke(210, 50, 50);
      ellipse(refusees[i].x, refusees[i].y, refusees[i].diametre * 1.45);
    }

    // les poignées
    var p = poignees();
    stroke(60, 90, 160); strokeWeight(1); fill(255);
    for (i = 0; i < p.length; i++)
      rect(p[i].x - POIGNEE / 2, p[i].y - POIGNEE / 2, POIGNEE, POIGNEE);

    // le compte des lignes retenues, dans le coin du cadre
    noStroke(); fill(60, 90, 160);
    textSize(15); textAlign(LEFT, BOTTOM);
    var k = ligneBas - ligneHaut + 1;
    text("q" + ligneHaut + " → q" + ligneBas + "  (" + k +
         (k > 1 ? " lignes" : " ligne") + ", " + retenues.length +
         (retenues.length > 1 ? " portes)" : " porte)"), g + 4, h - 4);

    // les boutons et l'aide
    var bo = boites();
    dessineBouton(bo.valider, texte("valider"), dansBoite(bo.valider) ?
                  color(30, 140, 60) : color(40, 110, 50));
    dessineBouton(bo.annuler, texte("annuler"), dansBoite(bo.annuler) ?
                  color(150, 60, 60) : color(110, 50, 50));

    noStroke(); fill(70); textSize(14); textAlign(CENTER, TOP);
    text(texte("aide"), width / 2, bo.valider.y + bo.valider.h + 6);

    // un refus éventuel, en rouge, au milieu
    if (message !== "" && millis() < messageJusqua) {
      textSize(20); textAlign(CENTER, CENTER);
      var l = textWidth(message) + 30;
      noStroke(); fill(255, 240, 240, 245);
      rect(width / 2 - l / 2, 78, l, 40, 6);
      stroke(190, 40, 40); strokeWeight(1.5); noFill();
      rect(width / 2 - l / 2, 78, l, 40, 6);
      noStroke(); fill(170, 30, 30);
      text(message, width / 2, 98);
    } else if (message !== "") {
      message = "";
    }

    pop();
  }

  // --- déplacement et redimensionnement ----------------------------------

  function attrape() {
    var p = poigneeSousLaSouris();
    if (p) { prise = { bords: p.bords }; return true; }

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
        var nh = Math.min(ligneLaPlusProche(mouseY), ligneBas);
        if (ligneBas - nh + 1 > MAX_LIGNES) { annonce("tropDeLignes"); nh = ligneBas - MAX_LIGNES + 1; }
        ligneHaut = nh;
      }
      if (prise.bords.indexOf("b") >= 0) {
        var nb = Math.max(ligneLaPlusProche(mouseY), ligneHaut);
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
    refusees = [];
  }

  function valide() {
    if (!retenues.length) { annonce("vide"); return; }

    for (var i = 0; i < retenues.length; i++)
      if (retenues[i].type === 65) { annonce("mesure"); return; }

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

  function annule() {
    arrete();
    ouvre_fenetre_met_a_jour_parametres();
    document.getElementById("affichagematrice").style.display = "inline";
    generateMatrix();
  }

  // --- ce que sketch.js vient demander ------------------------------------

  function estActif() { return actif; }

  // Rend true quand le clic a été consommé : le circuit ne doit alors rien voir.
  function clic() {
    if (!actif) return false;
    var bo = boites();
    if (dansBoite(bo.valider)) { valide(); return true; }
    if (dansBoite(bo.annuler)) { annule(); return true; }
    attrape();
    return true;
  }

  function declic() {
    if (!actif) return false;
    prise = null;
    return true;
  }

  function touche(code) {
    if (!actif) return false;
    if (code === 13) { valide(); return true; }    // Entrée
    if (code === 27) { annule(); return true; }    // Échap
    return true;                                   // on avale tout le reste
  }

  return {
    demarre: demarre,
    estActif: estActif,
    dessine: dessine,
    suit: suit,
    clic: clic,
    declic: declic,
    touche: touche,
    // pour les tests
    _etat: function () {
      return { actif: actif, ligneHaut: ligneHaut, ligneBas: ligneBas,
               xMin: xMin, xMax: xMax, retenues: retenues, refusees: refusees,
               message: message };
    },
    _cadre: function (h, b, g, d) {
      ligneHaut = h; ligneBas = b; xMin = g; xMax = d; recalculeSelection();
    },
    _calculeMatrice: calculeMatrice,
    _valide: valide,
    _max: MAX_LIGNES,
  };
})();
