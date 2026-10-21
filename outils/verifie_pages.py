# -*- coding: utf-8 -*-
"""Vérifie la cohérence des deux pages de QAlgo.

`index.html` (anglais) et `indexFR.html` (français) sont deux pages distinctes
parce qu'un moteur de recherche associe une langue à une URL : chacune porte
donc son propre bloc de balises `<head>`. En revanche **leur corps doit rester
rigoureusement identique**, à la seule exception de la balise `<body>` :
`index.html` y appelle `changeLanguage()`, qui traduit l'interface au
chargement.

Ce script contrôle cet invariant, et contrôle aussi que tous les identifiants
auxquels `src/traduction.js` s'adresse existent bien dans la page — une faute
de frappe sur un `id` passerait sinon inaperçue jusqu'à ce qu'un visiteur
clique sur le drapeau.

Usage, depuis la racine du dépôt :

    python outils/verifie_pages.py

Sortie : code 0 si tout est cohérent, 1 sinon.
"""

import difflib
import io
import os
import re
import sys

try:  # console Windows : evite les accents illisibles ou une erreur d'encodage
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except (AttributeError, ValueError):  # Python < 3.7, ou sortie redirigee
    pass

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE_EN = "index.html"
PAGE_FR = "indexFR.html"
TRADUCTION = os.path.join("src", "traduction.js")

# La seule divergence autorisée dans le corps des deux pages.
BODY_EN = '<body onload="changeLanguage()">'
BODY_FR = "<body >"


def lire(chemin):
    with io.open(chemin, encoding="utf-8", newline="") as f:
        return f.read()


def corps(texte, chemin):
    """Renvoie le corps de la page, après la fermeture de l'en-tête."""
    if texte.count("</head>") != 1:
        raise SystemExit("%s : %d balise(s) </head>, une seule attendue"
                         % (chemin, texte.count("</head>")))
    return texte.split("</head>", 1)[1]


def verifie_corps_identiques():
    """Le corps des deux pages doit être identique, balise <body> exceptée."""
    en = corps(lire(PAGE_EN), PAGE_EN).replace(BODY_EN, BODY_FR, 1)
    fr = corps(lire(PAGE_FR), PAGE_FR)
    if en == fr:
        print("OK   le corps des deux pages est identique")
        return True
    print("ECHEC   le corps des deux pages a divergé :")
    differences = list(difflib.unified_diff(
        fr.splitlines(), en.splitlines(),
        fromfile=PAGE_FR, tofile=PAGE_EN, lineterm="", n=1))
    for ligne in differences[:60]:
        print("   " + ligne)
    if len(differences) > 60:
        print("   ... et %d lignes de plus" % (len(differences) - 60))
    print("\n   Rappel : toute modification de l'interface se fait dans "
          "%s," % PAGE_FR)
    print("   puis se recopie dans %s. Seul le <head> doit différer."
          % PAGE_EN)
    return False


def verifie_identifiants_traduits():
    """Tout id visé par traduction.js doit exister dans la page."""
    page = lire(PAGE_FR)
    presents = set(re.findall(r'id\s*=\s*"([^"]+)"', page))
    vises = set(re.findall(r"""getElementById\(\s*['"]([^'"]+)['"]\s*\)""",
                           lire(TRADUCTION)))
    manquants = sorted(vises - presents)
    if not manquants:
        print("OK   les %d identifiants visés par traduction.js existent"
              % len(vises))
        return True
    print("ECHEC   %s s'adresse à %d identifiant(s) absent(s) de %s :"
          % (TRADUCTION, len(manquants), PAGE_FR))
    for identifiant in manquants:
        print("   " + identifiant)
    return False


def main():
    os.chdir(RACINE)
    for chemin in (PAGE_EN, PAGE_FR, TRADUCTION):
        if not os.path.isfile(chemin):
            raise SystemExit("fichier introuvable : %s" % chemin)
    resultats = [verifie_corps_identiques(), verifie_identifiants_traduits()]
    if all(resultats):
        print("\nLes deux pages sont cohérentes.")
        return 0
    print("\nIncohérence détectée.")
    return 1


if __name__ == "__main__":
    sys.exit(main())
