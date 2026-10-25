# Atlas des manifs : mode d’emploi

Le site tient en quatre fichiers, sans base de données ni logiciel à installer.

| Fichier | Rôle |
|---|---|
| `index.html` | La page et son design |
| `app.js` | La logique : filtres, pages des manifs, formulaires, floutage |
| `data.js` | **Toutes les données** : mouvements, manifs, pancartes, tactiques |
| `README.md` | Ce mode d’emploi |

Pour voir le site sur votre ordinateur, ouvrez `index.html` dans un navigateur. Tout fonctionne sauf l’envoi des formulaires, qui demande que le site soit en ligne.

---

## 1. Mettre le site en ligne (GitHub + Netlify, gratuit)

1. Créez un dépôt `atlasdesmanifs` sur github.com et déposez-y ces quatre fichiers à la racine (**Add file > Upload files**, puis **Commit changes**).
2. Sur netlify.com, connectez-vous avec GitHub : **Add new project > Import an existing project > GitHub**, choisissez le dépôt, laissez les champs de build vides, puis **Deploy**.
3. **Project configuration > Forms > Enable form detection**, puis **Deploys > Trigger deploy** pour que les trois formulaires (`pancarte`, `manif`, `tactique`) soient détectés.
4. **Project configuration > Notifications** : ajoutez une notification e-mail par personne qui doit recevoir les propositions.

Ensuite, chaque modification enregistrée sur GitHub est republiée automatiquement en une minute environ.

## 2. Brancher le nom de domaine OVH

1. Dans Netlify : **Domain management > Add a domain**, saisissez votre domaine. Netlify affiche les réglages DNS à faire.
2. Chez OVH : **Web Cloud > Noms de domaine >** votre domaine **> Zone DNS**. Modifiez la ligne **A** du domaine nu avec l’adresse IP donnée par Netlify, supprimez l’éventuelle ligne **AAAA**, et remplacez l’entrée `www` par un **CNAME** vers votre adresse `….netlify.app`.
3. Attendez jusqu’à 24 h. Le HTTPS s’active ensuite tout seul dans Netlify.

## 3. Modérer et supprimer

Les propositions arrivent dans **Netlify > Forms** (et par e-mail), avec la photo déjà floutée si la personne en a envoyé une. **Rien n’est publié automatiquement** : seul ce qui est ajouté à `data.js` apparaît sur le site.

Avant de publier une photo, vérifiez que :
- aucun visage n’est reconnaissable (sinon, ne publiez que le texte) ;
- la personne a coché la case de confirmation ;
- le crédit est indiqué.

Pour **retirer un contenu**, effacez son bloc dans `data.js` sur GitHub (et la photo dans `photos/`), puis enregistrez. En urgence : **Netlify > Deploys**, cliquez sur une version précédente, puis **Publish deploy**.

Pour **travailler à plusieurs** : **Settings > Collaborators** sur GitHub, un compte par personne. Pour valider leurs modifications avant publication, demandez-leur de passer par une *pull request* (voir le tuto).

## 4. Ajouter du contenu dans `data.js`

Ouvrez `data.js` avec un éditeur de texte (TextEdit en mode texte brut, Notepad, VS Code…). Copiez un bloc existant, collez-le à la suite, modifiez les valeurs. Attention aux virgules entre les blocs et aux guillemets.

### Une pancarte

```js
{ id: "p16", texte: "Le texte de la pancarte", ville: "Lyon", manif: "17-octobre-2026",
  registre: ["Jeu de mots"], procede: ["Rime"], sujet: ["Vie chère"], forme: ["Carton au marqueur"], references: [],
  pepite: false, auteur: "",
  photo: { credit: "@pseudo", fichier: "photos/p16.jpg" },
  source: { titre: "Instagram", url: "https://..." },
  note: "" },
```

- `id` : un identifiant unique (p16, p17…).
- `manif` : le `slug` d’une manif existante. Laissez `""` si on ne sait pas, et ajoutez `mouvement: "automne-2026"` pour la rattacher quand même au mouvement.
- `photo.fichier` : pour afficher une photo, créez un dossier `photos/` à côté de `index.html`, mettez-y l’image, et indiquez son chemin. Laissez `""` sans photo.
- `date` (facultatif) : `"2026-10-01"` si la date diffère de celle de la manif.
- `echos` (facultatif) : la même pancarte ou une variante vue dans un autre pays.

### Une manif (avec sa page et son hashtag)

```js
{ slug: "marche-climat-2027-03", hashtag: "#marcheclimat2027", nom: "Marche pour le climat",
  date: "2027-03-20", type: "Marche pour le climat", mouvement: "",
  villes: ["Paris"], chiffres: "",
  contexte: "Pourquoi cette manif, qui appelait, ce qui s’est passé.",
  sources: [{ titre: "Nom du média", url: "https://..." }] },
```

- Le `slug` sert d’adresse à la page : `atlasdesmanifs.org/#manifs/marche-climat-2027-03`.
- Le `type` alimente le filtre « Type d’événement ». Vous pouvez en créer de nouveaux.
- `aVenir: true` affiche le badge « À venir ».
- `mouvement` : laissez `""` pour une manif isolée, elle apparaîtra dans « Autres manifs ».

### Un nouveau mouvement

```js
{ id: "climat-2027", hashtag: "#climat2027", nom: "Mobilisations pour le climat, 2027",
  periode: "Printemps 2027", contexte: "…", sources: [] },
```

### Une tactique

```js
{ id: "t11", nom: "Nom de la tactique", famille: "gonflables",
  description: "Comment ça marche.",
  exemples: [{ texte: "Où et quand.", manif: "17-octobre-2026", source: "Média", url: "https://..." }],
  credit: "" },
```

Familles possibles : `costumes`, `gonflables`, `banderoles`, `performance`, `numerique`, `blocage`, `protection`, `documentation`.

## 5. Le jour où l’atlas grandit

Au-delà de quelques centaines de pancartes, ou si plusieurs personnes doivent modérer, on pourra brancher `data.js` sur un tableur partagé (Airtable, Google Sheets) ou un petit back-office. La structure des données est déjà prête pour ça.
