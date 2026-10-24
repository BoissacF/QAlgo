# QAlgo

[English](README.md) · **Français**

**Un simulateur de circuits quantiques dans le navigateur, pour la classe.**

QAlgo permet de construire un circuit quantique à la souris, de voir en direct
l'état de chaque qubit, les amplitudes et les probabilités de sortie, puis de
faire des mesures. Rien à installer : une page web suffit. L'outil est pensé
pour l'enseignement — découverte de l'informatique quantique en lycée, en BTS
ou en début de supérieur — et volontairement plus simple d'abord que les
simulateurs destinés à la recherche.

👉 **Utiliser QAlgo : <https://www.qalgo.org>**

| Version | Adresse |
|---|---|
| Français | <https://www.qalgo.org/indexFR.html> |
| English | <https://www.qalgo.org/index.html> |

Une série de vidéos de démonstration (en français) est disponible sur
[cette liste de lecture YouTube](https://www.youtube.com/playlist?list=PLRB_NPOpDF7c1ls7fDW1XJaqxqoHdImrc).

L'usage est libre et gratuit. Aucun compte n'est nécessaire.

---

## Sommaire

- [Ce que permet QAlgo](#ce-que-permet-qalgo)
- [Les portes disponibles](#les-portes-disponibles)
- [Commandes](#commandes)
- [Les exemples fournis](#les-exemples-fournis)
- [Architecture technique](#architecture-technique)
- [Organisation du dépôt](#organisation-du-dépôt)
- [Modifier le code](#modifier-le-code)
- [Installer sa propre instance](#installer-sa-propre-instance)
- [Limites connues](#limites-connues)
- [Auteur, contact et licence](#auteur-contact-et-licence)

---

## Ce que permet QAlgo

- **Dessiner un circuit à la souris.** On dépose des qubits d'entrée et des
  portes sur le canvas, on les relie, on les déplace, on les redimensionne. Le
  circuit est recalculé à chaque modification.
- **Voir l'état en direct.** Coefficients de chaque qubit, amplitudes complexes
  et probabilités du registre complet, affichés au fil du circuit. Les états de
  superposition peuvent être animés.
- **Choisir sa notation.** Coefficients en forme algébrique, trigonométrique ou
  en angles de Bloch ; angles en degrés, en radians ou en multiples de π ;
  états de base en binaire ou en décimal ; précision réglable.
- **Mesurer.** Mesure de tout le registre, ou **mesure partielle** d'une seule
  ligne quantique, avec effondrement de l'état et renormalisation du reste —
  c'est ce qui rend lisibles la téléportation et le codage superdense. Les
  tirages peuvent être relancés autant de fois qu'on veut.
- **Écrire son propre oracle.** La fonction `f(x)` d'un oracle s'écrit
  directement en JavaScript dans une fenêtre de l'interface ; elle est tabulée
  sur toutes les entrées possibles.
- **Créer ses propres portes.** Un éditeur de matrice permet de définir une
  porte quelconque (jusqu'à 8 lignes quantiques) ; elle est normalisée
  automatiquement et vient s'ajouter à la palette avec le symbole choisi.
- **Transformer un circuit entier en une seule porte.** QAlgo injecte
  successivement chaque état de base pour reconstruire, colonne par colonne, la
  matrice du circuit affiché, et en fait une porte réutilisable.
- **Visualiser sur la sphère de Bloch.** Deux vues 3D orientables, en entrée et
  après mesure, pour un circuit à une seule ligne quantique.
- **Tracer les amplitudes.** Un graphique donne, pour chaque état de base, la
  phase, la probabilité, la partie réelle ou la partie imaginaire de
  l'amplitude.
- **Enregistrer et partager.** Un circuit s'enregistre dans un fichier texte,
  accompagné de son explication pédagogique, et se recharge à l'identique. Les
  amplitudes s'exportent en CSV pour un tableur.
- **Revenir en arrière.** `Ctrl+Z` annule, `Ctrl+Y` refait, sur une soixantaine
  d'étapes ; les deux boutons ↶ et ↷ de la palette font la même chose, et
  s'éteignent quand il n'y a rien à annuler. Le circuit en cours est aussi
  enregistré dans le navigateur : s'il en reste un de la dernière visite,
  QAlgo propose de le reprendre.
- **Travailler en grand.** Un bouton « Plein écran » masque la barre du
  navigateur ; le canvas s'agrandit d'autant.
- **Travailler en français ou en anglais**, toute l'interface basculant d'un
  clic.

## Les portes disponibles

| Famille | Éléments |
|---|---|
| Qubits d'entrée | ∣0⟩, ∣1⟩, (∣0⟩+∣1⟩)/√2, (∣0⟩−∣1⟩)/√2, ou tout qubit défini par ses coefficients |
| Portes à un qubit | X, Y, Z, H, R<sub>Φ</sub> (phase réglable), √X |
| Portes à deux qubits | SWAP, √SWAP |
| Portes à n qubits | Transformée de Fourier quantique et son inverse, oracle O<sub>f</sub>, diffuseur de Grover 2∣ψ⟩⟨ψ∣−I |
| Contrôles | Contrôle et anti-contrôle, applicables à n'importe quelle porte |
| Sorties | Sonde d'état et de probabilité, mesure |
| Décor | Personnages Alice, Bob et Gérard, pour les protocoles de communication |

Toute porte définie par une matrice unitaire peut être ajoutée à cette liste
depuis l'interface, sans toucher au code.

## Commandes

| Action | Commande |
|---|---|
| Déposer ou retirer un qubit ou une porte | Cliquer-glisser |
| Ajouter une ligne quantique sous la dernière | Le « + » en haut à gauche du circuit |
| Sélectionner et déplacer | Clic gauche |
| Modifier la taille | Clic gauche + molette |
| Modifier la couleur | Clic droit |
| Modifier les coefficients d'un qubit | Double-clic |
| Modifier le `f(x)` d'un oracle | Double-clic |
| Modifier le Φ d'une porte R<sub>Φ</sub> | Double-clic |
| Mesure partielle | Double-clic sur une mesure |
| Supprimer | Touche `Suppr` |
| Annuler, refaire | `Ctrl+Z`, `Ctrl+Y`, ou les boutons ↶ et ↷ |

## Les exemples fournis

Accessibles depuis le menu **Exemples**, en français et en anglais. Chacun
embarque son texte d'explication, affiché dans l'interface.

| Exemple | Ce qu'il montre |
|---|---|
| États de Bell ∣Φ+⟩, ∣Φ−⟩, ∣Ψ+⟩, ∣Ψ−⟩ | Intrication de deux qubits |
| Porte de Toffoli | Porte universelle classique, double contrôle |
| Codage superdense | Deux bits classiques transmis par un qubit |
| Algorithme de Deutsch-Jozsa | Fonction constante ou équilibrée, en un seul appel |
| Algorithme de Grover, 3 et 6 qubits | Recherche dans une liste non triée |
| Téléportation quantique | Transfert d'un état par mesures partielles |
| Algorithme de Shor pour 15 et pour 21 | Factorisation, transformée de Fourier |

## Architecture technique

| Couche | Technologies |
|---|---|
| Interface | JavaScript sans framework, Bootstrap 5 |
| Rendu et interactions | p5.js (canvas 2D, et WEBGL pour la sphère de Bloch) |
| Moteur de calcul | JavaScript, vecteur d'état complet (2<sup>n</sup> amplitudes complexes) |
| Serveur | Aucun : tout s'exécute dans le navigateur du visiteur |

**Le circuit est modélisé comme un graphe orienté.** Chaque élément posé sur le
canvas est un sommet (qubit d'entrée, porte, contrôle, sonde, mesure) et chaque
fil est une arête ; les fils de contrôle forment une liste distincte. Un
parcours du graphe reconstruit les lignes quantiques et l'ordre d'application
des portes. C'est ce qui permet de dessiner librement tout en obtenant un
circuit calculable.

**La simulation est exacte**, par vecteur d'état : chaque porte transforme les
2<sup>n</sup> amplitudes complexes du registre. Les contrôles ne sont pas des
portes particulières, mais une condition appliquée aux composantes du vecteur,
si bien que n'importe quelle porte peut être contrôlée.

Le format de fichier des circuits, le catalogue des types de sommets et la
chaîne de calcul sont documentés en commentaire dans les fichiers concernés :
`src/outils.js` pour la sérialisation, `src/sommetaretes.js` pour les types,
`src/calculsQuantiques.js` pour le moteur. Chaque fichier de `src/` s'ouvre sur
une section `//INTERFACE` qui liste ses fonctions avec une ligne d'explication
chacune.

## Organisation du dépôt

| Chemin | Rôle |
|---|---|
| `index.html` | Page de l'application, version anglaise |
| `indexFR.html` | Page de l'application, version française |
| `analytics.js` | Chargement différé de Google Analytics, abandonné au bout de 2 s |
| `src/` | **Le code JavaScript** : les fichiers que l'on modifie, et ceux que le navigateur charge |
| `assets/css/style.css` | Feuille de style de l'application |
| `assets/img/favicon.svg` | Icône de l'onglet : sphère de Bloch stylisée |
| `assets/img/` | Images de l'interface : Alice, Bob, Gérard, drapeaux, curseurs |
| `assets/gates/` | Vignettes des portes affichées dans la palette |
| `assets/fonts/regular.ttf` | Police utilisée par le rendu 3D de la sphère de Bloch |
| `vendor/bootstrap/` | Bootstrap 5 |
| `vendor/p5/` | Copie locale de p5.js, facultative et non versionnée |
| `examples/fr/`, `examples/en/` | Circuits d'exemple chargés par le menu |
| `examples/circuitouverture.txt` | Circuit affiché au démarrage |
| `server/compteurquantique.php` | Compteur de visites, actuellement désactivé |
| `outils/test_algos.js` | Rejoue les 24 circuits d'exemple et compare les amplitudes |
| `outils/test_interface.js` | Vérifie le plein écran et l'historique du circuit |
| `outils/references_algos.json` | Résultats de référence des 24 circuits |
| `outils/verifie_pages.py` | Contrôle que les deux pages n'ont pas divergé |
| `outils/publie.sh` | Envoie au serveur les seuls fichiers qui ont changé |
| `outils/publie.conf.exemple` | Modèle des coordonnées du serveur de publication |

Le détail des sources :

| Fichier | Rôle |
|---|---|
| `src/sketch.js` | Boucle p5.js : canvas, souris, clavier, menu contextuel, zoom |
| `src/graphe.js` | Classe `Graph` : le circuit, ses lignes quantiques, l'enchaînement des calculs |
| `src/sommetaretes.js` | Classes `Sommet` (qubit, porte, mesure) et `Arete` (fil, fil de contrôle) |
| `src/calculsQuantiques.js` | Moteur : vecteur d'état, application des portes, mesures, oracle |
| `src/affichage.js` | Fenêtres de l'interface, éditeur de matrice, portes créées par l'utilisateur |
| `src/outils.js` | Réglages, nombres complexes, enregistrement et chargement, export CSV |
| `src/bloch.js` | Sphère de Bloch 3D et ses curseurs |
| `src/Graphic.js` | Graphique phase / probabilité / partie réelle / partie imaginaire |
| `src/traduction.js` | Bascule français ↔ anglais de toute l'interface |
| `src/plein_ecran.js` | Bouton « Plein écran » de la barre de menu |
| `src/historique.js` | Annulation, sauvegarde automatique du circuit |

## Modifier le code

**Il n'y a ni compilation ni étape de génération** : les fichiers de `src/` sont
à la fois les sources et ce que le navigateur exécute. On modifie, on
rafraîchit.

Les dix scripts sont chargés dans un ordre qui compte — ils partagent des
variables globales et aucun n'est un module — et cet ordre est fixé en tête du
`<body>` des deux pages.

Les pages ajoutent un numéro de version aux scripts (`?v=21.4`) pour forcer le
rechargement chez les visiteurs après une mise en ligne ; il est à incrémenter
à chaque publication.

Pour travailler en local, servir le dossier :

```bash
python -m http.server 8000
# puis ouvrir http://localhost:8000/indexFR.html
```

Un simple double-clic sur `indexFR.html` ne suffit pas : les exemples sont
chargés par requête HTTP, ce que le navigateur refuse depuis un fichier local.

### La règle des deux pages

Il y a deux pages parce qu'un moteur de recherche associe **une langue à une
URL** : chacune a donc son propre `<head>`, avec son titre, sa description et
ses balises Open Graph dans sa langue, les deux se déclarant mutuellement par
`hreflang`.

En revanche **le corps des deux pages doit rester identique**. Il est écrit en
français ; `index.html` ajoute `onload="changeLanguage()"` sur sa balise
`<body>`, et `src/traduction.js` traduit l'interface entière au chargement.

En pratique :

1. toute modification de l'interface se fait dans `indexFR.html` ;
2. elle se recopie dans `index.html`, dont seul le `<head>` lui est propre ;
3. tout texte visible passe par `src/traduction.js`, dans les deux langues.

Un script contrôle cet invariant, et vérifie au passage que chaque identifiant
visé par `traduction.js` existe bien dans la page :

```bash
python outils/verifie_pages.py
```

### Vérifier qu'aucun algorithme n'a bougé

Avant et après toute modification du moteur :

```bash
node outils/test_algos.js
```

Ce test recharge les fichiers de `src/` — **le vrai moteur, sans aucune
réimplémentation** — puis rejoue les 24 circuits d'exemple et compare les
amplitudes obtenues à `outils/references_algos.json`. Il tourne hors
navigateur : des substituts minimaux remplacent p5.js et le DOM, et rien n'est
dessiné. Comptez une vingtaine de secondes, dont dix pour Shor à 21 et ses
262 144 amplitudes ; `--rapide` écarte ce dernier.

La comparaison porte sur une empreinte SHA-256 des amplitudes complexes, pas
seulement sur les probabilités : une erreur de phase, invisible à l'écran, est
donc détectée. Le test affiche aussi les états les plus probables de chaque
circuit, ce qui indique du même coup *quel* algorithme a changé et comment.

Après une modification **voulue** d'un calcul :

```bash
node outils/test_algos.js --enregistre
```

puis relire le diff de `references_algos.json` pour vérifier que seuls les
algorithmes concernés ont bougé.

Les modules d'interface ont leur propre test, qui recharge aussi le vrai
moteur :

```bash
node outils/test_interface.js
```

Node.js n'est nécessaire que pour ces tests ; le site lui-même n'en a pas
besoin.

### Publier sur le serveur

Copier d'abord `outils/publie.conf.exemple` en `outils/publie.conf` et y
mettre l'adresse du serveur, son port SSH, le dossier de destination et
l'adresse publique correspondante. **`publie.conf` n'est pas versionné** : les
coordonnées d'un serveur n'ont pas à figurer dans un dépôt public.

```bash
sh outils/publie.sh --liste    # ce qui a changé, sans rien envoyer
sh outils/publie.sh            # lance les tests, montre, demande, publie
```

Le script demande au serveur l'empreinte MD5 de chacun des 65 fichiers du
site et n'envoie que ceux qui manquent ou qui diffèrent, en une seule
archive. Il **refuse de publier si un test échoue**, vérifie ensuite par
HTTP que le serveur rend bien le nouveau contenu, et signale les fichiers
présents sur le serveur web qui n'ont rien à y faire.

La liste de ce qui compose le site est une **liste blanche**, en tête du
script : ce qui n'y figure pas reste sur le poste de développement.

## Installer sa propre instance

QAlgo est un site statique : il n'y a ni base de données, ni code à compiler.

1. Copier le contenu du dépôt à la racine du site, ou dans un sous-dossier.
2. C'est tout. Aucune configuration, aucun secret, aucune dépendance à
   installer ; p5.js et Bootstrap sont chargés depuis un CDN.

PHP n'est utile que pour `server/compteurquantique.php`, un compteur de visites
qui écrit dans un fichier `compteurquantique.txt` placé à côté de lui. Le code
qui l'appelait est aujourd'hui désactivé dans `src/sketch.js`.

## Limites connues

- **18 qubits au maximum.** Au-delà, le vecteur d'état (2<sup>18</sup>
  amplitudes) ne se calcule plus assez vite pour rester interactif.
- **La sphère de Bloch ne s'affiche que pour un circuit à une seule ligne
  quantique** : l'état d'un qubit intriqué n'est pas un point de la sphère.
- **L'oracle exécute le code JavaScript saisi dans l'interface.** C'est voulu :
  c'est ce qui permet d'écrire librement `f(x)`. Mais comme un fichier de
  circuit enregistre cette fonction, **il ne faut pas ouvrir un fichier de
  circuit reçu d'une source inconnue.**
- Les pages sont écrites en français et traduites en anglais au chargement par
  `src/traduction.js` : le texte anglais n'est donc pas présent dans le HTML
  livré, ce qui limite le référencement de la version anglaise.
- p5.js est chargé dans sa version 0.10.2, celle avec laquelle le rendu a été
  réglé.

## Auteur, contact et licence

QAlgo est développé par **Frédéric Boissac**, professeur de physique et
d'informatique.

- Contact : <prof.boissac@gmail.com>
- Un bogue, une idée, une suggestion : ouvrir un ticket sur ce dépôt ou écrire
  à l'adresse ci-dessus.
- Du même auteur : [Dariush](https://physalgo.fr/Dariush/), un environnement de
  programmation Python, SQL et Linux dans le navigateur.

### Licence

Copyright © 2025-2026 Frédéric Boissac

QAlgo est un logiciel libre, distribué sous la licence
[GNU Affero General Public License, version 3](LICENSE) (AGPL-3.0). Vous pouvez
l'utiliser, l'étudier, le modifier et le redistribuer. En contrepartie, toute
version modifiée, y compris proposée comme service en ligne, doit rester sous
cette même licence, avec son code source accessible à ses utilisateurs et la
mention de l'auteur conservée.

Les bibliothèques tierces embarquées restent sous leurs licences respectives.

QAlgo s'appuie sur des logiciels libres, que leurs auteurs soient remerciés :
[p5.js](https://p5js.org) et [Bootstrap](https://getbootstrap.com).
