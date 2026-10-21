/* QAlgo — bouton « Plein écran » de la barre de menu
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */

/* Un clic masque la barre du navigateur, un second clic — ou la touche Échap —
 * revient à l'affichage normal. Le canvas suit tout seul : le passage en plein
 * écran déclenche un événement `resize`, donc `windowResized()` de sketch.js,
 * qui recalcule `largeur` et `hauteur`.
 *
 * Module autonome, calqué sur celui de Dariush : le bouton est créé ici, rien
 * n'est ajouté aux pages HTML. Son libellé suit la langue courante, et se met
 * à jour depuis `changeLanguage()` de traduction.js.
 */

(function () {
  "use strict";

  var LIBELLES = {
    fr: {
      entrer: "⛶ Plein écran",
      quitter: "✕ Quitter le plein écran",
      titreEntrer: "Masquer la barre du navigateur",
      titreQuitter: "Revenir à l'affichage normal",
    },
    en: {
      entrer: "⛶ Full screen",
      quitter: "✕ Exit full screen",
      titreEntrer: "Hide the browser bar",
      titreQuitter: "Back to the normal display",
    },
  };

  var bouton = null;

  function libelles() {
    // `langue` est déclarée par traduction.js : 0 français, 1 anglais
    var anglais = (typeof langue !== "undefined") && (langue === 1);
    return anglais ? LIBELLES.en : LIBELLES.fr;
  }

  // --- compatibilité (préfixe webkit pour les anciens Safari) ---------------

  function pleinEcranDisponible() {
    return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  }

  function estEnPleinEcran() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement);
  }

  function entrerPleinEcran() {
    var racine = document.documentElement;
    var demande = racine.requestFullscreen || racine.webkitRequestFullscreen;
    if (!demande) return;

    var resultat = demande.call(racine);
    if (resultat && typeof resultat.catch === "function") {
      resultat.catch(function (err) {
        console.warn("Plein écran refusé :", err);
      });
    }
  }

  function quitterPleinEcran() {
    var sortie = document.exitFullscreen || document.webkitExitFullscreen;
    if (!sortie) return;

    var resultat = sortie.call(document);
    if (resultat && typeof resultat.catch === "function") {
      resultat.catch(function () {});
    }
  }

  function basculerPleinEcran() {
    if (estEnPleinEcran()) {
      quitterPleinEcran();
    } else {
      entrerPleinEcran();
    }
  }

  // --- le bouton -----------------------------------------------------------

  function mettreAJourBouton() {
    if (!bouton) return;

    var mots = libelles();
    var actif = estEnPleinEcran();
    bouton.textContent = actif ? mots.quitter : mots.entrer;
    bouton.title = actif ? mots.titreQuitter : mots.titreEntrer;
    bouton.setAttribute("aria-pressed", actif ? "true" : "false");
  }

  function creerBouton() {
    var menu = document.querySelector("ul.navbar-nav");
    if (!menu || !pleinEcranDisponible()) return;
    if (document.getElementById("boutonPleinEcran")) return;

    var element = document.createElement("li");
    // ms-auto pousse l'element au bout de la barre : le bouton se place a
    // droite, a l'oppose des menus
    element.className = "nav-item ms-auto";

    bouton = document.createElement("button");
    bouton.type = "button";
    bouton.id = "boutonPleinEcran";
    bouton.className = "nav-link";
    // un <button> n'hérite ni de la police ni du fond : on les rétablit pour
    // qu'il soit indistinguable des autres entrées du menu
    bouton.style.background = "none";
    bouton.style.border = "0";
    bouton.style.font = "inherit";
    bouton.style.cursor = "pointer";
    bouton.addEventListener("click", basculerPleinEcran);

    element.appendChild(bouton);
    menu.appendChild(element);          // en bout de barre, donc a droite
    mettreAJourBouton();
  }

  // Le libellé suit l'état réel : Échap et F11 sortent du plein écran sans
  // passer par le bouton.
  document.addEventListener("fullscreenchange", mettreAJourBouton);
  document.addEventListener("webkitfullscreenchange", mettreAJourBouton);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", creerBouton);
  } else {
    creerBouton();
  }

  // appelé par changeLanguage() quand on clique sur le drapeau
  window.mettreAJourBoutonPleinEcran = mettreAJourBouton;
  window.basculerPleinEcran = basculerPleinEcran;
})();
