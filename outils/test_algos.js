/* QAlgo — test de non-régression des algorithmes
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */

/* Ce test recharge le vrai moteur de QAlgo — les neuf fichiers de `src/`, dans
 * l'ordre où les pages les chargent — puis rejoue chaque circuit d'exemple et
 * compare les amplitudes obtenues à des valeurs de référence enregistrées.
 *
 * Il n'y a aucune réimplémentation : si un calcul change, le test le voit.
 * Comme le moteur s'attend à tourner dans un navigateur, ce fichier fournit
 * des substituts minimaux pour p5.js et pour le DOM (voir `fabriqueSandbox`).
 * Rien n'est dessiné : seuls les calculs sont exécutés.
 *
 * Usage, depuis la racine du dépôt :
 *
 *   node outils/test_algos.js                 rejoue tout et compare
 *   node outils/test_algos.js grover3bits     ne rejoue qu'un exemple
 *   node outils/test_algos.js --enregistre    (ré)écrit les références
 *   node outils/test_algos.js --rapide        saute les circuits lents
 *
 * Code de sortie : 0 si tout concorde, 1 sinon.
 *
 * Après une modification VOLONTAIRE d'un calcul, relancer avec --enregistre
 * et vérifier dans le diff que seuls les algorithmes concernés ont bougé.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const RACINE = path.dirname(__dirname);
const REFERENCES = path.join(RACINE, "outils", "references_algos.json");

// L'ordre de chargement est celui des pages : il compte.
const MOTEUR = [
  "bloch.js", "Graphic.js", "traduction.js", "affichage.js", "outils.js",
  "graphe.js", "sommetaretes.js", "calculsQuantiques.js", "sketch.js",
  "plein_ecran.js", "historique.js",
];

// Seul Shor pour 21 (18 qubits, 262144 amplitudes) demande quelques secondes ;
// tous les autres circuits sont instantanes.
const LENTS = ["shor9bits"];

const PRECISION = 1e9;      // amplitudes arrondies à 9 décimales pour l'empreinte
const DOMINANTS = 5;        // nombre d'états les plus probables conservés

// --------------------------------------------------------------- substituts

/* Un faux élément HTML : il retient ce qu'on lui écrit, et ne proteste jamais.
   Le moteur s'en sert pour lire le code de l'oracle, le texte d'explication,
   l'état des cases à cocher : il faut donc qu'il garde ses valeurs. */
function fabriqueElement(id) {
  const elt = {
    id: id,
    value: "",
    textContent: "",
    innerHTML: "",
    title: "",
    placeholder: "",
    checked: false,
    disabled: false,
    selectedIndex: 0,
    style: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    children: [],
    options: [],
    appendChild(e) { this.children.push(e); return e; },
    removeChild() {}, remove() {}, insertBefore() {}, setAttribute() {},
    getAttribute() { return null; }, addEventListener() {}, removeEventListener() {},
    focus() {}, blur() {}, click() {},
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    querySelector(sel) {
      this._sous = this._sous || {};
      if (!this._sous[sel]) this._sous[sel] = fabriqueElement(id + sel);
      return this._sous[sel];
    },
    querySelectorAll(sel) { return [this.querySelector(sel)]; },
    getElementsByClassName() { return []; }, getElementsByTagName() { return []; },
  };
  return elt;
}

function fabriqueSandbox() {
  const elements = new Map();
  const nul = () => undefined;
  // générateur pseudo-aléatoire à graine fixe : un test doit être reproductible
  let graine = 42;
  function aleatoire() {
    graine = (graine * 1103515245 + 12345) & 0x7fffffff;
    return graine / 0x7fffffff;
  }

  const faussesGraphiques = () => {
    const g = new Proxy(function () {}, {
      get(cible, prop) {
        if (prop === "width" || prop === "height") return 220;
        if (prop === "elt") return fabriqueElement("canvas");
        return g;
      },
      apply() { return g; },
    });
    return g;
  };

  const sandbox = {
    console: console,

    // --- constantes p5
    PI: Math.PI, TWO_PI: Math.PI * 2, HALF_PI: Math.PI / 2,
    QUARTER_PI: Math.PI / 4, E: Math.E,
    CENTER: "center", LEFT: "left", RIGHT: "right", TOP: "top",
    BOTTOM: "bottom", BASELINE: "baseline", CORNER: "corner",
    WEBGL: "webgl", P2D: "p2d", BOLD: "bold", NORMAL: "normal",
    RADIUS: "radius", CLOSE: "close", DEGREES: "degrees", RADIANS: "radians",

    // --- mathématiques p5 (ce sont elles que le moteur utilise réellement)
    sqrt: Math.sqrt, abs: Math.abs, pow: Math.pow, exp: Math.exp,
    log: Math.log, sq: (x) => x * x, cos: Math.cos, sin: Math.sin,
    tan: Math.tan, acos: Math.acos, asin: Math.asin, atan: Math.atan,
    atan2: Math.atan2, floor: Math.floor, ceil: Math.ceil,
    round: (x, d) => (d ? Math.round(x * Math.pow(10, d)) / Math.pow(10, d)
                        : Math.round(x)),
    min: Math.min, max: Math.max,
    dist: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
    constrain: (v, a, b) => Math.min(Math.max(v, a), b),
    map: (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c),
    int: (x) => parseInt(x, 10) || 0, float: parseFloat,
    nf: (x) => String(x), str: String,
    random: (a, b) => {
      if (Array.isArray(a)) return a[Math.floor(aleatoire() * a.length)];
      if (a === undefined) return aleatoire();
      if (b === undefined) return aleatoire() * a;
      return a + aleatoire() * (b - a);
    },
    randomSeed: (s) => { graine = s & 0x7fffffff; },
    millis: () => Date.now(),

    // --- tout ce qui dessine ou anime : sans effet ici
    print: nul, iprint: nul,
    createCanvas: faussesGraphiques, resizeCanvas: nul,
    createGraphics: faussesGraphiques,
    createDiv: () => fabriqueElement("div"),
    createElement: () => fabriqueElement("elt"),
    createSelect: () => fabriqueElement("select"),
    createSlider: () => {
      const s = fabriqueElement("slider");
      s.hide = nul; s.show = nul; s.position = nul; s.size = nul;
      s.changed = nul; s.input = nul; s.val = () => 0; s.parent = nul;
      return s;
    },
    select: () => null, selectAll: () => [],
    loadImage: () => ({ width: 1, height: 1, resize: nul }),
    loadFont: () => ({}),
    color: (...a) => ({ levels: a, toString: () => a.join(",") }),
    red: () => 0, green: () => 0, blue: () => 0, alpha: () => 255,
    fill: nul, noFill: nul, stroke: nul, noStroke: nul, strokeWeight: nul,
    background: nul, clear: nul, cursor: nul, noCursor: nul,
    text: nul, textSize: nul, textAlign: nul, textFont: nul,
    textStyle: nul, textWidth: () => 10, textAscent: () => 10,
    textLeading: nul,
    line: nul, ellipse: nul, circle: nul, rect: nul, square: nul,
    point: nul, arc: nul, triangle: nul, quad: nul, image: nul,
    beginShape: nul, endShape: nul, vertex: nul, curveVertex: nul,
    push: nul, pop: nul, translate: nul, rotate: nul, scale: nul,
    rotateX: nul, rotateY: nul, rotateZ: nul, sphere: nul, box: nul,
    lights: nul, ambientLight: nul, directionalLight: nul,
    enableDepthTests: nul, smooth: nul, pixelDensity: nul,
    frameRate: nul, loop: nul, noLoop: nul, redraw: nul,
    rectMode: nul, ellipseMode: nul, angleMode: nul, colorMode: nul,
    httpDo: nul, saveStrings: nul, save: nul,
    width: 1200, height: 800, windowWidth: 1200, windowHeight: 800,
    mouseX: 0, mouseY: 0, mouseIsPressed: false, frameCount: 0,
    keyCode: 0, key: "",

    // --- DOM minimal
    alert: nul,
    addEventListener: nul, removeEventListener: nul,
    // le moteur charge les exemples par fetch : substitut neutre, aucun
    // circuit n'est charge par le reseau pendant les tests
    fetch: () => Promise.resolve({ text: () => Promise.resolve("") }),
    localStorage: (function () {
      var m = {};
      return { getItem: (k) => (k in m ? m[k] : null),
               setItem: (k, v) => { m[k] = String(v); },
               removeItem: (k) => { delete m[k]; }, clear: () => { m = {}; } };
    })(),
    confirm: () => true,   // les dialogues de confirmation sont acceptés
    setTimeout: nul, clearTimeout: nul, setInterval: nul, clearInterval: nul,
    requestAnimationFrame: nul,
    Blob: function () {}, FileReader: function () {}, URL: { createObjectURL: nul },
    bootstrap: { Tooltip: function () {} },
    document: {
      getElementById(id) {
        if (!elements.has(id)) elements.set(id, fabriqueElement(id));
        return elements.get(id);
      },
      createElement: (t) => fabriqueElement(t),
      getElementsByClassName: () => [],
      getElementsByTagName: () => [],
      querySelector: (sel) => fabriqueElement(sel),
      querySelectorAll: () => [],
      addEventListener: nul,
      body: fabriqueElement("body"),
      head: fabriqueElement("head"),
    },
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.location = { href: "http://localhost/indexFR.html" };
  return sandbox;
}

// ------------------------------------------------------------- chargement

function sourceMoteur() {
  return MOTEUR.map((f) => {
    const p = path.join(RACINE, "src", f);
    if (!fs.existsSync(p)) {
      console.error("fichier du moteur introuvable : src/" + f);
      process.exit(1);
    }
    return "\n//# " + f + "\n" + fs.readFileSync(p, "utf8");
  }).join("\n");
}

/* Le code de mesure, ajouté au moteur : il doit tourner DANS le contexte,
   pour voir les variables globales du simulateur (G, R, OnFaitLesMesures…). */
const SONDE = `
globalThis.__qalgoRejoue = function (code) {
  langue = 0;
  // ce que ferait setup() et dont le decodage a besoin
  textContainer1 = document.getElementById('textcontainer1');
  textContainer2 = document.getElementById('textcontainer2');
  Monselect = document.getElementById('monSelect');
  Graphes_nQbits = new Graphique();
  graf3DBloch1 = new GraphiqueBloch(true);
  graf3DBloch2 = new GraphiqueBloch(false);
  R = new Reglages();
  liste_boutons_crees = [];
  typeSelectionne = -1;
  demarrage = true;
  DeCodeStringEnGraph(code);
  G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
  var sortie = G.n_Qbits_sortie || [];
  var amplitudes = [];
  for (var i = 0; i < sortie.length; i++) {
    amplitudes.push([sortie[i].x, sortie[i].y, sortie[i].proba]);
  }
  return JSON.stringify({
    qubits: G.lignes_quantiques.length,
    sommets: G.TabSommets.filter(function (s) { return s !== undefined; }).length,
    amplitudes: amplitudes
  });
};
`;

function rejoue(code) {
  const sandbox = fabriqueSandbox();
  vm.createContext(sandbox);
  vm.runInContext(sourceMoteur() + SONDE, sandbox, { filename: "qalgo-moteur.js" });
  const brut = vm.runInContext(
    "__qalgoRejoue(" + JSON.stringify(code) + ")", sandbox);
  return JSON.parse(brut);
}

// ------------------------------------------------------------- empreinte

function arrondi(x) {
  const v = Math.round(x * PRECISION) / PRECISION;
  return v === 0 ? 0 : v;   // supprime le -0
}

function binaire(i, n) {
  return i.toString(2).padStart(n, "0");
}

function resume(resultat) {
  const amp = resultat.amplitudes;
  const n = resultat.qubits;
  const arrondies = amp.map((c) => [arrondi(c[0]), arrondi(c[1]), arrondi(c[2])]);

  const empreinte = crypto.createHash("sha256")
    .update(JSON.stringify(arrondies)).digest("hex").slice(0, 32);

  const dominants = arrondies
    .map((c, i) => [i, c[2]])
    .sort((a, b) => b[1] - a[1])
    .slice(0, DOMINANTS)
    .filter((e) => e[1] > 1e-9)
    .map((e) => [binaire(e[0], n), Math.round(e[1] * 1e6) / 1e6]);

  const somme = arrondies.reduce((s, c) => s + c[2], 0);

  return {
    qubits: n,
    sommets: resultat.sommets,
    amplitudes: amp.length,
    somme_probas: Math.round(somme * 1e6) / 1e6,
    etats_dominants: dominants,
    empreinte: empreinte,
  };
}

// ------------------------------------------------------------------ test

function listeExemples() {
  const liste = [];
  for (const langue of ["fr", "en"]) {
    const dossier = path.join(RACINE, "examples", langue);
    for (const f of fs.readdirSync(dossier).sort()) {
      if (f.endsWith(".txt")) {
        liste.push({ nom: langue + "/" + path.basename(f, ".txt"),
                     chemin: path.join(dossier, f),
                     base: path.basename(f, ".txt") });
      }
    }
  }
  return liste;
}

function compare(attendu, obtenu) {
  const ecarts = [];
  for (const champ of ["qubits", "amplitudes", "somme_probas", "empreinte"]) {
    if (JSON.stringify(attendu[champ]) !== JSON.stringify(obtenu[champ])) {
      ecarts.push("  " + champ + " : attendu " + JSON.stringify(attendu[champ]) +
                  ", obtenu " + JSON.stringify(obtenu[champ]));
    }
  }
  if (JSON.stringify(attendu.etats_dominants) !==
      JSON.stringify(obtenu.etats_dominants)) {
    ecarts.push("  états les plus probables :");
    ecarts.push("    attendu " + JSON.stringify(attendu.etats_dominants));
    ecarts.push("    obtenu  " + JSON.stringify(obtenu.etats_dominants));
  }
  return ecarts;
}

function main() {
  const args = process.argv.slice(2);
  const enregistre = args.includes("--enregistre");
  const rapide = args.includes("--rapide");
  const filtres = args.filter((a) => !a.startsWith("--"));

  let exemples = listeExemples();
  if (rapide) exemples = exemples.filter((e) => !LENTS.includes(e.base));
  if (filtres.length) {
    exemples = exemples.filter((e) =>
      filtres.some((f) => e.nom === f || e.base === f));
  }
  if (!exemples.length) {
    console.error("aucun exemple ne correspond : " + filtres.join(" "));
    return 1;
  }

  const references = (!enregistre && fs.existsSync(REFERENCES))
    ? JSON.parse(fs.readFileSync(REFERENCES, "utf8")) : {};
  if (!enregistre && !Object.keys(references).length) {
    console.error("aucune référence enregistrée.");
    console.error("Lancer d'abord : node outils/test_algos.js --enregistre");
    return 1;
  }

  const nouvelles = enregistre ? {} : null;
  let echecs = 0;
  console.log("QAlgo — test de non-régression des algorithmes");
  console.log(exemples.length + " circuit(s) à rejouer" +
              (rapide ? " (mode rapide)" : "") + "\n");

  for (const ex of exemples) {
    const code = fs.readFileSync(ex.chemin, "utf8");
    const debut = Date.now();
    let obtenu;
    try {
      obtenu = resume(rejoue(code));
    } catch (e) {
      console.log("ECHEC  " + ex.nom + " : le moteur a levé une erreur");
      console.log("  " + String(e.stack || e).split("\n").slice(0, 3).join("\n  "));
      echecs++;
      continue;
    }
    const duree = ((Date.now() - debut) / 1000).toFixed(1);

    if (enregistre) {
      nouvelles[ex.nom] = obtenu;
      console.log("note   " + ex.nom.padEnd(20) + obtenu.qubits + " qubits, " +
                  obtenu.amplitudes + " amplitudes, " + duree + " s");
      continue;
    }

    const attendu = references[ex.nom];
    if (!attendu) {
      console.log("NOUVEAU " + ex.nom + " : aucune référence (relancer " +
                  "avec --enregistre)");
      echecs++;
      continue;
    }
    const ecarts = compare(attendu, obtenu);
    if (ecarts.length) {
      console.log("ECHEC  " + ex.nom + " : le résultat a changé");
      ecarts.forEach((l) => console.log(l));
      echecs++;
    } else {
      console.log("ok     " + ex.nom.padEnd(20) + obtenu.qubits + " qubits, " +
                  obtenu.amplitudes + " amplitudes, " + duree + " s");
    }
  }

  if (enregistre) {
    const anciennes = fs.existsSync(REFERENCES)
      ? JSON.parse(fs.readFileSync(REFERENCES, "utf8")) : {};
    const fusion = Object.assign({}, anciennes, nouvelles);
    const triees = {};
    Object.keys(fusion).sort().forEach((k) => { triees[k] = fusion[k]; });
    fs.writeFileSync(REFERENCES,
      JSON.stringify(triees, null, 2) + "\n", "utf8");
    console.log("\nRéférences écrites dans outils/references_algos.json");
    console.log("Relire le diff avant de valider : un changement non voulu " +
                "s'y verrait.");
    return 0;
  }

  console.log("");
  if (echecs) {
    console.log(echecs + " circuit(s) en échec.");
    return 1;
  }
  console.log("Les " + exemples.length +
              " circuits donnent exactement le même résultat qu'à la " +
              "référence.");
  return 0;
}

/* Lancé directement : on exécute les tests. Importé par un autre script :
   on expose de quoi recharger le moteur dans un bac à sable, ce qui sert à
   tester d'autres parties du simulateur. */
if (require.main === module) {
  process.exit(main());
} else {
  module.exports = { fabriqueSandbox, fabriqueElement, sourceMoteur, rejoue,
                     resume, MOTEUR, RACINE };
}
