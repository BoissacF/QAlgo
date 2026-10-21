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

console.log("QAlgo — test des modules d'interface");
testePleinEcran();
testeHistorique();
console.log("");
if (echecs) {
  console.log(echecs + " contrôle(s) en échec sur " + total + ".");
  process.exit(1);
}
console.log("Les " + total + " contrôles passent.");
process.exit(0);
