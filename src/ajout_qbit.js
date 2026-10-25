/* QAlgo — ajouter des qbits : le « + » de la palette, les lignes vides, l'aide
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */

/* Trois commodités autour des qbits d'entrée, qui n'ont en commun que leur
 * sujet. Aucune ne touche au moteur.
 *
 * 1. LE « + » DE LA PALETTE, en tête de la section Qubits, au-dessus des quatre
 *    boutons d'état, avec un menu qui dit lequel poser — ∣0⟩ par défaut, ∣1⟩,
 *    ∣+⟩ ou ∣−⟩ au choix. Chaque clic pose une ligne quantique de plus sous la
 *    dernière, là où les quatre boutons demandent un glisser-déposer et laissent
 *    à l'utilisateur le soin de viser.
 *
 *    Il est créé en JavaScript et inséré dans la colonne du menu : rien n'est
 *    ajouté aux pages, donc l'invariant des deux corps identiques (section 9 du
 *    récapitulatif) tient sans effort. Son infobulle est un simple attribut
 *    `title`, comme celles des boutons voisins, et suit `langue`.
 *
 *    Poser le qbit ne demande aucun code nouveau : `G.ajouteSommet()` ajoute
 *    déjà la mesure de fin de ligne et le fil qui les relie, exactement comme un
 *    glisser-déposer. Ce module ne décide donc que de l'endroit, et il y a trois
 *    choses à y tenir :
 *
 *      a. Toutes les lignes ajoutées commencent à la MÊME abscisse, celle du
 *         qbit de la première ligne — celui du circuit d'accueil au démarrage.
 *         Leur mesure est ramenée sur celle de cette même ligne, sinon les
 *         lignes n'auraient pas la même longueur.
 *      b. L'écart vertical vaut 1,25 fois la hauteur d'une PORTE — et non du
 *         sommet, qui fait la moitié : deux portes posées l'une sous l'autre ne
 *         doivent pas se toucher. La hauteur est lue sur le qbit de la ligne du
 *         bas, donc l'espacement suit la taille du circuit.
 *      c. Si la nouvelle ligne tombait sous le bas de l'écran, le circuit entier
 *         est réduit juste assez pour qu'elle rentre, par le
 *         `change_Taille_sommets_Graphe()` des boutons de zoom. Après la
 *         réduction tout a bougé : les repères sont relus avant de poser le
 *         qbit.
 *
 * 2. LES LIGNES VIDES RESTENT HORIZONTALES. Une ligne qui n'a qu'un qbit et sa
 *    mesure se déplace d'un bloc quand on prend son qbit, et reste inclinable
 *    par sa mesure. Ce sont exactement les lignes que le « + » pose.
 *    Voir `suitLeQbit()`.
 *
 * 3. L'AIDE AU SURVOL D'UN ÉLÉMENT. Survoler un élément du circuit annonce ce
 *    qu'on peut en faire : le double-clic quand il en a un — coefficients d'un
 *    qbit, Φ de RΦ, f(x) d'un oracle, matrice d'une porte créée, mesure
 *    partielle —, puis la suppression, la couleur au clic droit et la taille à
 *    la molette. Les indications s'empilent, une par ligne.
 *    Voir `indications()` et `aideAuSurvol()`.
 */

var AjoutQbit = (function () {
  "use strict";

  /* La hauteur d'une porte n'est PAS son diamètre de sommet : `afficheSommet()`
     la dessine par `rect(x − diametre, y − diametre, 2·diametre, 2·diametre)`,
     donc son carré fait deux diamètres de haut et déborde d'un diamètre de part
     et d'autre de la ligne. Un écart d'un diamètre et demi faisait donc se
     chevaucher deux portes posées l'une sous l'autre. */
  var PORTE = 2;            // hauteur d'une porte, en diamètres de sommet
  var ECART_LIGNES = 1.25;  // espacement vertical, en hauteurs de porte
  var MARGE_BAS = 0.625;    // place gardée sous la dernière ligne, idem
  var DIAMETRE_MIN = 10;    // en dessous le circuit n'est plus lisible
  var X_DEFAUT = 49;        // position du qbit de examples/circuitouverture.txt,
  var Y_DEFAUT = 91;        // au cas où le circuit serait vide

  // les quatre états que propose le menu, dans l'ordre d'affichage ; les
  // numéros de type sont ceux de la palette (voir choix_type() dans outils.js)
  var KETS = [
    { type: 0, libelle: "|0⟩" },
    { type: 1, libelle: "|1⟩" },
    { type: 2, libelle: "|+⟩" },
    { type: 22, libelle: "|−⟩" },
  ];

  var zone = null;         // la ligne « + » + menu, dans la colonne du menu
  var bouton = null;       // le « + »
  var choix = null;        // le <select> des états
  var toile = null;        // le canvas, pour y poser l'infobulle du survol
  var dernierTitre = null; // ce qui y est déjà écrit, pour ne pas le réécrire

  // --- les textes, dans les deux langues --------------------------------

  function texte(cle) {
    var fr = {
      ajouter: "Ajouter un qbit : une ligne quantique de plus sous la dernière",
      etat: "État du qbit ajouté",
      // les indications du survol, dans le style de la fenêtre d'aide
      coeffs: "Modifier coefficients qBit : Double Clic",
      phase: "Modifier Φ de RΦ : Double Clic",
      oracle: "Modifier f(x) Oracle : Double Clic",
      matrice: "Modifier la matrice de la porte : Double Clic",
      mesurePartielle: "Mesure partielle : Double Clic",
      supprimer: "Supprimer %s : clic maintenu + Suppr",
      couleur: "Modifier couleur : Clic droit",
      taille: "Modifier taille : Molette",
    };
    var en = {
      ajouter: "Add a qubit: one more quantum line below the last one",
      etat: "State of the added qubit",
      coeffs: "Change qBit coefficients: Double Click",
      phase: "Change Φ of RΦ: Double Click",
      oracle: "Modify f(x) Oracle: Double Click",
      matrice: "Change the gate matrix: Double Click",
      mesurePartielle: "Partial measurement: Double Click",
      supprimer: "Delete %s: hold the click + Del",
      couleur: "Change color: Right Click",
      taille: "Resize: Scroll wheel",
    };
    return (typeof langue !== "undefined" && langue === 1) ? en[cle] : fr[cle];
  }

  /* Le nom de l'élément, avec son article : « Supprimer LA porte ». Le français
     a besoin du genre, l'anglais d'un simple « the », d'où l'article collé au
     nom plutôt qu'au gabarit. */
  function nomAvecArticle(type) {
    var fr, en;
    if (type === 0) { fr = "le qbit"; en = "the qubit"; }
    else if (type === 10) { fr = "l'oracle"; en = "the oracle"; }
    else if ((type === 16) || (type === 17)) { fr = "le contrôle"; en = "the control"; }
    else if (type === 64) { fr = "l'afficheur"; en = "the display"; }
    else if ((type & 128) !== 0) { fr = "le personnage"; en = "the character"; }
    else { fr = "la porte"; en = "the gate"; }
    return (typeof langue !== "undefined" && langue === 1) ? en : fr;
  }

  /* Ce qu'un double-clic fait sur cet élément, ou "" s'il ne fait rien. La
     liste suit celle de `DoubleClicCanevas()` dans sketch.js, et doit la
     suivre : une indication fausse est pire qu'une absence d'indication. */
  function texteDoubleClic(type) {
    if (type === 0) return texte("coeffs");       // les quatre kets
    if (type === 7) return texte("phase");        // RΦ
    if ((type === 8) || (type === 9)) return texte("matrice");
    if (type === 10) return texte("oracle");
    if (type === 65) return texte("mesurePartielle");
    return "";
  }

  // --- repères pris sur le circuit --------------------------------------

  function nbLignes() {
    if (typeof G === "undefined" || !G || !G.lignes_quantiques) return 0;
    return G.lignes_quantiques.length;
  }

  // les lignes sont triées de haut en bas : la 0 est la première, la dernière
  // est celle sous laquelle on ajoute (voir retourne_liste_lignes_quantiques)
  function qbitDeLigne(i) {
    if ((i < 0) || (i >= nbLignes())) return null;
    var ligne = G.lignes_quantiques[i];
    return (ligne && ligne.length) ? ligne[0] : null;
  }

  function mesureDeLigne(i) {
    if ((i < 0) || (i >= nbLignes())) return null;
    var ligne = G.lignes_quantiques[i];
    for (var k = ligne.length - 1; k >= 0; k--)
      if (ligne[k].type === 65) return ligne[k];
    return null;
  }

  function diametreParDefaut() {
    if ((typeof diametre_default_sommet !== "undefined") &&
        (diametre_default_sommet > 0)) return diametre_default_sommet;
    return 35;
  }

  function hauteurEcran() {
    if ((typeof height !== "undefined") && (height > 0)) return height;
    if ((typeof hauteur !== "undefined") && (hauteur > 0)) return hauteur;
    return 0;
  }

  // l'écart entre deux lignes, en pixels : 2,5 diamètres, soit un quart de
  // porte de vide entre les carrés de deux portes voisines
  function ecart(d) {
    return ECART_LIGNES * PORTE * d;
  }

  /* De combien réduire le circuit pour qu'un qbit posé en `y` reste dans
     l'écran. Le coefficient s'applique aussi au diamètre, donc la ligne tombe
     exactement sur la limite : coeff * y, et coeff * diametre de hauteur. */
  function reduction(y, d) {
    var limite = hauteurEcran() - MARGE_BAS * PORTE * d;
    if ((limite <= 0) || (y <= limite)) return 1;
    var coeff = limite / y;
    if (d * coeff < DIAMETRE_MIN) coeff = DIAMETRE_MIN / d;
    return (coeff >= 1) ? 1 : coeff;
  }

  /* Où poser le prochain qbit, et de combien réduire le circuit avant de le
     poser. `coeff` vaut 1 quand la nouvelle ligne tient déjà dans l'écran. */
  function position() {
    var bas = qbitDeLigne(nbLignes() - 1);
    var premier = qbitDeLigne(0);

    var d = bas ? bas.diametre : diametreParDefaut();
    var x = premier ? premier.x : X_DEFAUT;

    if (!bas) {
      // circuit vide : il n'y a rien à réduire, on se contente de rester dans
      // l'écran si celui-ci est minuscule
      var y = Y_DEFAUT;
      var limite = hauteurEcran() - MARGE_BAS * PORTE * d;
      if ((limite > 0) && (y > limite)) y = limite;
      return { x: x, y: y, diametre: d, coeff: 1 };
    }

    var yBas = bas.y + ecart(d);
    return { x: x, y: yBas, diametre: d, coeff: reduction(yBas, d) };
  }

  // --- déplacer une ligne vide d'un bloc --------------------------------

  /* La mesure au bout d'une ligne quantique VIDE — un qbit, sa mesure, et rien
     entre les deux. `undefined` dès qu'il y a autre chose sur la ligne : une
     porte, un contrôle, une sonde.

     La structure est lue sur les arêtes du sommet, et non dans
     `G.lignes_quantiques` : pendant un glissement cette liste n'est pas refaite
     — le calcul attend le déclic — et ses numéros de ligne peuvent donc ne plus
     correspondre au dessin. Les arêtes, elles, sont toujours justes. */
  function mesureDuneLigneVide(num) {
    if ((typeof G === "undefined") || !G || !G.TabSommets) return undefined;

    var qbit = G.TabSommets[num];
    if (!qbit || (qbit.type !== 0)) return undefined;
    if (qbit.nAretes_sortantes !== 1) return undefined;
    if (qbit.nAretes_controle !== 0) return undefined;

    var mesure = G.TabSommets[qbit.aretes_sortantes[0].numSommetArrive];
    if (!mesure || (mesure.type !== 65)) return undefined;
    if ((mesure.nAretes_entrantes !== 1) || (mesure.nAretes_sortantes !== 0))
      return undefined;

    return mesure;
  }

  /* Une ligne vide se déplace d'un bloc : prendre son qbit emmène la mesure du
     même décalage, donc la ligne garde sa longueur et son horizontalité.

     Prendre la MESURE, en revanche, ne doit rien changer : c'est le seul moyen
     d'incliner une ligne ou d'en changer la longueur, et il doit rester. Cette
     fonction n'est donc appelée que pour le sommet tiré, et elle ne reconnaît
     qu'un qbit — la mesure n'a pas d'arête sortante, elle ne passe pas le
     test ci-dessus.

     Le décalage est celui que le qbit a RÉELLEMENT pris, et non celui de la
     souris : `changePositionRayon` ramène l'ordonnée sur la ligne tant que la
     souris n'a pas dépassé un rayon, et la mesure doit suivre le sommet, pas
     le curseur.

     Un décalage, et non l'ordonnée du qbit recopiée : une ligne inclinée garde
     son inclinaison en se déplaçant. Sous un rayon d'écart, c'est le rappel de
     `changePositionRayon` qui l'aplatit — comme il le fait pour n'importe quel
     élément reposé près de sa ligne. */
  function suitLeQbit(num, dx, dy) {
    if (!dx && !dy) return false;
    var mesure = mesureDuneLigneVide(num);
    if (!mesure) return false;

    mesure.changePositionRayon(mesure.x + dx, mesure.y + dy);
    return true;
  }

  // --- poser la ligne ---------------------------------------------------

  function typeChoisi() {
    if (!choix) return KETS[0].type;
    var t = parseInt(choix.value, 10);
    for (var i = 0; i < KETS.length; i++)
      if (KETS[i].type === t) return t;
    return KETS[0].type;
  }

  function circuitPret() {
    if (typeof G === "undefined" || !G || !G.TabSommets) return false;
    if ((typeof demarrage !== "undefined") && (demarrage === false)) return false;
    if ((typeof ouverture_de_fichier_en_cours !== "undefined") &&
        (ouverture_de_fichier_en_cours === true)) return false;
    if ((typeof R !== "undefined") && R && (R.on_est_dans_une_fenetre === true))
      return false;
    return true;
  }

  /* `ajouteSommet` pose la mesure de la nouvelle ligne au bord droit du canvas.
     On la ramène sur la mesure de la première ligne : sans cela les lignes
     n'auraient pas la même longueur dès que le circuit a été réduit, ou qu'il
     vient d'un fichier écrit sur un écran plus étroit. */
  function aligneLaMesure(avant) {
    if (G.TabSommets.length !== avant + 2) return;   // pas de mesure créée
    var qbit = G.TabSommets[avant];
    var mesure = G.TabSommets[avant + 1];
    if (!qbit || !mesure || (mesure.type !== 65)) return;

    var modele = mesureDeLigne(0);
    if (!modele || (modele === mesure)) return;      // c'est la première ligne
    if (modele.x <= qbit.x + qbit.diametre) return;  // trop à gauche, on laisse

    mesure.changePositionRayon(modele.x, mesure.y);
  }

  function ajoute() {
    if (!circuitPret()) return false;
    if ((typeof trop_de_qbits_pour_en_ajouter === "function") &&
        trop_de_qbits_pour_en_ajouter()) return false;

    /* Un cadre de sélection ouvert n'a plus de sens dès qu'on fait autre
       chose : on en sort, et le circuit reprend la main. */
    if (typeof SelectionCircuit !== "undefined") SelectionCircuit.abandonne();

    /* Le « + » est voisin des quatre boutons d'état, qui eux ARMENT un
       glisser-déposer. Cliquer l'un puis l'autre laissait un dépôt en attente,
       et le clic suivant sur le circuit posait un second qbit : poser tout de
       suite désarme donc ce qui attendait. */
    if (typeof typeSelectionne !== "undefined") typeSelectionne = -1;

    var p = position();
    if ((p.coeff < 1) && (typeof change_Taille_sommets_Graphe === "function")) {
      change_Taille_sommets_Graphe(p.coeff);
      p = position();              // tout a bougé : on relit les repères
    }

    var avant = G.TabSommets.length;
    if (typeof noLoop === "function") noLoop();
    G.ajouteSommet(p.x, p.y, p.diametre, typeChoisi());
    aligneLaMesure(avant);
    if (typeof loop === "function") loop();
    return true;
  }

  // --- l'aide au survol d'un élément du circuit -------------------------

  /* Les indications empilées, de la plus spécifique à la plus générale : ce que
     fait le double-clic sur cet élément-là, comment le supprimer, puis les deux
     gestes qui valent pour tout — la couleur au clic droit et la taille à la
     molette.

     Deux exceptions, qui viennent du code et non d'un choix d'affichage :
     une mesure ne s'efface pas (`keyPressed` la refuse, sans quoi la
     numérotation des lignes deviendrait incohérente), et les personnages
     n'acceptent ni couleur ni taille (`mousePressed` et `mouseWheel` sortent
     tous deux sur `type & 128`). */
  function indications(S) {
    var lignes = [];

    var dc = texteDoubleClic(S.type);
    if (dc) lignes.push(dc);

    if (S.type !== 65)
      lignes.push(texte("supprimer").replace("%s", nomAvecArticle(S.type)));

    if ((S.type & 128) === 0) {
      lignes.push(texte("couleur"));
      lignes.push(texte("taille"));
    }

    return lignes;
  }

  /* Ce que le survol doit annoncer, ou "" s'il n'a rien à dire. Le texte est
     ensuite posé dans le `title` du canvas et non peint dessus : c'est le
     navigateur qui l'affiche, donc avec le même délai et la même allure que les
     infobulles des boutons de la palette — c'est bien celles-là qu'il imite.
     Une infobulle native accepte le multiligne, ce qui permet d'empiler les
     indications sans rien dessiner sur le circuit.

     Rien n'est annoncé pendant un geste : un sommet tenu, un bouton de souris
     enfoncé, un élément de palette armé qui attend d'être posé, une sélection
     en cours. L'infobulle est une aide au repos ; pendant une action, et de
     toute façon, le navigateur ne montre pas d'infobulle bouton enfoncé. */
  function aideAuSurvol() {
    if (!circuitPret()) return "";
    if ((typeof SelectionCircuit !== "undefined") && SelectionCircuit.estActif())
      return "";
    if ((typeof Selection !== "undefined") && (Selection >= 0)) return "";
    if ((typeof mouseIsPressed !== "undefined") && (mouseIsPressed === true))
      return "";
    if ((typeof typeSelectionne !== "undefined") && (typeSelectionne >= 0))
      return "";
    if (typeof G.NumSommetQuiTouche !== "function") return "";

    var num = G.NumSommetQuiTouche();
    if (num < 0) return "";
    var S = G.TabSommets[num];
    if (!S) return "";

    return indications(S).join("\n");
  }

  function poseLaideAuSurvol() {
    if (!toile) {
      var parent = document.getElementById("parentducanvas");
      if (!parent || !parent.querySelector) return;
      toile = parent.querySelector("canvas");
      if (!toile) return;
    }
    var aide = aideAuSurvol();
    if (aide === dernierTitre) return;
    toile.title = aide;
    dernierTitre = aide;
  }

  // --- le bouton dans la palette ----------------------------------------

  function traduis() {
    if (!bouton) return;
    bouton.title = texte("ajouter");
    bouton.setAttribute("aria-label", texte("ajouter"));
    choix.title = texte("etat");
    // le titre déjà posé sur le canvas est dans l'ancienne langue
    dernierTitre = null;
  }

  function cree() {
    if (zone) return true;
    if ((typeof document === "undefined") || !document.getElementById) return false;

    var titre = document.getElementById("titrePalette1");
    if (!titre) return false;
    var colonne = titre.parentNode || document.getElementById("colonne1");
    if (!colonne || !colonne.insertBefore) return false;

    zone = document.createElement("div");
    zone.id = "zoneAjoutQbit";
    zone.className = "d-inline-flex align-items-center";
    zone.style.marginBottom = "2px";

    bouton = document.createElement("button");
    bouton.type = "button";
    bouton.id = "boutonAjoutQbit";
    bouton.className = "btn btn-secondary rounded-circle p-0 " +
                       "d-flex align-items-center justify-content-center";
    // les quatre boutons d'état voisins font 25 px : il s'aligne sur eux
    bouton.style.width = "25px";
    bouton.style.height = "25px";
    bouton.style.fontWeight = "bold";
    bouton.style.lineHeight = "1";
    bouton.style.marginLeft = "2px";
    bouton.style.marginRight = "4px";
    bouton.textContent = "+";

    choix = document.createElement("select");
    choix.id = "selectAjoutQbit";
    choix.className = "form-select form-select-sm p-0";
    // la colonne du menu ne fait que 110 px : 25 + 4 + 56 y tient
    choix.style.width = "56px";
    choix.style.height = "25px";
    choix.style.fontSize = "12px";
    choix.style.paddingLeft = "4px";
    choix.style.textAlignLast = "center";
    for (var i = 0; i < KETS.length; i++) {
      var option = document.createElement("option");
      option.value = String(KETS[i].type);
      option.textContent = KETS[i].libelle;
      choix.appendChild(option);
    }
    choix.selectedIndex = 0;        // |0⟩ par défaut

    zone.appendChild(bouton);
    zone.appendChild(choix);
    // juste sous l'intertitre « Qubits », donc au-dessus des quatre états
    colonne.insertBefore(zone, titre.nextSibling || null);

    bouton.addEventListener("click", function () {
      bouton.blur();   // sinon le bouton garde le cadre de focus de Bootstrap
      ajoute();
    });

    traduis();
    return true;
  }

  /* Appelée en tête de draw(), avant ses retours anticipés : seule l'infobulle
     du canvas a besoin d'être rafraîchie à chaque image, le bouton vivant dans
     le menu comme les autres. */
  function synchronise() {
    if (!cree()) return;
    poseLaideAuSurvol();
  }

  /* En page, le module se place tout seul dès que la colonne du menu existe.
     `readyState` n'est une chaîne que dans un vrai document : le bac à sable des
     tests n'en a pas, et c'est à eux de décider quand créer le bouton. */
  if ((typeof document !== "undefined") &&
      (typeof document.readyState === "string")) {
    if ((document.readyState === "loading") && document.addEventListener)
      document.addEventListener("DOMContentLoaded", cree);
    else
      cree();
  }

  return {
    synchronise: synchronise,
    traduis: traduis,
    ajoute: ajoute,
    suitLeQbit: suitLeQbit,
    // pour les tests
    _mesureDuneLigneVide: mesureDuneLigneVide,
    _aideAuSurvol: aideAuSurvol,
    _indications: indications,
    _doubleClic: texteDoubleClic,
    _position: position,
    _ecart: ecart,
    _cree: cree,
    _type: typeChoisi,
    _elements: function () {
      return { zone: zone, bouton: bouton, choix: choix, toile: toile };
    },
  };
})();
