/* QAlgo — test des portes et des mesures partielles
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */

/* Rejoue les circuits de `FichiersDeTests/` et compare tout à des références
 * enregistrées. Ce test complète `test_algos.js`, qui ne couvre pas tout ce
 * dont le moteur dépend :
 *
 *   - `test_algos.js` ne hache que `G.n_Qbits_sortie`, les triplets
 *     (re, im, proba). Il ne regarde PAS les probabilités `Qbit[0][2]` et `[3]`
 *     portées par chaque porte et chaque mesure — c'est-à-dire ce qui s'affiche
 *     réellement à l'écran. Ici, elles sont dans l'empreinte.
 *   - sa sonde laisse `OnFaitLesMesures` à 0, donc le calcul des mesures
 *     partielles n'y est JAMAIS exécuté. Ici, il l'est, avec un résultat de
 *     tirage forcé pour que le test soit reproductible.
 *   - les circuits de `examples/` n'utilisent aucune des portes Y, RΦ, SWAP,
 *     racine de SWAP, racine de X, Fourier directe, ni l'anticontrôle. Les
 *     circuits de `FichiersDeTests/` les exercent toutes.
 *
 * En plus des empreintes, chaque circuit porte des attentes écrites en clair —
 * « cette ligne doit afficher 100 % de ket 1 » — vérifiées à chaque exécution.
 * Une empreinte dit que quelque chose a changé ; une attente dit quoi.
 *
 * Usage, depuis la racine du dépôt :
 *
 *   node outils/test_portes_et_mesures.js              rejoue tout et compare
 *   node outils/test_portes_et_mesures.js TestSwap     un seul circuit
 *   node outils/test_portes_et_mesures.js --enregistre (ré)écrit les références
 *
 * Code de sortie : 0 si tout concorde, 1 sinon.
 *
 * Après une modification VOLONTAIRE d'un calcul, relancer avec --enregistre et
 * vérifier dans le diff que seuls les circuits concernés ont bougé.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const RACINE = path.dirname(__dirname);
const DOSSIER = path.join(RACINE, "FichiersDeTests");
const REFERENCES = path.join(DOSSIER, "references.json");

const harnais = require(path.join(__dirname, "test_algos.js"));

/* --------------------------------------------------------------- attentes
   Ce qu'on doit lire, circuit par circuit. `lignes` donne le pourcentage de
   ket 1 attendu sur chaque ligne, dans l'ordre. `mesures` décrit les scénarios
   de mesure partielle : on force la valeur tirée sur une ligne, puis on dit ce
   que doivent afficher toutes les lignes. */
const ATTENTES = {
  TestPortesSimples: { lignes: [100, 0, 100, 0, 0, 100, 50, 0] },
  TestZRphi:         { lignes: [100, 100, 50, 100, 100, 100, 0] },
  TestControles:     { lignes: [100, 100, 0, 0, 0, 100, 100, 0] },
  TestToffoli:       { lignes: [100, 100, 100, 100, 0, 0] },
  TestKets:          { lignes: [0, 100, 50, 50] },
  TestSwap:          { lignes: [0, 100, 0, 100] },
  TestFourier:       { lignes: [0, 0, 100, 100] },

  /* Les deux lignes intriquées doivent s'accorder sur la valeur tirée, et les
     témoins ne doivent pas bouger : une mesure ne change rien à ce qui n'est
     pas intriqué avec la ligne mesurée. */
  TestMesurePartielle_Bell: {
    lignes: [50, 50, 50, 100],
    mesures: [
      { ligne: 0, valeur: 0, attendu: [null, 0, 50, 100],
        quoi: "ligne 1 mesurée à 0 : la ligne 2 intriquée doit suivre à 0" },
      { ligne: 0, valeur: 1, attendu: [null, 100, 50, 100],
        quoi: "ligne 1 mesurée à 1 : la ligne 2 intriquée doit suivre à 1" },
      { ligne: 1, valeur: 1, attendu: [100, null, 50, 100],
        quoi: "mesure par l'autre bout : la ligne 1 doit suivre à 1" },
    ],
  },
  TestMesurePartielle_GHZ: {
    lignes: [50, 50, 50, 50],
    mesures: [
      { ligne: 0, valeur: 0, attendu: [null, 0, 0, 50],
        quoi: "ligne 1 mesurée à 0 : les lignes 2 et 3 doivent suivre à 0" },
      { ligne: 0, valeur: 1, attendu: [null, 100, 100, 50],
        quoi: "ligne 1 mesurée à 1 : les lignes 2 et 3 doivent suivre à 1" },
      { ligne: 2, valeur: 1, attendu: [100, 100, null, 50],
        quoi: "mesure de la ligne 3 : les lignes 1 et 2 doivent suivre à 1" },
    ],
  },
};

// ------------------------------------------------------------------- sonde

const SONDE = `
globalThis.__hx = function(x){
  if (globalThis.__buf === undefined){
    globalThis.__buf = new ArrayBuffer(8);
    globalThis.__f64 = new Float64Array(globalThis.__buf);
    globalThis.__u32 = new Uint32Array(globalThis.__buf);
  }
  globalThis.__f64[0] = x;
  return globalThis.__u32[0].toString(16)+":"+globalThis.__u32[1].toString(16);
};

/* Le relevé : le vecteur servant à l'affichage, les probabilités portées par
   chaque sommet, et les pourcentages lisibles ligne par ligne. */
globalThis.__releve = function(){
  var hx = globalThis.__hx;
  var s = (OnFaitLesMesures != 0) ? G.n_Qbits_mesure : G.n_Qbits_sortie;
  var vect = [];
  if (s instanceof vecteur_etat)
    for (var i = 0; i < s.length; i++)
      vect.push((s.est_vivant(i) ? "" : "mort:") +
                hx(s.re[i])+","+hx(s.im[i])+","+hx(s.pr[i]));
  else
    for (var i = 0; i < s.length; i++)
      vect.push(s[i] === undefined ? "mort" : hx(s[i].x)+","+hx(s[i].y)+","+hx(s[i].proba));

  var marg = [];
  for (var k = 0; k < G.TabSommets.length; k++){
    var S = G.TabSommets[k];
    if (S === undefined) { marg.push("-"); continue; }
    var q = (S.Qbit && S.Qbit[0]) ? S.Qbit[0] : [];
    marg.push(k+"/"+S.type+"/"+S.num_ligne[0]+"/"+(S.mesure ? S.mesure[0] : "-")+
              "/"+hx(q[2])+"/"+hx(q[3]));
  }

  var lignes = [], tirees = [];
  for (var j = 0; j < G.lignes_quantiques.length; j++){
    var L = G.lignes_quantiques[j], fin = L[L.length-1];
    lignes.push(Math.round(fin.Qbit[0][3]*10000)/100);
    /* Une ligne MESUREE n'affiche pas une probabilite mais la valeur tiree :
       ses Qbit[0][2] et [3] gardent celles d'avant la mesure, et le moteur ne
       les recalcule que pour les lignes NON mesurees. On releve donc les deux. */
    tirees.push((fin.mesure && fin.mesure[0] === true) ? fin.val_instant_mesure[0] : null);
  }
  return { qubits: G.lignes_quantiques.length, amplitudes: s.length,
           vect: vect.join(";"), marg: marg.join(";"),
           lignes: lignes, tirees: tirees };
};

globalThis.__charge = function(code){
  langue = 0;
  textContainer1 = document.getElementById("textcontainer1");
  textContainer2 = document.getElementById("textcontainer2");
  Monselect = document.getElementById("monSelect");
  Graphes_nQbits = new Graphique();
  graf3DBloch1 = new GraphiqueBloch(true);
  graf3DBloch2 = new GraphiqueBloch(false);
  R = new Reglages();
  liste_boutons_crees = []; typeSelectionne = -1; demarrage = true;
  DeCodeStringEnGraph(code);
  G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
  return JSON.stringify(__releve());
};

/* Force une mesure partielle sur une ligne, avec une valeur imposée.
   C'est ce que fait fait_les_mesures_ligne_quantique() quand on clique sur une
   mesure, à ceci près qu'on impose le bit tiré au lieu de le tirer au sort :
   sans cela le test ne serait pas reproductible. On appelle ensuite le calcul
   SANS son argument, donc avec JeRecalculeToutesLesMesuresPartielles à false,
   pour qu'il garde la valeur imposée. */
globalThis.__mesure = function(num_ligne, valeur){
  var L = G.lignes_quantiques[num_ligne];
  for (var i = 0; i < L.length; i++){
    var S = L[i];
    S.mesure[S.indice_dune_ligne(num_ligne)] = true;
    if (S.type === 65) S.val_instant_mesure[0] = valeur;
  }
  OnFaitLesMesures = G.calcul_si_mesure_patielle_totale_ou_pas();
  G.calcul_nQbits_mesure_fixe_valeurs_mesurees_et_calcule_valeurs_instantannees_pour_les_autres_lignes();
  return JSON.stringify({ onFaitLesMesures: OnFaitLesMesures, releve: __releve() });
};
`;

function contexte() {
  const bac = harnais.fabriqueSandbox();
  vm.createContext(bac);
  vm.runInContext(harnais.sourceMoteur() + "\n" + SONDE, bac, { filename: "qalgo-moteur.js" });
  return bac;
}

const empreinte = (s) =>
  crypto.createHash("sha256").update(s).digest("hex").slice(0, 24);

/* Rejoue un circuit : le calcul normal, puis chaque scénario de mesure
   partielle, chacun dans un contexte NEUF — une mesure laisse le circuit dans
   un état modifié, deux scénarios enchaînés ne seraient pas indépendants. */
function rejoue(nom, code) {
  const attente = ATTENTES[nom] || {};
  const res = { normal: null, mesures: [] };

  const brut = vm.runInContext("__charge(" + JSON.stringify(code) + ")", contexte());
  const r = JSON.parse(brut);
  res.normal = {
    qubits: r.qubits, amplitudes: r.amplitudes, lignes: r.lignes,
    vect: empreinte(r.vect), marg: empreinte(r.marg),
  };

  for (const sc of (attente.mesures || [])) {
    const bac = contexte();
    vm.runInContext("__charge(" + JSON.stringify(code) + ")", bac);
    const m = JSON.parse(vm.runInContext(
      "__mesure(" + sc.ligne + "," + sc.valeur + ")", bac));
    res.mesures.push({
      ligne: sc.ligne, valeur: sc.valeur, quoi: sc.quoi,
      onFaitLesMesures: m.onFaitLesMesures,
      lignes: m.releve.lignes, tirees: m.releve.tirees,
      amplitudes: m.releve.amplitudes,
      vect: empreinte(m.releve.vect), marg: empreinte(m.releve.marg),
    });
  }
  return res;
}

// -------------------------------------------------------------- comparaison

function compare(nom, attendu, obtenu) {
  const att = ATTENTES[nom] || {};
  const ecarts = [];

  // 1. les attentes écrites en clair, qui disent QUOI a changé
  if (att.lignes)
    for (let i = 0; i < att.lignes.length; i++)
      if (Math.abs(obtenu.normal.lignes[i] - att.lignes[i]) > 0.01)
        ecarts.push("ligne " + (i + 1) + " : attendu " + att.lignes[i] +
                    " % de ket 1, obtenu " + obtenu.normal.lignes[i] + " %");

  for (const m of obtenu.mesures) {
    const sc = (att.mesures || []).find(
      (x) => x.ligne === m.ligne && x.valeur === m.valeur);
    if (!sc) continue;
    if (m.onFaitLesMesures !== 2)
      ecarts.push(m.quoi + " : le moteur n'est pas en mesure partielle " +
                  "(OnFaitLesMesures = " + m.onFaitLesMesures + ")");
    for (let i = 0; i < sc.attendu.length; i++) {
      if (sc.attendu[i] === null) continue;   // la ligne mesuree, voir ci-dessous
      if (Math.abs(m.lignes[i] - sc.attendu[i]) > 0.01)
        ecarts.push(m.quoi + " -> ligne " + (i + 1) + " : attendu " +
                    sc.attendu[i] + " %, obtenu " + m.lignes[i] + " %");
    }
    /* La ligne mesuree affiche la valeur tiree et non un pourcentage : c'est
       elle qu'on verifie ici, et elle doit porter la valeur imposee. */
    if (m.tirees[m.ligne] !== m.valeur)
      ecarts.push(m.quoi + " -> la ligne mesurée porte la valeur " +
                  m.tirees[m.ligne] + " au lieu de " + m.valeur);
  }

  // 2. les empreintes, qui disent que quelque chose a changé
  if (!attendu) return { ecarts, nouveau: true };

  for (const champ of ["qubits", "amplitudes", "vect", "marg"])
    if (String(attendu.normal[champ]) !== String(obtenu.normal[champ]))
      ecarts.push("empreinte " + champ + " : " + attendu.normal[champ] +
                  " -> " + obtenu.normal[champ]);

  if (attendu.mesures.length !== obtenu.mesures.length)
    ecarts.push("nombre de scénarios de mesure : " + attendu.mesures.length +
                " -> " + obtenu.mesures.length);
  else
    for (let k = 0; k < attendu.mesures.length; k++)
      for (const champ of ["vect", "marg"])
        if (attendu.mesures[k][champ] !== obtenu.mesures[k][champ])
          ecarts.push("mesure « " + obtenu.mesures[k].quoi + " » : empreinte " +
                      champ + " a changé");

  return { ecarts, nouveau: false };
}

// --------------------------------------------------------------------- main

function main() {
  const args = process.argv.slice(2);
  const enregistre = args.includes("--enregistre");
  const filtres = args.filter((a) => !a.startsWith("--"));

  if (!fs.existsSync(DOSSIER)) {
    console.error("dossier introuvable : FichiersDeTests/");
    process.exit(1);
  }

  let noms = fs.readdirSync(DOSSIER)
    .filter((f) => f.endsWith(".txt"))
    .map((f) => path.basename(f, ".txt"))
    .sort();
  if (filtres.length) noms = noms.filter((n) => filtres.includes(n));
  if (!noms.length) {
    console.error("aucun circuit à rejouer");
    process.exit(1);
  }

  const refs = fs.existsSync(REFERENCES)
    ? JSON.parse(fs.readFileSync(REFERENCES, "utf8")) : {};
  const neuves = enregistre ? {} : null;

  let echecs = 0, nouveaux = 0, scenarios = 0;
  for (const nom of noms) {
    const code = fs.readFileSync(path.join(DOSSIER, nom + ".txt"), "utf8");
    const obtenu = rejoue(nom, code);
    scenarios += obtenu.mesures.length;

    if (enregistre) {
      neuves[nom] = obtenu;
      // même en enregistrant, les attentes en clair doivent tenir
      const { ecarts } = compare(nom, null, obtenu);
      if (ecarts.length) {
        echecs++;
        console.log("ECHEC  " + nom);
        for (const e of ecarts) console.log("         " + e);
      } else {
        console.log("noté   " + nom.padEnd(26) + obtenu.normal.qubits +
                    " lignes, " + obtenu.mesures.length + " scénario(s) de mesure");
      }
      continue;
    }

    const { ecarts, nouveau } = compare(nom, refs[nom], obtenu);
    if (nouveau) {
      nouveaux++;
      console.log("NOUVEAU " + nom + " : aucune référence. Relancer avec --enregistre.");
      continue;
    }
    if (ecarts.length) {
      echecs++;
      console.log("ECHEC  " + nom);
      for (const e of ecarts) console.log("         " + e);
    } else {
      console.log("ok     " + nom.padEnd(26) + obtenu.normal.qubits +
                  " lignes, " + String(obtenu.normal.amplitudes).padStart(5) +
                  " amplitudes" +
                  (obtenu.mesures.length
                    ? ", " + obtenu.mesures.length + " mesure(s) partielle(s)" : ""));
    }
  }

  if (enregistre) {
    if (echecs) {
      console.log("\nRien n'a été enregistré : " + echecs + " circuit(s) ne donnent pas " +
                  "ce que leurs attentes annoncent.");
      process.exit(1);
    }
    fs.writeFileSync(REFERENCES, JSON.stringify(neuves, null, 1) + "\n", "utf8");
    console.log("\nRéférences écrites dans FichiersDeTests/references.json");
    process.exit(0);
  }

  console.log("");
  if (echecs || nouveaux) {
    if (echecs) console.log(echecs + " circuit(s) ont changé.");
    if (nouveaux) console.log(nouveaux + " circuit(s) sans référence.");
    process.exit(1);
  }
  console.log("Les " + noms.length + " circuits et les " + scenarios +
              " mesures partielles donnent exactement le même résultat qu'à la référence.");
  process.exit(0);
}

main();
