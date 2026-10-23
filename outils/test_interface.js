/* QAlgo — test des modules d'interface
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */

/* Vérifie le bouton « Plein écran » et l'historique du circuit (annulation,
 * sauvegarde automatique) sans ouvrir de navigateur : le moteur réel est
 * rechargé dans le bac à sable de `test_algos.js`, et le DOM est simulé.
 *
 *   node outils/test_interface.js
 *
 * Code de sortie : 0 si tout passe, 1 sinon.
 *
 * Ce que ce test NE vérifie pas : le rendu. Qu'un bouton soit visible, bien
 * placé et cliquable ne se constate que dans un vrai navigateur.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const harnais = require(path.join(__dirname, "test_algos.js"));
const RACINE = path.dirname(__dirname);

let total = 0;
let echecs = 0;

function verif(nom, condition, detail) {
  total++;
  if (!condition) echecs++;
  console.log((condition ? "ok     " : "ECHEC  ") + nom +
              (detail !== undefined ? "  ->  " + detail : ""));
}

function titre(texte) {
  console.log("\n--- " + texte + " ---");
}

// =========================================================== plein écran
// Un DOM réduit au strict nécessaire : le module ne touche qu'à la barre de
// menu, et le reste du simulateur ne l'intéresse pas.

function elementSimule(nom) {
  return {
    nodeName: nom, className: "", id: "", type: "", textContent: "",
    title: "", style: {}, enfants: [], attributs: {},
    appendChild(e) { this.enfants.push(e); return e; },
    insertBefore(e, ref) { this.enfants.unshift(e); this.avant = ref; return e; },
    setAttribute(k, v) { this.attributs[k] = v; },
    addEventListener(t, f) { (this.ecouteurs = this.ecouteurs || {})[t] = f; },
    get firstElementChild() { return this.enfants[0] || null; },
  };
}

function testePleinEcran() {
  titre("bouton « Plein écran »");

  const navbar = elementSimule("ul");
  const home = elementSimule("li");
  home.id = "home";
  navbar.appendChild(home);
  const ecouteurs = {};

  const bac = {
    console: console,
    langue: 0,
    document: {
      fullscreenEnabled: true,
      fullscreenElement: null,
      readyState: "complete",
      documentElement: { requestFullscreen: () => Promise.resolve() },
      exitFullscreen: () => Promise.resolve(),
      querySelector: (s) => (s === "ul.navbar-nav" ? navbar : null),
      getElementById: () => null,
      createElement: (n) => elementSimule(n),
      addEventListener: (t, f) => { ecouteurs[t] = f; },
    },
  };
  bac.window = bac;
  vm.createContext(bac);
  vm.runInContext(fs.readFileSync(path.join(RACINE, "src/plein_ecran.js"), "utf8"),
                  bac, { filename: "plein_ecran.js" });

  const li = navbar.enfants[navbar.enfants.length - 1];
  const bouton = li && li.enfants[0];

  verif("le bouton est ajouté en bout de barre, après les menus",
        !!bouton && navbar.enfants.length === 2 && navbar.enfants[0] === home);
  verif("il porte ms-auto, qui le pousse à droite",
        !!li && li.className.split(" ").indexOf("ms-auto") >= 0,
        li && li.className);
  verif("il porte l'identifiant attendu",
        bouton && bouton.id === "boutonPleinEcran", bouton && bouton.id);
  verif("libellé français par défaut",
        bouton && bouton.textContent === "⛶ Plein écran",
        bouton && bouton.textContent);

  bac.langue = 1;
  bac.mettreAJourBoutonPleinEcran();
  verif("libellé anglais après bascule de langue",
        bouton.textContent === "⛶ Full screen", bouton.textContent);

  bac.document.fullscreenElement = {};          // entrée en plein écran
  ecouteurs.fullscreenchange();
  verif("le libellé propose de quitter quand le plein écran est actif",
        bouton.textContent === "✕ Exit full screen", bouton.textContent);
  verif("aria-pressed suit l'état",
        bouton.attributs["aria-pressed"] === "true",
        bouton.attributs["aria-pressed"]);

  bac.langue = 0;
  bac.mettreAJourBoutonPleinEcran();
  verif("retour au français, état plein écran conservé",
        bouton.textContent === "✕ Quitter le plein écran", bouton.textContent);

  bac.document.fullscreenElement = null;        // sortie par Échap
  ecouteurs.fullscreenchange();
  verif("Échap remet le libellé d'entrée",
        bouton.textContent === "⛶ Plein écran", bouton.textContent);

  // navigateur qui refuse le plein écran : aucun bouton, aucune erreur
  const vide = elementSimule("ul");
  const bac2 = {
    console: console, langue: 0,
    document: Object.assign({}, bac.document,
      { fullscreenEnabled: false, querySelector: () => vide }),
  };
  bac2.window = bac2;
  vm.createContext(bac2);
  vm.runInContext(fs.readFileSync(path.join(RACINE, "src/plein_ecran.js"), "utf8"),
                  bac2);
  verif("aucun bouton si le navigateur refuse le plein écran",
        vide.enfants.length === 0);
}

// ====================================================== historique du circuit
// Ici il faut le moteur réel : on vérifie qu'un circuit annulé revient
// exactement à son état d'avant, ce qui ne se simule pas.

function testeHistorique() {
  titre("historique : annulation, refaire, sauvegarde");

  const bac = harnais.fabriqueSandbox();
  let releve = null;
  let surTouche = null;
  let surFermeture = null;
  let reponseConfirm = true;

  bac.setInterval = (f) => { releve = f; return 1; };
  bac.document.addEventListener = (t, f) => { if (t === "keydown") surTouche = f; };
  bac.addEventListener = (t, f) => { if (t === "beforeunload") surFermeture = f; };
  bac.confirm = () => reponseConfirm;
  bac.fetch = () => Promise.resolve({
    text: () => Promise.resolve(fs.readFileSync(
      path.join(RACINE, "examples/circuitouverture.txt"), "utf8")),
  });

  vm.createContext(bac);
  vm.runInContext(harnais.sourceMoteur(), bac, { filename: "moteur.js" });
  const dans = (expr) => vm.runInContext(expr, bac);

  // amorçage équivalent à celui de setup()
  dans(`
    langue = 0;
    R = new Reglages();
    liste_boutons_crees = [];
    demarrage = true;
    ouverture_de_fichier_en_cours = false;
    largeur = 1200; hauteur = 700;
    textContainer1 = document.getElementById('textcontainer1');
    textContainer2 = document.getElementById('textcontainer2');
    Monselect = document.getElementById('monSelect');
    Graphes_nQbits = new Graphique();
    graf3DBloch1 = new GraphiqueBloch(true);
    graf3DBloch2 = new GraphiqueBloch(false);
  `);

  verif("le relevé périodique est posé", typeof releve === "function");
  verif("l'écouteur clavier est posé", typeof surTouche === "function");
  verif("l'avertissement de fermeture est posé", typeof surFermeture === "function");

  const bell = fs.readFileSync(path.join(RACINE, "examples/fr/bell1.txt"), "utf8");
  dans(`DeCodeStringEnGraph(${JSON.stringify(bell)})`);
  releve();
  const etatA = dans("CodeGraphEnString()");
  verif("un circuit d'exemple est chargé", etatA.split("!")[0] !== "0",
        etatA.split("!")[0] + " sommets");

  dans("G.ajouteSommet(60, 400, 35, 0)");       // l'utilisateur pose un qubit
  releve();
  const etatB = dans("CodeGraphEnString()");
  verif("poser un qubit change l'état du circuit", etatA !== etatB,
        etatA.split("!")[0] + " -> " + etatB.split("!")[0] + " sommets");
  verif("une annulation est disponible",
        dans("historiqueCircuit().annulations") === 1,
        dans("historiqueCircuit().annulations"));
  verif("le bouton « annuler » est actif",
        dans("document.getElementById('boutonAnnuler').disabled") === false);
  verif("le bouton « refaire » est encore inactif",
        dans("document.getElementById('boutonRefaire').disabled") === true);

  verif("annuleCircuit() réussit", dans("annuleCircuit()") === true);
  verif("le circuit est revenu exactement à son état d'avant",
        dans("CodeGraphEnString()") === etatA);
  verif("un « refaire » est maintenant disponible",
        dans("historiqueCircuit().refaire") === 1);
  verif("le bouton « refaire » est devenu actif",
        dans("document.getElementById('boutonRefaire').disabled") === false);

  verif("refaisCircuit() réussit", dans("refaisCircuit()") === true);
  verif("le circuit est de nouveau celui d'après",
        dans("CodeGraphEnString()") === etatB);

  dans("annuleCircuit()");
  verif("annuler au-delà du début retourne false",
        dans("annuleCircuit()") === false);
  verif("et le circuit reste cohérent",
        dans("CodeGraphEnString()") === etatA);
  verif("le bouton « annuler » redevient inactif quand la pile est vide",
        dans("document.getElementById('boutonAnnuler').disabled") === true);

  dans("G.ajouteSommet(60, 480, 35, 1)");
  releve();
  const etatC = dans("CodeGraphEnString()");
  let empeche = false;
  surTouche({ ctrlKey: true, shiftKey: false, key: "z",
              target: { tagName: "BODY" },
              preventDefault: () => { empeche = true; } });
  verif("Ctrl+Z annule depuis le clavier",
        dans("CodeGraphEnString()") === etatA);
  verif("Ctrl+Z neutralise l'action par défaut du navigateur", empeche);

  dans("refaisCircuit()");
  surTouche({ ctrlKey: true, shiftKey: false, key: "z",
              target: { tagName: "TEXTAREA" }, preventDefault: () => {} });
  verif("Ctrl+Z pendant une saisie de texte ne touche pas au circuit",
        dans("CodeGraphEnString()") === etatC);

  verif("le circuit est enregistré dans le navigateur",
        bac.localStorage.getItem("qalgo.circuit") === dans("CodeGraphEnString()"));
  verif("la date de sauvegarde est enregistrée",
        !!bac.localStorage.getItem("qalgo.circuit.date"));

  bac.localStorage.setItem("qalgo.circuit", etatA);
  dans("G = new Graph()");
  reponseConfirm = true;
  dans("chargeFichierIntro()");
  verif("au démarrage, le circuit sauvegardé est proposé et repris",
        dans("CodeGraphEnString()") === etatA);

  bac.localStorage.setItem("qalgo.circuit", etatA);
  dans("G = new Graph()");
  reponseConfirm = false;
  dans("chargeFichierIntro()");
  verif("si l'on refuse la reprise, la sauvegarde est oubliée",
        bac.localStorage.getItem("qalgo.circuit") === null);

  let avertit = false;
  surFermeture({ preventDefault: () => { avertit = true; } });
  verif("pas d'avertissement de fermeture quand la sauvegarde fonctionne",
        !avertit);
}

// ================================================== portes créées au bouton
// Les portes du bouton « Créer/porte » sont les seules du simulateur à porter
// une matrice explicite de 4^n coefficients. Aucun circuit d'`examples/` n'en
// contient, donc `test_algos.js` ne les voit pas : c'est ici qu'on vérifie le
// cache de sa chaîne, l'indépendance de la fenêtre d'édition, et que le codage
// du circuit reste identique au caractère près.

function testePortesCreees() {
  titre("portes créées au bouton : cache, édition, mémoire");

  const bac = harnais.fabriqueSandbox();
  vm.createContext(bac);
  vm.runInContext(harnais.sourceMoteur(), bac, { filename: "moteur.js" });
  const dans = (expr) => vm.runInContext(expr, bac);

  // amorçage équivalent à celui de setup(), puis un circuit réel pour que G existe
  dans(`
    langue = 0;
    R = new Reglages();
    liste_boutons_crees = [];
    typeSelectionne = -1;
    demarrage = true;
    textContainer1 = document.getElementById('textcontainer1');
    textContainer2 = document.getElementById('textcontainer2');
    Monselect = document.getElementById('monSelect');
    Graphes_nQbits = new Graphique();
    graf3DBloch1 = new GraphiqueBloch(true);
    graf3DBloch2 = new GraphiqueBloch(false);
    document.getElementById('nombrelignequantique').value = "3";
    document.getElementById('symboleportecree').value = "U";
    // le <select> de la page vaut "1" par défaut, et affichageCreationPorte()
    // l'y ramène : sans cela les coefficients relus des champs html sont undefined
    document.getElementById('selectnotationcoeff').value = "1";
    /* Les fonctions d'affichage posent la globale precision_coeff à partir de
       ce champ, par precision_proba + 2. Le faux élément rend "" si on ne lui
       écrit rien, donc parseInt("") = NaN, et texte_complexe() affichait
       "NaN-NaNi". La page, elle, a 1 par défaut. */
    document.getElementById('precisionChiffresApresVirgule').value = "1";
    precision_coeff = 3;
  `);
  const bell = fs.readFileSync(path.join(RACINE, "examples/fr/bell1.txt"), "utf8");
  dans(`DeCodeStringEnGraph(${JSON.stringify(bell)})`);

  // une matrice 8x8 aux coefficients variés : zéros, négatifs, irrationnels
  dans(`
    globalThis.matriceEssai = function () {
      let M = new matrice_porte(8);
      for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++) {
          if (i == j) M.ecrit(i, j, Math.SQRT1_2, -0.5);
          else if ((i + j) % 3 == 0) M.ecrit(i, j, 0, 0);
          else M.ecrit(i, j, -1 / 3, Math.PI / 7);
        }
      return M;
    };
    /* La chaine de reference, parcourue ligne par ligne et colonne par colonne
       comme le faisait CodeGraphEnString avant le cache. chaine_matrice(), lui,
       parcourt les deux Float64Array d'un seul indice : c'est l'accord entre
       les deux qui garantit que l'ordre des coefficients n'a pas change, et
       donc que les circuits deja enregistres restent lisibles. */
    globalThis.chaineDirecte = function (M) {
      let code = "";
      for (let u = 0; u < M.length; u++)
        for (let v = 0; v < M.length; v++) {
          code = code + M.re[u * M.cote + v].toString() + ";"
          code = code + M.im[u * M.cote + v].toString() + ";"
        }
      return code;
    };
    liste_boutons_crees = [];
    liste_boutons_crees.push(new BoutonPorte(0, matriceEssai(), "U", 3));
    globalThis.bouton = liste_boutons_crees[0];
  `);

  verif("la chaîne du cache est identique à celle de l'ancienne boucle",
        dans("bouton.chaine_matrice() === chaineDirecte(bouton.matrice)"),
        dans("bouton.chaine_matrice().length") + " caractères");
  verif("le cache est rempli après le premier appel",
        dans("bouton.cache_chaine !== null"));

  // on modifie la matrice sans prévenir : la chaîne ne doit pas bouger, c'est
  // la preuve qu'elle n'est pas reconstruite à chaque appel
  dans("bouton.matrice.ecrit(0, 0, 0.125, 0.25);");
  verif("sans invalidation, la chaîne n'est pas reconstruite",
        dans('bouton.chaine_matrice().indexOf("0.125;0.25;") === -1'));
  dans("bouton.oublie_chaine_matrice();");
  verif("après oublie_chaine_matrice(), la chaîne suit la modification",
        dans('bouton.chaine_matrice().indexOf("0.125;0.25;") === 0'));
  verif("et elle reste identique à l'ancienne boucle",
        dans("bouton.chaine_matrice() === chaineDirecte(bouton.matrice)"));

  // --- aller-retour complet du circuit
  dans(`liste_boutons_crees = [];
        liste_boutons_crees.push(new BoutonPorte(0, matriceEssai(), "U", 3));`);
  const codeA = dans("CodeGraphEnString()");
  dans(`DeCodeStringEnGraph(${JSON.stringify(codeA)})`);
  const codeB = dans("CodeGraphEnString()");
  verif("coder, décoder, recoder redonne la même chaîne", codeA === codeB,
        codeA.length + " caractères");
  verif("le bouton relu garde son symbole et son nombre de lignes",
        dans(`liste_boutons_crees.length === 1 &&
              liste_boutons_crees[0].symbole === "U" &&
              liste_boutons_crees[0].nAretes_max === 3`));
  verif("les 64 coefficients de la matrice relue sont identiques",
        dans(`(function () {
          let M = liste_boutons_crees[0].matrice, N = matriceEssai();
          if (M.length !== 8) return false;
          for (let k = 0; k < 64; k++)
            if (M.re[k] !== N.re[k] || M.im[k] !== N.im[k]) return false;
          return true;
        })()`));

  // --- la fenêtre d'édition travaille sur une copie
  dans(`Bouton_mis_a_jour_matrice = liste_boutons_crees[0];
        generateMatrix(Bouton_mis_a_jour_matrice.matrice);`);
  verif("matrice_generee n'est plus la matrice du bouton",
        dans("matrice_generee !== Bouton_mis_a_jour_matrice.matrice"));
  verif("ni les deux tableaux de flottants qui la portent",
        dans(`matrice_generee.re !== Bouton_mis_a_jour_matrice.matrice.re &&
              matrice_generee.im !== Bouton_mis_a_jour_matrice.matrice.im`));
  verif("mais elle en porte les mêmes valeurs",
        dans(`matrice_generee.re[2 * 8 + 5] === Bouton_mis_a_jour_matrice.matrice.re[2 * 8 + 5] &&
              matrice_generee.im[2 * 8 + 5] === Bouton_mis_a_jour_matrice.matrice.im[2 * 8 + 5]`));

  const avant = dans("Bouton_mis_a_jour_matrice.matrice.re[1 * 8 + 1]");
  dans("matrice_generee.ecrit(1, 1, 0.75, 0);");
  verif("saisir un coefficient ne touche pas à la porte (« Annuler » annule)",
        dans("Bouton_mis_a_jour_matrice.matrice.re[1 * 8 + 1]") === avant,
        "reste à " + avant);
  verif("et le circuit codé ne bouge pas tant qu'on n'a pas validé",
        dans("CodeGraphEnString()") === codeB);

  dans("mise_a_jour_des_portes_generees_deja_placees();");   // clic sur OK
  verif("après OK, la porte prend la nouvelle valeur",
        dans("Bouton_mis_a_jour_matrice.matrice.re[1 * 8 + 1] === 0.75"));
  verif("et le circuit codé change enfin",
        dans("CodeGraphEnString()") !== codeB);
  verif("le cache a été invalidé puis reconstruit à l'identique",
        dans(`liste_boutons_crees[0].chaine_matrice() ===
              chaineDirecte(liste_boutons_crees[0].matrice)`));

  // --- la matrice de travail est relâchée après la création
  dans(`liste_boutons_crees = [];
        Bouton_mis_a_jour_matrice = undefined;
        generateMatrix();
        globalThis.tailleAvant = matrice_generee.length;
        CreationPorte();`);
  verif("generateMatrix() avait bien construit une matrice 8x8",
        dans("tailleAvant === 8"));
  verif("matrice_generee est relâchée après la création",
        dans("matrice_generee === undefined"));
  verif("la porte créée garde pourtant sa matrice complète",
        dans(`liste_boutons_crees.length === 1 &&
              liste_boutons_crees[0].matrice.length === 8`));
  verif("et le circuit se code toujours",
        typeof dans("CodeGraphEnString()") === "string");

  /* Les coefficients sont rangés dans des Float64Array, mais ils s'affichent
     toujours par `complexe` : `complexe_en(i,j)` prête un objet unique, rempli
     à neuf à chaque appel, exactement comme `vecteur_etat.complexe_au_rang()`.
     C'est ce que voit l'utilisateur, en algébrique comme en trigonométrique. */
  dans(`liste_boutons_crees = [];
        liste_boutons_crees.push(new BoutonPorte(0, matriceEssai(), "U", 3));
        matrice_generee = liste_boutons_crees[0].matrice;
        precision_coeff = 3;//comme la page, qui affiche 1 décimale de probabilité`);

  verif("un coefficient s'affiche encore en algébrique a+bi",
        dans(`matrice_generee.complexe_en(0, 0).texte_complexe(1, true, true)`) ===
        "0.707-0.5i",
        dans(`matrice_generee.complexe_en(0, 0).texte_complexe(1, true, true)`));
  verif("un coefficient nul s'affiche encore comme un zéro",
        dans(`matrice_generee.complexe_en(1, 2).texte_complexe(1, true, true)`) === "0",
        dans(`matrice_generee.complexe_en(1, 2).texte_complexe(1, true, true)`));
  verif("et la forme trigonométrique r.E(θi) reste disponible",
        dans(`matrice_generee.complexe_en(0, 0).texte_complexe(2, true, true)`)
          .indexOf("E(") > 0 &&
        dans(`matrice_generee.complexe_en(0, 0).texte_complexe(2, true, true)`)
          .indexOf("NaN") === -1,
        dans(`matrice_generee.complexe_en(0, 0).texte_complexe(2, true, true)`));
  verif("le module et l'argument sont cohérents avec le coefficient",
        dans(`(function () {
          let c = matrice_generee.complexe_en(0, 0);
          let r = Math.sqrt(Math.SQRT1_2 * Math.SQRT1_2 + 0.25);
          return Math.abs(c.r - r) < 1e-9 &&
                 Math.abs(c.theta_rad - Math.atan2(-0.5, c.x)) < 1e-9;
        })()`));
  verif("le jeton prêté est bien toujours le même objet",
        dans(`matrice_generee.complexe_en(0, 0) === matrice_generee.complexe_en(3, 4)`));

  /* La matrice s'affiche par fenêtre glissante : la grille ne crée que
     n_max² cellules DOM, jamais dim². Le repli « tout afficher », quand la
     colonne est trop étroite pour cinq cellules, ne vaut plus que pour les
     petites matrices — à 9 lignes quantiques dim vaut 512, et la grille
     demanderait 262 144 <div>, ce qui fige le navigateur. */
  function fenetre(lignesQuantiques, largeurColonne) {
    dans(`document.getElementById('nombrelignequantique').value = "${lignesQuantiques}";
          document.getElementById('taillecol2matrix').offsetWidth = ${largeurColonne};
          globalThis.vue = new AfficheMatrix();`);
    return { dim: dans("vue.dim"), n_max: dans("vue.n_max") };
  }

  let v = fenetre(9, 1200);
  verif("9 lignes sur un écran large : fenêtre de 18 cellules sur 512",
        v.dim === 512 && v.n_max === 18, v.n_max + " sur " + v.dim);

  v = fenetre(9, 100);
  verif("9 lignes sur une colonne étroite : la fenêtre tient, elle ne s'ouvre pas à 512",
        v.dim === 512 && v.n_max === 4, v.n_max + " sur " + v.dim);

  v = fenetre(2, 100);
  verif("2 lignes sur une colonne étroite : tout s'affiche, comme avant",
        v.dim === 4 && v.n_max === 4, v.n_max + " sur " + v.dim);

  v = fenetre(1, 1200);
  verif("1 ligne : la matrice 2x2 entière",
        v.dim === 2 && v.n_max === 2, v.n_max + " sur " + v.dim);

  // et le compte réel de cellules posées dans la grille
  dans(`matrice_generee = matrice_porte.identite(512);
        document.getElementById('nombrelignequantique').value = "9";
        document.getElementById('taillecol2matrix').offsetWidth = 100;
        vue = new AfficheMatrix();
        document.getElementById('matrix').children = [];
        vue.affiche_matrice_generee();`);
  verif("la grille ne pose que 16 cellules, et non 262 144",
        dans("document.getElementById('matrix').children.length") === 16,
        dans("document.getElementById('matrix').children.length") + " cellules");
}

// ============================== sélection d'une partie du circuit
// Le module `selection_matrice.js` calcule la matrice d'un morceau de circuit.
// Deux garanties se vérifient sans navigateur : le cadre posé sur le circuit
// entier doit redonner exactement la matrice que l'ancien bouton produisait, et
// une sous-sélection doit donner le bon produit tensoriel.

function bacSelection(nomCircuit) {
  const bac = harnais.fabriqueSandbox();
  vm.createContext(bac);
  vm.runInContext(harnais.sourceMoteur(), bac, { filename: "moteur.js" });
  const dans = (expr) => vm.runInContext(expr, bac);
  dans(`
    langue = 0;
    R = new Reglages();
    liste_boutons_crees = [];
    typeSelectionne = -1;
    demarrage = true;
    ouverture_de_fichier_en_cours = false;
    textContainer1 = document.getElementById('textcontainer1');
    textContainer2 = document.getElementById('textcontainer2');
    Monselect = document.getElementById('monSelect');
    Graphes_nQbits = new Graphique();
    graf3DBloch1 = new GraphiqueBloch(true);
    graf3DBloch2 = new GraphiqueBloch(false);
    document.getElementById('nombrelignequantique').value = "1";
    document.getElementById('symboleportecree').value = "U";
    document.getElementById('selectnotationcoeff').value = "1";
    document.getElementById('precisionChiffresApresVirgule').value = "1";
    document.getElementById('taillecol2matrix').offsetWidth = 1200;
  `);
  const code = fs.readFileSync(
    path.join(RACINE, "examples/fr", nomCircuit + ".txt"), "utf8").trim();
  dans(`DeCodeStringEnGraph(${JSON.stringify(code)})`);
  dans("G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();");
  return { dans: dans, bac: bac };
}

// la matrice, recopiée hors du bac à sable pour pouvoir la comparer
function lisMatrice(dans, expr) {
  return dans(`(function(){ let M = ${expr};
    return { cote: M.cote, re: Array.from(M.re), im: Array.from(M.im) }; })()`);
}

function memeMatrice(a, b) {
  if (a.cote !== b.cote) return "côtés " + a.cote + " contre " + b.cote;
  for (let k = 0; k < a.re.length; k++)
    if (a.re[k] !== b.re[k] || a.im[k] !== b.im[k])
      return "coefficient " + k + " : " + a.re[k] + "+" + a.im[k] + "i contre " +
             b.re[k] + "+" + b.im[k] + "i";
  return "";
}

// compare à une matrice attendue, écrite ligne par ligne en parties réelles
function colleAuxReels(M, attendue) {
  if (M.cote * M.cote !== attendue.length) return "taille";
  for (let k = 0; k < attendue.length; k++) {
    if (Math.abs(M.re[k] - attendue[k]) > 1e-9) return "réel " + k;
    if (Math.abs(M.im[k]) > 1e-9) return "imaginaire " + k;
  }
  return "";
}

function testeSelectionCircuit() {
  titre("sélection d'une partie du circuit");

  /* 1. Le cadre sur tout le circuit doit redonner, au bit près, la matrice
     que calculait `genere_matrice_et_porte_a_partir_circuit_affiche_a_lecran`.
     C'est la garantie que le filtrage et le décalage des numéros de ligne
     n'ont rien changé au calcul lui-même. */
  for (const nom of ["bell1", "toffoli", "teleportation", "grover3bits"]) {
    const { dans } = bacSelection(nom);

    dans("genere_matrice_et_porte_a_partir_circuit_affiche_a_lecran();");
    const ancienne = lisMatrice(dans, "matrice_generee");

    dans("G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();");
    dans("SelectionCircuit._cadre(0, G.lignes_quantiques.length-1, -100000, 100000);");
    const nouvelle = lisMatrice(dans, "SelectionCircuit._calculeMatrice()");

    const ecart = memeMatrice(ancienne, nouvelle);
    verif("tout " + nom + " sélectionné : même matrice qu'avant", ecart === "",
          ecart || "identique au bit près, côté " + nouvelle.cote);
  }

  /* 2. Une sous-sélection. bell1 est un H sur q0 puis un CNOT commandé par q0.
     Le H seul vaut H ; le même H avec les deux lignes retenues vaut H⊗I ;
     et tout bell1 vaut CNOT·(H⊗I), dont la première colonne est l'état de
     Bell. Les trois sont vérifiés sur les valeurs, pas sur une empreinte. */
  {
    const { dans } = bacSelection("bell1");
    const r = Math.SQRT1_2;

    dans("SelectionCircuit._cadre(0, 0, 100, 220);");       // le H seul
    let e = dans("SelectionCircuit._etat()");
    let M = lisMatrice(dans, "SelectionCircuit._calculeMatrice()");
    verif("une seule porte retenue autour du H", e.retenues.length === 1,
          e.retenues.length + " retenue(s)");
    verif("le H seul donne bien la matrice de Hadamard",
          colleAuxReels(M, [r, r, r, -r]) === "",
          colleAuxReels(M, [r, r, r, -r]) || "conforme");

    dans("SelectionCircuit._cadre(0, 1, 100, 220);");       // le H, deux lignes
    M = lisMatrice(dans, "SelectionCircuit._calculeMatrice()");
    verif("le même H sur deux lignes donne H⊗I",
          colleAuxReels(M, [r, 0, r, 0,
                            0, r, 0, r,
                            r, 0, -r, 0,
                            0, r, 0, -r]) === "",
          colleAuxReels(M, [r, 0, r, 0, 0, r, 0, r, r, 0, -r, 0, 0, r, 0, -r]) || "conforme");

    dans("SelectionCircuit._cadre(0, 1, -100000, 100000);"); // tout bell1
    M = lisMatrice(dans, "SelectionCircuit._calculeMatrice()");
    verif("tout bell1 donne CNOT·(H⊗I)",
          colleAuxReels(M, [r, 0, r, 0,
                            0, r, 0, r,
                            0, r, 0, -r,
                            r, 0, -r, 0]) === "",
          colleAuxReels(M, [r, 0, r, 0, 0, r, 0, r, 0, r, 0, -r, r, 0, -r, 0]) || "conforme");
    verif("sa première colonne est l'état de Bell (∣00⟩+∣11⟩)/√2",
          Math.abs(M.re[0] - r) < 1e-9 && Math.abs(M.re[4]) < 1e-9 &&
          Math.abs(M.re[8]) < 1e-9 && Math.abs(M.re[12] - r) < 1e-9);
  }

  /* 3. La règle des contrôles. Dans toffoli, le X est sur q2 et ses deux
     contrôles sur q0 et q1. En coupant la ligne du bas, le X sort du cadre.
     En coupant celle du haut, il y reste mais perd un contrôle : il est alors
     refusé, parce qu'il agirait sur un qubit absent de la matrice. */
  {
    const { dans } = bacSelection("toffoli");

    dans("SelectionCircuit._cadre(0, G.lignes_quantiques.length-1, -100000, 100000);");
    let e = dans("SelectionCircuit._etat()");
    verif("cadre sur tout toffoli : rien n'est refusé", e.refusees.length === 0,
          e.retenues.length + " retenues, " + e.refusees.length + " refusées");

    dans("SelectionCircuit._cadre(0, G.lignes_quantiques.length-2, -100000, 100000);");
    e = dans("SelectionCircuit._etat()");
    verif("en coupant la ligne du bas, la porte est dehors et non refusée",
          e.refusees.length === 0,
          e.retenues.length + " retenues, " + e.refusees.length + " refusées");

    dans("SelectionCircuit._cadre(1, G.lignes_quantiques.length-1, -100000, 100000);");
    e = dans("SelectionCircuit._etat()");
    verif("en coupant la ligne du haut, la porte dont un contrôle sort est refusée",
          e.refusees.length === 1,
          e.retenues.length + " retenues, " + e.refusees.length + " refusée(s)");
    verif("et c'est bien le X à deux contrôles",
          dans(`(function(){ let et = SelectionCircuit._etat();
            return et.refusees[0].type === 3 &&
                   et.refusees[0].aretes_controle.length === 2; })()`));
  }

  /* 4. Le plafond de neuf lignes, éprouvé en tirant vraiment une poignée :
     on attrape le bord bas et on amène la souris sur la dix-huitième ligne. */
  {
    const { dans } = bacSelection("shor9bits");
    verif("shor9bits a bien plus de neuf lignes",
          dans("G.lignes_quantiques.length") === 18,
          dans("G.lignes_quantiques.length") + " lignes");

    dans("SelectionCircuit.demarre();");
    let e = dans("SelectionCircuit._etat()");
    verif("le cadre de départ n'en prend que neuf",
          e.ligneHaut === 0 && e.ligneBas === 8, "q" + e.ligneHaut + " à q" + e.ligneBas);

    dans(`(function(){ let et = SelectionCircuit._etat();
      mouseX = (et.xMin + et.xMax) / 2;
      mouseY = G.lignes_quantiques[et.ligneBas][0].y + 34; })()`);
    verif("la poignée du bord bas est attrapée", dans("SelectionCircuit.clic()") === true);

    dans("mouseY = G.lignes_quantiques[17][0].y;");
    dans("SelectionCircuit.suit();");
    e = dans("SelectionCircuit._etat()");
    verif("tirer jusqu'à q17 ne dépasse pas neuf lignes",
          e.ligneBas - e.ligneHaut + 1 === 9,
          (e.ligneBas - e.ligneHaut + 1) + " lignes");
    verif("et le message le dit", e.message.indexOf("9") > 0, e.message);
    dans("SelectionCircuit.declic();");
    dans("SelectionCircuit.touche(27);");
    verif("Échap sort du mode sélection",
          dans("SelectionCircuit.estActif()") === false);
  }

  /* 5. Une mesure dans la sélection n'a pas de matrice : `valide()` doit
     refuser sans rien calculer. */
  {
    const { dans } = bacSelection("bell1");
    dans("SelectionCircuit.demarre();");
    dans("SelectionCircuit._cadre(0, 1, -100000, 100000);");
    verif("le cadre sur tout bell1 contient une mesure",
          dans(`(function(){ let et = SelectionCircuit._etat();
            for (let i = 0; i < et.retenues.length; i++)
              if (et.retenues[i].type === 65) return true;
            return false; })()`) === true);
    dans("matrice_generee = undefined;");
    dans("SelectionCircuit._valide();");
    verif("valider refuse et ne calcule rien",
          dans("matrice_generee === undefined"));
    verif("et le message explique pourquoi",
          dans("SelectionCircuit._etat().message").indexOf("mesure") >= 0,
          dans("SelectionCircuit._etat().message"));
  }

  /* 6. Le dessin et les hameçons ne doivent jamais lever, mode actif ou non :
     ils sont appelés à chaque image et à chaque clic du simulateur. */
  {
    const { dans } = bacSelection("bell1");
    verif("hors mode, les hameçons ne consomment rien et ne lèvent pas",
          dans(`(function(){ try {
            SelectionCircuit.dessine(); SelectionCircuit.suit();
            return SelectionCircuit.clic() === false &&
                   SelectionCircuit.declic() === false &&
                   SelectionCircuit.touche(13) === false &&
                   SelectionCircuit.estActif() === false;
          } catch (e) { return "lève : " + e.message; } })()`) === true);
    verif("en mode, dessine() et suit() ne lèvent pas",
          dans(`(function(){ try {
            SelectionCircuit.demarre();
            SelectionCircuit.dessine(); SelectionCircuit.suit();
            return SelectionCircuit.estActif() === true;
          } catch (e) { return "lève : " + e.message; } })()`) === true);
  }
}

console.log("QAlgo — test des modules d'interface");
testePleinEcran();
testeHistorique();
testePortesCreees();
testeSelectionCircuit();
console.log("");
if (echecs) {
  console.log(echecs + " contrôle(s) en échec sur " + total + ".");
  process.exit(1);
}
console.log("Les " + total + " contrôles passent.");
process.exit(0);
