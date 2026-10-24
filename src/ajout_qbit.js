/* QAlgo — le « + » qui ajoute une ligne quantique, et les lignes vides
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */

/* Un « + » dans le coin haut gauche du circuit. Le survol ouvre une bulle —
 * « Ajouter un qbit » et un menu d'état, |0⟩ par défaut, |1⟩, |+⟩ ou |−⟩ au
 * choix — et chaque clic pose une ligne quantique de plus sous la dernière.
 *
 * Poser le qbit ne demande aucun code nouveau : `G.ajouteSommet()` ajoute déjà
 * la mesure de fin de ligne et le fil qui les relie, exactement comme un
 * glisser-déposer depuis la palette. Ce module ne décide donc que de l'endroit,
 * et il y a trois choses à y tenir :
 *
 *   1. Toutes les lignes ajoutées commencent à la MÊME abscisse, celle du qbit
 *      de la première ligne — celui du circuit d'accueil au démarrage. Leur
 *      mesure est ramenée sur celle de cette même ligne, sinon les lignes
 *      n'auraient pas la même longueur.
 *   2. L'écart vertical vaut 1,25 fois la hauteur d'une PORTE — et non du
 *      sommet, qui fait la moitié : deux portes posées l'une sous l'autre ne
 *      doivent pas se toucher. La hauteur est lue sur le qbit de la ligne du
 *      bas, donc l'espacement suit la taille du circuit.
 *   3. Si la nouvelle ligne tombait sous le bas de l'écran, le circuit entier
 *      est réduit juste assez pour qu'elle rentre, par le
 *      `change_Taille_sommets_Graphe()` des boutons de zoom. Après la
 *      réduction tout a bougé : les repères sont relus avant de poser le qbit.
 *
 * Le menu a un second rôle, mais seulement tant que le circuit n'a qu'une
 * ligne : en changer l'état remplace alors le qbit de cette ligne au lieu de
 * préparer le suivant. Voir `remplaceLeKet()`.
 *
 * Le module garde enfin les lignes vides horizontales quand on les déplace : une
 * ligne qui n'a qu'un qbit et sa mesure se déplace d'un bloc si on prend son
 * qbit, et reste inclinable par sa mesure. Ce sont exactement les lignes que le
 * « + » pose, d'où leur place ici. Voir `suitLeQbit()`.
 *
 * Le bouton est en HTML par-dessus le canvas, et non dessiné dedans : il porte
 * un <select>, et p5 ralentit beaucoup dès qu'on lui fait créer des éléments de
 * formulaire — c'est la raison pour laquelle #monSelect est déjà dans les pages
 * et non dans le canvas.
 */

var AjoutQbit = (function () {
  "use strict";

  var MARGE = 8;            // écart au coin du canvas, en pixels

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

  var conteneur = null;  // #parentducanvas, seulement pour y trouver le canvas
  var zone = null;       // le conteneur posé sur le canvas
  var bouton = null;     // le « + »
  var bulle = null;      // le message et le menu
  var etiquette = null;  // « Ajouter un qbit »
  var choix = null;      // le <select> des états
  var survol = false;    // la souris est sur le bouton ou sur la bulle
  var gauche = -1, haut = -1;   // dernière position posée, pour ne pas la réécrire

  // --- les textes, dans les deux langues --------------------------------

  function texte(cle) {
    var fr = { ajouter: "Ajouter un qbit" };
    var en = { ajouter: "Add a qubit" };
    return (typeof langue !== "undefined" && langue === 1) ? en[cle] : fr[cle];
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

  /* Tant que le circuit n'a qu'UNE ligne — celle du circuit d'accueil au
     démarrage —, changer le menu ne prépare pas le prochain qbit : il remplace
     celui qui est là. C'est le geste attendu quand on veut simplement
     commencer sur ∣1⟩ plutôt que sur ∣0⟩, sans avoir à supprimer la ligne pour
     en reposer une. Dès qu'il y a une deuxième ligne, le menu redevient le
     choix du prochain qbit et ne touche plus à rien : à deux lignes, laquelle
     remplacer n'aurait pas de réponse.

     Les coefficients du ket ne sont pas recopiés ici : on fabrique un sommet
     jetable du type voulu et on lit les siens, pour qu'ils ne puissent pas
     diverger de ceux du constructeur de `Sommet`. */
  function remplaceLeKet() {
    if (!circuitPret()) return false;
    if (nbLignes() !== 1) return false;
    if (typeof Sommet === "undefined") return false;

    var qbit = qbitDeLigne(0);
    if (!qbit || (qbit.type !== 0)) return false;

    // un qbit d'entrée qui change rend les mesures affichées caduques
    if ((typeof OnFaitLesMesures !== "undefined") && (OnFaitLesMesures !== 0) &&
        (typeof initialise_mesures === "function")) initialise_mesures();

    var modele = new Sommet(-1, 0, 0, qbit.diametre, typeChoisi());
    for (var i = 0; i < 2; i++)
      qbit.Qbit[0][i].coeff_complexe(modele.Qbit[0][i].x, modele.Qbit[0][i].y);
    qbit.Qbit[0][2] = qbit.Qbit[0][0].proba;
    qbit.Qbit[0][3] = qbit.Qbit[0][1].proba;

    doit_lancer_calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie = true;
    return true;
  }

  function ajoute() {
    if (!circuitPret()) return false;
    if ((typeof trop_de_qbits_pour_en_ajouter === "function") &&
        trop_de_qbits_pour_en_ajouter()) return false;

    /* Un cadre de sélection ouvert n'a plus de sens dès qu'on fait autre
       chose : on en sort, et le circuit reprend la main. */
    if (typeof SelectionCircuit !== "undefined") SelectionCircuit.abandonne();

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

  // --- le bouton et sa bulle --------------------------------------------

  function montre() {
    if (bulle) bulle.style.display = "flex";
  }

  function cache() {
    if (!bulle) return;
    // on ne referme pas la bulle sous un menu déroulant resté ouvert
    if (document.activeElement === choix) return;
    bulle.style.display = "none";
  }

  function traduis() {
    if (!etiquette) return;
    etiquette.textContent = texte("ajouter");
    bouton.setAttribute("aria-label", texte("ajouter"));
  }

  function cree() {
    if (zone) return true;
    if ((typeof document === "undefined") || !document.getElementById) return false;
    conteneur = document.getElementById("parentducanvas");
    if (!conteneur || !document.body || !document.body.appendChild) return false;

    zone = document.createElement("div");
    zone.id = "zoneAjoutQbit";
    zone.style.position = "absolute";
    zone.style.left = MARGE + "px";
    zone.style.top = MARGE + "px";
    zone.style.zIndex = "5";
    zone.style.display = "none";
    zone.style.alignItems = "center";

    bouton = document.createElement("button");
    bouton.type = "button";
    bouton.id = "boutonAjoutQbit";
    bouton.className = "btn btn-primary rounded-circle p-0 " +
                       "d-flex align-items-center justify-content-center";
    bouton.style.width = "26px";
    bouton.style.height = "26px";
    bouton.style.fontWeight = "bold";
    bouton.style.lineHeight = "1";
    bouton.textContent = "+";

    bulle = document.createElement("div");
    bulle.id = "bulleAjoutQbit";
    bulle.className = "d-flex align-items-center bg-secondary text-white " +
                      "rounded px-2 py-1";
    bulle.style.marginLeft = "6px";
    bulle.style.fontSize = "12px";
    bulle.style.whiteSpace = "nowrap";
    bulle.style.display = "none";

    etiquette = document.createElement("span");
    etiquette.id = "texteAjoutQbit";
    etiquette.style.marginRight = "6px";

    choix = document.createElement("select");
    choix.id = "selectAjoutQbit";
    choix.className = "form-select form-select-sm";
    choix.style.width = "66px";
    choix.style.height = "24px";
    choix.style.fontSize = "12px";
    choix.style.padding = "0 18px 0 6px";
    for (var i = 0; i < KETS.length; i++) {
      var option = document.createElement("option");
      option.value = String(KETS[i].type);
      option.textContent = KETS[i].libelle;
      choix.appendChild(option);
    }
    choix.selectedIndex = 0;        // |0⟩ par défaut

    bulle.appendChild(etiquette);
    bulle.appendChild(choix);
    zone.appendChild(bouton);
    zone.appendChild(bulle);
    document.body.appendChild(zone);

    // la zone couvre le bouton ET la bulle : passer de l'un à l'autre ne la
    // referme donc pas, sinon on ne pourrait pas atteindre le menu
    zone.addEventListener("mouseenter", function () { survol = true; montre(); });
    zone.addEventListener("mouseleave", function () { survol = false; cache(); });
    // sur un écran tactile il n'y a pas de survol : le premier appui sur le
    // « + » pose un qbit et ouvre la bulle, le menu est atteignable ensuite
    bouton.addEventListener("click", function () { montre(); ajoute(); });
    choix.addEventListener("change", remplaceLeKet);
    choix.addEventListener("blur", function () { if (!survol) cache(); });

    traduis();
    return true;
  }

  /* La zone est posée dans <body>, et non dans #parentducanvas : donner un
     `position: relative` à celui-ci changerait le `offsetLeft` du canvas, dont
     setup() se sert pour placer les deux fenêtres de coefficients.
     Elle suit donc le canvas en coordonnées de page, relevées à chaque image —
     le canvas se déplace quand la fenêtre change de taille, et quand une
     fenêtre de paramètres s'ouvre au-dessus de lui. Les deux rectangles
     bougent ensemble au défilement, leur différence n'en dépend pas. */
  function place() {
    if (!conteneur || !conteneur.querySelector) return;
    var toile = conteneur.querySelector("canvas");
    if (!toile || !toile.getBoundingClientRect) return;
    var rToile = toile.getBoundingClientRect();
    var rCorps = document.body.getBoundingClientRect();
    var g = Math.round(rToile.left - rCorps.left) + MARGE;
    var h = Math.round(rToile.top - rCorps.top) + MARGE;
    if (g !== gauche) { zone.style.left = g + "px"; gauche = g; }
    if (h !== haut) { zone.style.top = h + "px"; haut = h; }
  }

  /* Appelée par draw(), avant ses retours anticipés : le bouton disparaît avec
     le circuit — pendant le chargement d'un fichier, sous une fenêtre de
     paramètres, et pendant une sélection, qui a ses propres boutons. */
  function synchronise() {
    if (!cree()) return;
    var visible = circuitPret() &&
                  !((typeof SelectionCircuit !== "undefined") &&
                    SelectionCircuit.estActif());
    if (!visible) {
      survol = false;
      bulle.style.display = "none";
      zone.style.display = "none";
      return;
    }
    zone.style.display = "flex";
    place();
  }

  return {
    synchronise: synchronise,
    traduis: traduis,
    ajoute: ajoute,
    remplaceLeKet: remplaceLeKet,
    suitLeQbit: suitLeQbit,
    // pour les tests
    _mesureDuneLigneVide: mesureDuneLigneVide,
    _position: position,
    _ecart: ecart,
    _cree: cree,
    _type: typeChoisi,
    _elements: function () {
      return { zone: zone, bouton: bouton, bulle: bulle, choix: choix,
               etiquette: etiquette };
    },
  };
})();
