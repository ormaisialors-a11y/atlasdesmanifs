# Atlas des manifs : mode d’emploi

## Comment le site est organisé

| Élément | Rôle |
|---|---|
| `contenu/pancartes/` | **Un fichier par pancarte** |
| `contenu/manifs/` | **Un fichier par manif** (sa page, son hashtag, son contexte) |
| `contenu/tactiques/` | **Un fichier par tactique** |
| `contenu/chants/` | **Un fichier par chant** (paroles, lien d’écoute) |
| `contenu/mouvements/` | Un fichier par mouvement (cycle de mobilisation) |
| `photos/` | Les photos des pancartes |
| `index.html` | La page, ses textes et son design |
| `app.js` | La logique : filtres, critères, formulaires |
| `build.js` | Rassemble le dossier `contenu/` à chaque mise en ligne |
| `netlify/functions/` | Publie les contributions du formulaire, ou les met en attente (manifs, contenus suspects) |
| `moderation.json` | Les règles anti-trolls (mots interdits, limite par heure, interrupteur de publication directe) |
| `data.json` et `data.js` | Fabriqués automatiquement à partir de `contenu/`. **Ne pas les modifier à la main.** |
| `.github/workflows/assembler.yml` | Demande à GitHub de rassembler le contenu dans `data.json` à chaque contribution |

**Comment le site s’actualise.** Le site lit ses pancartes, manifs, tactiques, chants et photos **en direct sur GitHub** (le dépôt doit être public). Une contribution apparaît donc sur le site une à deux minutes après son envoi, **sans mise en ligne Netlify** : elle ne consomme aucun crédit. Netlify ne se republie que quand le code ou le design changent (`index.html`, `app.js`, `netlify/`…), quelques fois par mois au plus. C’est réglé dans `netlify.toml` (ligne `ignore`).

Un fichier par élément, c’est ce qui permet à l’atlas de grandir : 10 ou 3 000 pancartes, la méthode reste la même, et plusieurs propositions peuvent arriver en même temps sans se gêner.

---

## 1. Mise en ligne (déjà faite)

Le dépôt GitHub est relié à Netlify : chaque modification enregistrée sur GitHub est republiée en une à deux minutes.

## 2. Contributions en ligne (à régler une fois)

Grâce à cette étape :
- **les pancartes, chants et tactiques** envoyés par le formulaire sont **publiés directement** : le site se met à jour en une à deux minutes ;
- **les nouvelles manifs** arrivent en **pull request** sur GitHub (une demande de publication) : elles n’apparaissent qu’après votre validation ;
- **une contribution suspecte** est mise en attente comme une manif (voir section 3).

**a. Créer un jeton GitHub**

1. Sur GitHub, cliquez sur votre photo en haut à droite, puis **Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token**.
2. Nom : `atlasdesmanifs-netlify`. Durée : la plus longue proposée (notez de le renouveler à l’échéance).
3. **Repository access** : *Only select repositories*, puis choisissez `atlasdesmanifs`.
4. **Permissions** (Repository permissions) : **Contents** en *Read and write*, **Pull requests** en *Read and write*.
5. Cliquez sur **Generate token** et copiez le jeton (il ne s’affiche qu’une fois).

**b. Le donner à Netlify**

Dans Netlify : **Project configuration > Environment variables > Add a variable**, deux fois :

| Clé | Valeur |
|---|---|
| `GITHUB_TOKEN` | le jeton copié |
| `GITHUB_REPO` | `votre-compte/atlasdesmanifs` (tel qu’il apparaît dans l’adresse de votre dépôt) |

Puis **Deploys > Trigger deploy > Deploy project**.

**c. Tester**

Envoyez une fausse manif depuis la page Contribuer : une minute plus tard, une pull request apparaît dans l’onglet **Pull requests** du dépôt. Fermez-la (Close). Envoyez ensuite un faux chant : il doit apparaître sur le site une à deux minutes plus tard. Supprimez son fichier dans `contenu/chants/`.

Sans jeton, le site fonctionne quand même : les propositions arrivent seulement dans **Netlify > Forms**, et vous les ajoutez à la main (section 4).

## 3. Modérer

### Les garde-fous automatiques

Une pancarte, un chant ou une tactique est **mis en attente** (pull request) au lieu d’être publié quand :
- il contient un mot de la liste `motsInterdits` ;
- c’est une pancarte sans photo, avec un lien dans son texte, ou sans la case de confirmation cochée ;
- plus de `maxParHeure` contributions ont déjà été publiées dans l’heure (protection contre les vagues de spam).

Ces règles se trouvent dans **`moderation.json`**, à la racine du dépôt :

```json
{
  "publicationDirecte": true,
  "maxParHeure": 20,
  "motsInterdits": ["casino", "viagra"]
}
```

- **En cas de vague de trolls** : passez `"publicationDirecte"` à `false`. Tout passe alors en validation, jusqu’à ce que vous remettiez `true`.
- Ajoutez à `motsInterdits` les insultes ou les mots que vous voulez filtrer (en minuscules, les accents sont ignorés).

Le formulaire est aussi protégé par le filtre anti-spam de Netlify et par un champ piège invisible pour les robots.

### Valider une manif ou une contribution en attente

GitHub vous prévient par e-mail.
1. Onglet **Pull requests** du dépôt, puis la proposition. La description indique pourquoi elle est en attente.
2. **Files changed** montre la fiche (et la photo). Pour corriger avant de publier : **…** au-dessus du fichier, puis **Edit file**.
3. **Merge pull request** puis **Confirm merge** pour publier, ou **Close pull request** pour refuser.

### Retirer un contenu publié

- **Repérer les ajouts** : l’onglet **Commits** du dépôt liste chaque contribution publiée (« Publication automatique : … »). Netlify vous envoie aussi chaque envoi par e-mail si vous avez activé les notifications de formulaire.
- **Signalements** : chaque fiche du site a un lien « Signaler ». Les signalements arrivent dans **Netlify > Forms > signalement** (et par e-mail avec les notifications).
- **Messages** : le formulaire « Nous écrire » (page Contribuer, et lien en bas de chaque page) arrive dans **Netlify > Forms > contact**. Activez les notifications e-mail pour le recevoir dans votre boîte.
- **Supprimer** : ouvrez le fichier dans `contenu/…`, puis **…** et **Delete file**, et enregistrez. Supprimez aussi sa photo dans `photos/`.
- **En urgence** : **Netlify > Deploys**, cliquez sur une version précédente, puis **Publish deploy**.

**Travailler à plusieurs** : **Settings > Collaborators** sur GitHub, un compte par personne.

**Dépôt privé** conseillé : les contributions en attente ne sont visibles que par vous et vos collaborateur·ices. Le contact laissé par une personne n’est jamais envoyé sur GitHub : il reste dans Netlify > Forms.

## 4. Ajouter ou modifier du contenu à la main

Sur GitHub, ouvrez le dossier voulu dans `contenu/`.

- **Modifier** : ouvrez le fichier, cliquez sur le crayon, corrigez, puis **Commit changes**.
- **Ajouter** : ouvrez un fichier existant, copiez tout son contenu, revenez dans le dossier, puis **Add file > Create new file**. Nommez-le (par exemple `p16.json`), collez, adaptez les valeurs, **Commit changes**.

### Une pancarte (`contenu/pancartes/p16.json`)

```json
{
  "id": "p16",
  "texte": "Le texte de la pancarte",
  "ville": "Die",
  "manif": "17-octobre-2026",
  "registre": ["Jeu de mots"],
  "sujet": ["Pouvoir d’achat"],
  "forme": ["Inscription"],
  "references": [],
  "auteur": "",
  "photo": { "credit": "@pseudo", "fichier": "photos/p16.jpg" },
  "source": { "titre": "Instagram", "url": "https://..." },
  "note": ""
}
```

- `id` : le même que le nom du fichier, sans `.json`.
- `manif` : le nom du fichier d’une manif, sans `.json`. Laissez `""` si on ne sait pas, et ajoutez `"mouvement": "automne-2026"` pour la rattacher quand même à un mouvement.
- Pour la photo : déposez l’image dans `photos/` (**Add file > Upload files**) et indiquez son chemin dans `fichier`.

### Une manif (`contenu/manifs/20-mars-2027.json`)

```json
{
  "slug": "20-mars-2027",
  "hashtag": "#20mars2027",
  "date": "2027-03-20",
  "type": "Manifestation nationale",
  "mouvement": "",
  "villes": ["Paris", "Die"],
  "chiffres": "",
  "contexte": "Pourquoi cette manif, qui appelait, ce qui s’est passé.",
  "sources": [{ "titre": "Nom du média", "url": "https://..." }]
}
```

- `slug` : le même que le nom du fichier. C’est l’adresse de sa page : `…/#manifs/20-mars-2027`.
- Pour une période : ajoutez `"dateFin": "2027-03-27"`. Pour une manif annoncée : `"aVenir": true`.
- Avec le temps, les manifs se rangent toutes seules par année dans les filtres et dans l’onglet Manifs.

### Une tactique (`contenu/tactiques/t11.json`)

```json
{
  "id": "t11",
  "nom": "Nom de la tactique",
  "famille": "micro",
  "description": "Comment ça marche.",
  "exemples": [{ "texte": "Où et quand.", "manif": "17-octobre-2026", "source": "Média", "url": "https://..." }],
  "credit": ""
}
```

Types de tactiques (`famille`) : `detournement`, `canular`, `costumes`, `musique`, `danse`, `performance`, `gonflables`, `affichage`, `reseaux`, `blocage`, `occupation`, `corteges`, `ripostes`, `protection`, `interpellation`, `micro`.

### Règles d’écriture des fichiers

- Tous les noms et les textes sont entre guillemets droits `"…"`. À l’intérieur d’un texte, utilisez `’` et `« »`, jamais `"`.
- Une virgule entre deux lignes, **pas de virgule** après la dernière avant `}`.
- Si un fichier contient une erreur, il est simplement ignoré à la mise en ligne : le reste du site continue de fonctionner. Le message d’erreur apparaît dans **Netlify > Deploys**, dans le journal de la dernière mise en ligne.

### Un chant (`contenu/chants/c03.json`)

```json
{
  "id": "c03",
  "titre": "Titre ou premiers mots",
  "type": "Slogan scandé",
  "air": "",
  "paroles": "Premier vers\nDeuxième vers",
  "manif": "17-octobre-2026",
  "mouvement": "",
  "sujet": ["Jeunesse"],
  "lien": "https://lien-pour-ecouter",
  "source": {},
  "credit": "Auteur·ice ou origine",
  "note": ""
}
```

- `type` : Slogan scandé, Chanson détournée, Chanson originale, Chant traditionnel ou Autre (liste `CHANT_TYPES` dans `app.js`).
- `paroles` : `\n` marque un retour à la ligne.
- `lien` : facultatif, pour écouter (YouTube, Spotify, Deezer…).
- **Droit d’auteur** : les chants scandés collectifs et les chansons du domaine public peuvent être recopiés en entier. Pour une chanson protégée, gardez seulement un court extrait des paroles et mettez le lien d’écoute.

## 5. Modifier les critères, les onglets et les textes

| Je veux changer… | Fichier | Où |
|---|---|---|
| Registres, sujets, références, formes | `app.js` | Bloc `FACETS`, tout en haut |
| Types d’événement | `app.js` | Ligne `TYPES` |
| Types de tactiques | `app.js` | Bloc `FAMILLES` |
| Types de chants | `app.js` | Ligne `CHANT_TYPES` |
| Noms des onglets, accroche, charte, ressources | `index.html` | Chercher la phrase avec Ctrl+F |
| Couleurs | `index.html` | Lignes `--blue`, `--green`, `--yellow` en haut |

Si vous renommez une valeur, remplacez-la aussi dans les fichiers de `contenu/` : sur la page du dépôt, appuyez sur la touche `.` pour ouvrir un éditeur avec recherche-remplacement sur tous les fichiers. Dans les formulaires, ne modifiez jamais les mots après `name="…"`.

L’autocomplétion des communes utilise l’API officielle et gratuite geo.api.gouv.fr : rien à configurer.

## 6. Voir le site sur son ordinateur

Ouvrez `index.html` dans un navigateur. Le site affiche le contenu du dernier `data.js` fabriqué ; l’envoi des formulaires et l’autocomplétion des communes ne marchent qu’en ligne.
