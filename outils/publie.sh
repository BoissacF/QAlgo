#!/bin/sh
# QAlgo — publication sur le serveur des seuls fichiers qui ont changé
#
# Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
# Code source : https://github.com/BoissacF/QAlgo
#
# Copyright (C) 2025-2026 Frédéric Boissac
# Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
# voir le fichier LICENSE à la racine du dépôt.
#
# ---------------------------------------------------------------------------
# Remplace  scp -r "…/QAlgo/*" serveur:…/QAlgo/  qui renvoyait tout le dépôt
# à chaque fois, documentation et notes personnelles comprises.
#
# Ce script :
#   1. lance les tests, et refuse de publier s'ils échouent ;
#   2. demande au serveur l'empreinte MD5 de chaque fichier du site ;
#   3. n'envoie que ceux qui manquent ou qui diffèrent ;
#   4. vérifie ensuite, par HTTP, que le serveur rend bien les nouveaux ;
#   5. signale les fichiers présents sur le serveur qui n'ont rien à y faire.
#
# Usage, depuis la racine du dépôt :
#
#   sh outils/publie.sh              compare, montre, demande, publie
#   sh outils/publie.sh --liste      compare et montre, sans rien envoyer
#   sh outils/publie.sh -y           sans la demande de confirmation
#   sh outils/publie.sh --sans-test  sauter les tests (déconseillé)
#
# Sans clé SSH, deux mots de passe sont demandés (inventaire, puis envoi).
# Pour n'en avoir aucun, deposer sa cle publique sur le serveur :
#   ssh-copy-id -p "$PORT" "$SERVEUR"   (avec les valeurs de publie.conf)
# ---------------------------------------------------------------------------

set -e

# Coordonnees du serveur. Elles ne sont PAS dans le depot : publier une
# adresse IP, un port SSH et un compte root sur un depot public, c'est offrir
# une cible. Elles vivent dans outils/publie.conf, voisin de ce script, dont
# publie.conf.exemple est le modele.
CONF="$(dirname "$0")/publie.conf"
if [ -f "$CONF" ]; then
  . "$CONF"
fi

if [ -z "$SERVEUR" ] || [ -z "$CIBLE" ] || [ -z "$URL" ]; then
  cat >&2 <<'FIN'
Coordonnees du serveur manquantes.

Copier outils/publie.conf.exemple en outils/publie.conf, puis le completer :

    SERVEUR="root@mon.serveur.fr"
    PORT=22
    CIBLE="/var/www/QAlgo"
    URL="https://mon.serveur.fr/QAlgo"

publie.conf n'est pas versionne : il reste sur le poste de developpement.
FIN
  exit 1
fi
PORT="${PORT:-22}"

# Git Bash réécrit les chemins commençant par / en chemins Windows avant de
# les passer à ssh. On le lui interdit, sinon un chemin distant comme
# /var/www/QAlgo arrive côté serveur sous la forme
# C:/Program Files/Git/var/www/QAlgo.
MSYS_NO_PATHCONV=1
MSYS2_ARG_CONV_EXCL="*"
export MSYS_NO_PATHCONV MSYS2_ARG_CONV_EXCL

# Ce qui compose le site. Liste blanche : tout ce qui n'y figure pas reste
# sur le poste de développement. En particulier docs/ (notes personnelles),
# outils/ (tests), archive/, vendor/p5/ et le README.
MOTIFS="index.html indexFR.html analytics.js
        src/*.js
        assets/css/*.css assets/fonts/* assets/img/* assets/gates/*
        vendor/bootstrap/*
        examples/*.txt examples/fr/*.txt examples/en/*.txt
        server/*.php"

# Ce qui ne doit JAMAIS se trouver sur le serveur web.
INTRUS="docs outils archive vendor/p5 assets/js README.md LICENSE .gitignore .gitattributes"

CONFIRME=1
LISTE_SEULE=0
TESTS=1
for arg in "$@"; do
  case "$arg" in
    -y|--oui) CONFIRME=0 ;;
    --liste|--dry-run) LISTE_SEULE=1 ;;
    --sans-test) TESTS=0 ;;
    *) echo "argument inconnu : $arg" >&2; exit 2 ;;
  esac
done

# --- on se place à la racine du dépôt --------------------------------------
cd "$(dirname "$0")/.."
RACINE=$(pwd)
[ -f index.html ] || { echo "racine du dépôt introuvable" >&2; exit 1; }

TEMP=$(mktemp -d)
trap 'rm -rf "$TEMP"' EXIT INT TERM

# --- 1. les tests ----------------------------------------------------------
if [ "$TESTS" = 1 ] && [ "$LISTE_SEULE" = 0 ]; then
  echo "== tests avant publication =="
  echec=0
  if command -v node >/dev/null 2>&1; then
    node outils/test_algos.js --rapide >/dev/null 2>&1 \
      || { echo "  ECHEC  test_algos.js"; echec=1; }
    node outils/test_interface.js >/dev/null 2>&1 \
      || { echo "  ECHEC  test_interface.js"; echec=1; }
  else
    echo "  (node absent : tests JavaScript sautés)"
  fi
  if command -v python >/dev/null 2>&1; then
    python outils/verifie_pages.py >/dev/null 2>&1 \
      || { echo "  ECHEC  verifie_pages.py"; echec=1; }
  fi
  if [ "$echec" = 1 ]; then
    echo
    echo "Publication annulée : un test échoue. Relancer le test en cause pour"
    echo "voir le détail, ou forcer avec --sans-test."
    exit 1
  fi
  echo "  tous les tests passent"
  echo
fi

# --- 2. inventaire local ---------------------------------------------------
# (les chemins du dépôt ne contiennent ni espace ni caractère exotique)
for motif in $MOTIFS; do
  for f in $motif; do
    [ -f "$f" ] && echo "$f"
  done
done | sort > "$TEMP/fichiers"

NB=$(wc -l < "$TEMP/fichiers" | tr -d ' ')
[ "$NB" -gt 0 ] || { echo "aucun fichier à publier : liste blanche vide ?" >&2; exit 1; }

# Le md5sum de Git Bash lit en binaire et ecrit « empreinte *chemin » ;
# celui de Linux ecrit « empreinte  chemin ». On retire l'asterisque des
# deux cotes, sinon aucun chemin ne correspond. On garde le mode binaire :
# en mode texte, Windows traduirait les fins de ligne et les empreintes des
# images seraient fausses.
while IFS= read -r f; do md5sum "$f"; done < "$TEMP/fichiers" \
  | awk '{sub(/^\*/, "", $2); print $2"\t"$1}' | sort > "$TEMP/local"

# --- 3. inventaire distant, en une seule connexion -------------------------
echo "== inventaire du serveur ($NB fichiers du site) =="
ssh -p "$PORT" "$SERVEUR" "cd '$CIBLE' 2>/dev/null || exit 9
  while IFS= read -r f; do
    [ -f \"\$f\" ] && md5sum \"\$f\"
  done
  echo '--- INTRUS ---'
  for p in $INTRUS; do [ -e \"\$p\" ] && echo \"\$p\"; done
  exit 0" < "$TEMP/fichiers" > "$TEMP/brut" || {
    code=$?
    [ "$code" = 9 ] && echo "le dossier $CIBLE n'existe pas sur le serveur" >&2
    exit 1
  }

sed -n '1,/^--- INTRUS ---$/p' "$TEMP/brut" | sed '$d' \
  | awk 'NF==2 {sub(/^\*/, "", $2); print $2"\t"$1}' | sort > "$TEMP/distant"
sed -n '/^--- INTRUS ---$/,$p' "$TEMP/brut" | sed '1d' > "$TEMP/intrus"

# --- 4. ce qui a changé ----------------------------------------------------
awk -F'\t' 'NR==FNR { d[$1]=$2; next }
            { if (!($1 in d)) print $1"\tNOUVEAU";
              else if (d[$1] != $2) print $1"\tMODIFIE" }' \
    "$TEMP/distant" "$TEMP/local" > "$TEMP/delta"

NBD=$(wc -l < "$TEMP/delta" | tr -d ' ')
cut -f1 "$TEMP/delta" > "$TEMP/a_envoyer"

echo
if [ "$NBD" = 0 ]; then
  echo "Le serveur est à jour : aucun fichier à transférer."
else
  echo "== $NBD fichier(s) à transférer =="
  awk -F'\t' '{printf "  %-10s %s\n", $2, $1}' "$TEMP/delta"
fi

# --- 5. les intrus ---------------------------------------------------------
if [ -s "$TEMP/intrus" ]; then
  echo
  echo "== ATTENTION : fichiers présents sur le serveur web et qui ne"
  echo "   devraient pas y être =="
  sed 's/^/  /' "$TEMP/intrus"
  echo
  echo "  docs/ contient des notes personnelles, et elles sont téléchargeables"
  echo "  par n'importe qui. Pour les retirer :"
  echo
  printf "    ssh -p %s %s \"cd '%s' && rm -rf" "$PORT" "$SERVEUR" "$CIBLE"
  while IFS= read -r p; do printf " '%s'" "$p"; done < "$TEMP/intrus"
  printf "\"\n"
fi

[ "$NBD" = 0 ] && exit 0
[ "$LISTE_SEULE" = 1 ] && { echo; echo "(--liste : rien n'a été envoyé)"; exit 0; }

# --- 6. confirmation -------------------------------------------------------
if [ "$CONFIRME" = 1 ]; then
  echo
  printf "Envoyer ces %s fichier(s) vers %s ? [o/N] " "$NBD" "$SERVEUR"
  read -r reponse
  case "$reponse" in
    o|O|oui|y|Y|yes) ;;
    *) echo "annulé."; exit 0 ;;
  esac
fi

# --- 7. envoi : une archive, une connexion ---------------------------------
echo
echo "== envoi =="
tar -czf - -T "$TEMP/a_envoyer" \
  | ssh -p "$PORT" "$SERVEUR" "cd '$CIBLE' && tar -xzf -"
echo "  $NBD fichier(s) envoyé(s)"

# --- 8. vérification, par HTTP (aucun mot de passe de plus) ----------------
echo
echo "== vérification sur le site en ligne =="
ko=0
while IFS= read -r f; do
  local_md5=$(md5sum "$f" | cut -d' ' -f1)
  distant_md5=$(curl -s -m 30 "$URL/$f" | md5sum | cut -d' ' -f1)
  if [ "$local_md5" = "$distant_md5" ]; then
    echo "  ok       $f"
  else
    echo "  ECHEC    $f  (le serveur ne rend pas le même contenu)"
    ko=1
  fi
done < "$TEMP/a_envoyer"

echo
if [ "$ko" = 1 ]; then
  echo "Un fichier au moins ne correspond pas. Si c'est un .js ou un .css,"
  echo "il peut s'agir du cache d'un intermédiaire : réessayer dans un instant."
  exit 1
fi
echo "Publication terminée et vérifiée."
echo "Penser à incrémenter ?v= dans les deux pages si un .js ou un .css a"
echo "changé sans que son numéro de version bouge."
