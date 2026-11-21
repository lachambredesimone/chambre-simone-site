LA CHAMBRE DE SIMONE — PACK DU SITE + ADMINISTRATION
====================================================

Ce dossier contient un site statique prêt pour Cloudflare Pages et son interface d'administration Decap CMS. Le contenu du site est réellement chargé depuis content/site.json : les modifications faites dans l'administration sont donc répercutées sur la page publique après publication.

IMPORTANT — AVANT DE COMMENCER
------------------------------
- Ne supprime pas les anciens dépôts ou projets avant d'avoir vérifié le nouveau site et son accès /admin.
- Ce pack ne contient aucun mot de passe, jeton GitHub, secret OAuth ou clé privée.
- Le CMS utilise Decap Turbo (backend officiel hébergé). Il n'y a PAS de Worker OAuth à créer ou maintenir.
- Le CMS ne pourra pas se connecter tant que le turbo_site_id n'aura pas été remplacé par l'identifiant de ton site Decap Turbo.
- Les images incluses sont les illustrations de marque et visuels d'ambiance retrouvés dans nos anciens échanges. Elles ne remplacent pas tes vraies photos récentes de la chambre : tu pourras les importer dans l'administration.
- Le bouton de contact s'active quand l'adresse e-mail est renseignée dans l'administration. Il ouvre un e-mail prérempli (mailto), ce n'est pas encore un moteur de réservation ou de paiement.

ÉTAPE 1 — CRÉER UN NOUVEAU DÉPÔT GITHUB
--------------------------------------
1. Télécharge et décompresse ce ZIP sur ton ordinateur.
2. Sur GitHub, crée un nouveau dépôt (par exemple : chambre-simone-site).
3. Tu peux le laisser privé. Choisis une branche principale nommée main.
4. Ajoute TOUS les fichiers et dossiers qui se trouvent dans le dossier chambre-simone-propre : index.html, style.css, script.js, admin/, content/, images/, etc. Attention : il faut que index.html soit à la racine du dépôt, pas dans un sous-dossier supplémentaire.
5. Fais le premier commit sur main.

ÉTAPE 2 — CONNECTER L'ADMINISTRATION (DECAP TURBO)
--------------------------------------------------
Decap Turbo fournit l'authentification hébergée. Le forfait gratuit annoncé par Decap comprend un site et un compte utilisateur.

1. Ouvre https://decapcms.org/turbo/ et crée ton organisation Decap Turbo.
2. Dans Decap Turbo, ouvre « Git connection » et connecte GitHub. Installe l'application GitHub de Decap Turbo sur le compte qui possède le nouveau dépôt ; autorise l'accès à ce dépôt.
3. Dans « Sites », crée un site :
   - Provider : GitHub
   - Repository : ton-nom-github/nom-du-nouveau-depot
   - Branch : main
   - Config path : admin/config.yml
   - Admin interface URL : https://TON-SITE.pages.dev/admin/
4. Une fois le site créé, copie le « Site ID » indiqué dans son onglet Overview.
5. Dans GitHub, ouvre admin/config.yml et remplace :
   REMPLACER_PAR_LE_SITE_ID_DE_DECAP_TURBO
   par le Site ID copié à l'étape précédente.
6. Dans ce même fichier, remplace les deux occurrences de :
   https://VOTRE-SITE.pages.dev
   par l'adresse publique réelle du site Cloudflare Pages.
7. Enregistre le fichier (commit sur main).

ÉTAPE 3 — PUBLIER LE SITE AVEC CLOUDFLARE PAGES
-----------------------------------------------
1. Dans Cloudflare, ouvre Workers & Pages puis crée une application Pages.
2. Choisis « Import an existing Git repository » et sélectionne le nouveau dépôt GitHub.
3. Paramètres de déploiement :
   - Production branch : main
   - Framework preset : None / Aucun
   - Build command : exit 0 (ou laisser vide si Cloudflare le propose ainsi)
   - Build output directory : .
   - Root directory : / (racine du dépôt)
4. Lance le déploiement.
5. Vérifie d'abord l'adresse publique, puis ouvre https://TON-SITE.pages.dev/admin/.
6. Clique « Login with Turbo » et connecte-toi avec le compte utilisé pour créer l'organisation Turbo.

ÉTAPE 4 — UTILISER L'ADMINISTRATION
----------------------------------
Dans /admin, ouvre « Contenu du site » puis « Textes, photos et apparence ».
Tu pourras modifier :
- les textes de chaque rubrique ;
- les photos principales et la galerie ;
- les équipements, horaires, accès et informations pratiques ;
- les tarifs ;
- les couleurs du site ;
- les rubriques complémentaires (ajout, suppression et ordre).

Quand tu enregistres et publies, Decap écrit les changements dans content/site.json et dans images/. Cloudflare Pages redéploie automatiquement le site à partir du commit GitHub.

ADRESSES UTILES
---------------
- Site public : https://TON-SITE.pages.dev/
- Administration : https://TON-SITE.pages.dev/admin/
- Configuration du CMS : admin/config.yml
- Contenu éditorial : content/site.json
- Images : images/

À COMPLÉTER AVANT L'OUVERTURE AU PUBLIC
---------------------------------------
- Vérifier et saisir les tarifs définitifs dans l'administration.
- Saisir l'adresse e-mail et le téléphone de contact.
- Ajouter les vraies photos de la chambre, du petit-déjeuner et des prestations.
- Vérifier les mentions légales et la politique de confidentialité (une page de rappel est fournie, à compléter).
- Si tu souhaites un formulaire de demande de réservation enregistré automatiquement, un service de formulaire devra être raccordé. Le bouton e-mail actuel n'enregistre pas les demandes dans une base de données.

ARCHITECTURE
------------
- Site : HTML / CSS / JavaScript sans framework ni étape de compilation.
- Administration : Decap CMS 3.17.0, backend turbo-github officiel.
- Authentification : hébergée par Decap Turbo ; aucun identifiant OAuth à copier dans Cloudflare.
- Déploiement : Cloudflare Pages depuis GitHub.
