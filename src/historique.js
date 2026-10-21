/* QAlgo — historique du circuit : annulation, sauvegarde automatique
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */

/* Trois services, bâtis sur une seule idée : le circuit entier tient dans une
 * chaîne de caractères, que `CodeGraphEnString()` produit et que
 * `DeCodeStringEnGraph()` restaure à l'identique.
 *
 *   1. Ctrl+Z annule, Ctrl+Y (ou Ctrl+Maj+Z) refait.
 *   2. Le circuit est enregistré dans le navigateur ; s'il en reste un de la
 *      dernière visite, QAlgo propose de le reprendre au démarrage.
 *   3. Si l'enregistrement est impossible — navigation privée, stockage
 *      refusé — la fermeture de l'onglet demande confirmation.
 *
 * Le module relève l'état toutes les 800 ms et ne retient que les états qui
 * diffèrent du précédent. Ce choix évite de greffer des appels dans le moteur :
 * AUCUN fichier existant n'est modifié, et un déplacement à la souris, qui
 * produit des dizaines de changements, ne compte que pour une seule annulation.
 */

(function () {
  "use strict";

  var CLE = "qalgo.circuit";          // clé de stockage dans le navigateur
  var CLE_DATE = "qalgo.circuit.date";
  var PERIODE = 800;                  // ms entre deux relevés de l'état
  var PROFONDEUR = 60;                // nombre d'annulations mémorisées

  /* Mettre à true pour demander confirmation à chaque fermeture d'onglet.
     Par défaut, l'avertissement n'apparaît que si la sauvegarde automatique
     ne fonctionne pas : quand elle fonctionne, rien n'est perdu. */
  var AVERTIR_TOUJOURS = false;

  var passe = [];                     // états antérieurs, du plus ancien au plus récent
  var futur = [];                     // états annulés, pour les refaire
  var dernier = null;                 // dernier état relevé
  var restauration = false;           // vrai pendant qu'on restaure un état
  var stockageDisponible = true;

  // --- état courant du circuit ---------------------------------------------

  function etatCourant() {
    try {
      if (typeof G === "undefined" || !G || !G.TabSommets) return null;
      if (typeof demarrage !== "undefined" && demarrage === false) return null;
      if (typeof ouverture_de_fichier_en_cours !== "undefined" &&
          ouverture_de_fichier_en_cours) return null;
      return CodeGraphEnString();
    } catch (e) {
      return null;                    // le circuit est dans un état transitoire
    }
  }

  function circuitNonVide(code) {
    if (!code) return false;
    var n = parseInt(String(code).split("!")[0].split("#")[0], 10);
    return !isNaN(n) && n > 0;
  }

  // --- sauvegarde dans le navigateur ---------------------------------------

  function sauvegarde(code) {
    try {
      if (circuitNonVide(code)) {
        localStorage.setItem(CLE, code);
        localStorage.setItem(CLE_DATE, String(Date.now()));
      } else {
        localStorage.removeItem(CLE);
        localStorage.removeItem(CLE_DATE);
      }
      stockageDisponible = true;
    } catch (e) {
      stockageDisponible = false;     // navigation privée, quota, stockage refusé
    }
  }

  function circuitSauvegarde() {
    try {
      return localStorage.getItem(CLE);
    } catch (e) {
      stockageDisponible = false;
      return null;
    }
  }

  function dateSauvegarde() {
    try {
      var t = parseInt(localStorage.getItem(CLE_DATE), 10);
      return isNaN(t) ? null : new Date(t);
    } catch (e) {
      return null;
    }
  }

  // --- relevé périodique ---------------------------------------------------

  function releve() {
    if (restauration) return;
    var etat = etatCourant();
    if (etat === null) return;

    if (dernier === null) {           // premier relevé : rien à comparer
      dernier = etat;
      sauvegarde(etat);
      majBoutons();
      return;
    }
    if (etat === dernier) return;

    passe.push(dernier);
    if (passe.length > PROFONDEUR) passe.shift();
    futur.length = 0;                 // une modification rend le « refaire » caduc
    dernier = etat;
    sauvegarde(etat);
    majBoutons();
  }

  // --- état des deux boutons de la palette ---------------------------------

  /* Les boutons disent s'il y a quelque chose à annuler : c'est aussi ce qui
     fait comprendre à quoi ils servent, sans avoir à les essayer. */
  function majBoutons() {
    var annuler = document.getElementById("boutonAnnuler");
    var refaire = document.getElementById("boutonRefaire");
    if (annuler) annuler.disabled = (passe.length === 0);
    if (refaire) refaire.disabled = (futur.length === 0);
  }

  // --- annuler / refaire ---------------------------------------------------

  function restaure(code) {
    restauration = true;
    try {
      DeCodeStringEnGraph(code);
      if (typeof Selection !== "undefined") Selection = -1;
      // on relit l'état après restauration : le décodage peut normaliser
      // certaines valeurs, et `dernier` doit refléter ce qui est réellement là
      dernier = etatCourant() || code;
      sauvegarde(dernier);
    } catch (e) {
      console.warn("QAlgo : restauration impossible", e);
    } finally {
      restauration = false;
      majBoutons();
    }
  }

  function annule() {
    if (!passe.length) return false;
    var etat = etatCourant();
    if (etat !== null) futur.push(etat);
    restaure(passe.pop());
    return true;
  }

  function refais() {
    if (!futur.length) return false;
    var etat = etatCourant();
    if (etat !== null) passe.push(etat);
    restaure(futur.pop());
    return true;
  }

  // --- clavier -------------------------------------------------------------

  function saisieEnCours(cible) {
    if (!cible || !cible.tagName) return false;
    var balise = cible.tagName.toUpperCase();
    return balise === "INPUT" || balise === "TEXTAREA" || balise === "SELECT" ||
           cible.isContentEditable === true;
  }

  function surTouche(e) {
    if (!e.ctrlKey && !e.metaKey) return;
    if (saisieEnCours(e.target)) return;          // on tape dans un champ
    if (typeof R !== "undefined" && R && R.on_est_dans_une_fenetre) return;

    var touche = (e.key || "").toLowerCase();
    if (touche === "z" && !e.shiftKey) {
      e.preventDefault();
      annule();
    } else if (touche === "y" || (touche === "z" && e.shiftKey)) {
      e.preventDefault();
      refais();
    }
  }

  // --- reprise du circuit de la dernière visite ----------------------------

  function messageReprise(date) {
    var quand = "";
    if (date) {
      try {
        quand = date.toLocaleString();
      } catch (e) {
        quand = "";
      }
    }
    if (typeof langue !== "undefined" && langue === 1) {
      return "A circuit from your last visit was found" +
             (quand ? " (" + quand + ")" : "") +
             ".\n\nDo you want to carry on with it?\n" +
             "Cancel starts from the example circuit.";
    }
    return "Un circuit de ta dernière visite a été retrouvé" +
           (quand ? " (" + quand + ")" : "") +
           ".\n\nVeux-tu le reprendre ?\n" +
           "Annuler repart du circuit d'exemple.";
  }

  /* `chargeFichierIntro()` est appelée par `affichetitre()` quand le titre
     s'efface et que le circuit est vide : c'est exactement le moment de
     proposer la reprise, à la place du circuit d'accueil. */
  function brancheReprise() {
    if (typeof chargeFichierIntro !== "function") return;
    var intro = chargeFichierIntro;
    chargeFichierIntro = function () {
      var sauve = circuitSauvegarde();
      if (sauve && circuitNonVide(sauve)) {
        if (confirm(messageReprise(dateSauvegarde()))) {
          restaure(sauve);
          return;
        }
        sauvegarde("");               // refusé : on oublie cette sauvegarde
      }
      return intro.apply(this, arguments);
    };
  }

  // --- avertissement avant fermeture ---------------------------------------

  function surFermeture(e) {
    if (!AVERTIR_TOUJOURS && stockageDisponible) return;
    if (!circuitNonVide(etatCourant())) return;
    e.preventDefault();
    e.returnValue = "";
    return "";
  }

  // --- mise en route -------------------------------------------------------

  brancheReprise();
  majBoutons();
  document.addEventListener("keydown", surTouche);
  window.addEventListener("beforeunload", surFermeture);
  setInterval(releve, PERIODE);

  // accessible depuis la console, et pour un éventuel bouton d'annulation
  window.annuleCircuit = annule;
  window.refaisCircuit = refais;
  window.historiqueCircuit = function () {
    return { annulations: passe.length, refaire: futur.length,
             stockage: stockageDisponible };
  };
})();
