/*
  Atlas des manifs : traitement des contributions envoyées par le formulaire.

  - Pancartes, chants et tactiques sont PUBLIÉS DIRECTEMENT (le site se met à jour
    en une à deux minutes). Vous pouvez les retirer ensuite en supprimant leur fichier.
  - Les nouvelles MANIFS passent par une « pull request » sur GitHub : elles
    n'apparaissent qu'après votre validation (Merge).
  - Une contribution suspecte est mise en attente comme une manif (pull request) :
    mot interdit, lien dans le texte, pancarte sans photo, ou trop d'envois en une heure.
  - Le fichier moderation.json, à la racine du dépôt, règle tout cela :
      "publicationDirecte": false  => TOUT passe en validation (en cas de vague de trolls)
      "maxParHeure": nombre d'envois publiés directement par heure avant mise en attente
      "motsInterdits": liste de mots qui déclenchent la mise en attente

  Réglages dans Netlify (Project configuration > Environment variables) :
  GITHUB_TOKEN  : jeton GitHub, droits « Contents » et « Pull requests » en écriture
  GITHUB_REPO   : par exemple  mon-compte/atlasdesmanifs
  GITHUB_BRANCH : facultatif, « main » par défaut
*/
const MOIS = ["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"];
const MOIS_AFF = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const API = "https://api.github.com";
const AUTO = "Publication automatique";

function gh(path, opts = {}) {
  return fetch(API + path, {
    ...opts,
    headers: {
      Authorization: "Bearer " + TOKEN, Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "atlasdesmanifs",
      ...(opts.body ? { "Content-Type": "application/json" } : {})
    }
  });
}
async function ghJson(path, opts) {
  const r = await gh(path, opts);
  const t = await r.text();
  if (!r.ok) { const e = new Error(`GitHub ${r.status} sur ${path} : ${t.slice(0, 300)}`); e.status = r.status; throw e; }
  return t ? JSON.parse(t) : {};
}
async function readJsonFile(path, ref) {
  const r = await gh(`/repos/${REPO}/contents/${encodeURI(path)}?ref=${encodeURIComponent(ref)}`);
  if (!r.ok) return null;
  const f = await r.json();
  try { return JSON.parse(Buffer.from(f.content, "base64").toString("utf8")); } catch (e) { return null; }
}

// Un seul commit pour plusieurs fichiers (fiche + photo), sur la branche voulue.
async function commitFiles(files, message, branch, createBranchFrom) {
  for (let essai = 0; essai < 4; essai++) {
    const refName = createBranchFrom ? createBranchFrom : branch;
    const head = await ghJson(`/repos/${REPO}/git/ref/heads/${refName}`);
    const parent = head.object.sha;
    const base = await ghJson(`/repos/${REPO}/git/commits/${parent}`);
    const tree = [];
    for (const f of files) {
      const blob = await ghJson(`/repos/${REPO}/git/blobs`, { method: "POST", body: JSON.stringify({ content: f.base64, encoding: "base64" }) });
      tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
    }
    const t = await ghJson(`/repos/${REPO}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: base.tree.sha, tree }) });
    const c = await ghJson(`/repos/${REPO}/git/commits`, { method: "POST", body: JSON.stringify({ message, tree: t.sha, parents: [parent] }) });
    try {
      if (createBranchFrom) await ghJson(`/repos/${REPO}/git/refs`, { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: c.sha }) });
      else await ghJson(`/repos/${REPO}/git/refs/heads/${branch}`, { method: "PATCH", body: JSON.stringify({ sha: c.sha }) });
      return c.sha;
    } catch (e) {
      if (e.status !== 422 || createBranchFrom) throw e; // 422 : quelqu'un a publié en même temps, on recommence
    }
  }
  throw new Error("Impossible de publier après plusieurs essais");
}
async function openPR(files, message, title, body, slugHint) {
  const branch = `proposition/${slugHint}`;
  await commitFiles(files, message, branch, BRANCH);
  await ghJson(`/repos/${REPO}/pulls`, { method: "POST", body: JSON.stringify({ title, head: branch, base: BRANCH, body }) });
}

const b64 = (s) => Buffer.from(s, "utf8").toString("base64");
const json = (o) => b64(JSON.stringify(o, null, 2) + "\n");
const clean = (v, max = 2000) => String(v == null ? "" : v).trim().slice(0, max);
const slug = (s) => clean(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
const norm = (s) => clean(s, 20000).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const ville = (v) => clean(v, 120).replace(/\s*\(.*\)\s*$/, "");
const url = (u) => (/^https?:\/\//i.test(clean(u)) ? clean(u, 500) : "");
function liste(v, autre) {
  let l = clean(v).split("|").map((x) => x.trim()).filter(Boolean);
  const a = clean(autre, 80);
  if (l.includes("Autre")) l = l.filter((x) => x !== "Autre").concat(a ? [a] : ["Autre"]);
  return l;
}
function dateParts(d) { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(clean(d)); return m ? { y: m[1], m: +m[2], d: +m[3] } : null; }
function manifIds(date, type, suffixe) {
  const p = dateParts(date);
  return {
    slug: `${p.d}-${MOIS[p.m - 1]}-${p.y}` + (suffixe ? "-" + slug(type) : ""),
    hashtag: `#${p.d}${MOIS[p.m - 1]}${p.y}` + (suffixe ? slug(type).replace(/-/g, "") : "")
  };
}
const dateAff = (date) => { const p = dateParts(date); return p ? `${p.d} ${MOIS_AFF[p.m - 1]} ${p.y}` : date; };
async function manifPour(date, type) {
  let ids = manifIds(date, type, false);
  const m = await readJsonFile(`contenu/manifs/${ids.slug}.json`, BRANCH);
  if (!m) return { ids, nouvelle: true };
  if (m.type === type) return { ids, nouvelle: false };
  ids = manifIds(date, type, true);
  return { ids, nouvelle: !(await readJsonFile(`contenu/manifs/${ids.slug}.json`, BRANCH)) };
}

// Règles anti-troll : renvoie la raison de la mise en attente, ou "" si publication directe.
async function raisonAttente(textes, regles, extra) {
  if (regles.publicationDirecte === false) return "la publication directe est désactivée dans moderation.json";
  const tout = norm(textes.join(" "));
  const mot = (regles.motsInterdits || []).map(norm).filter(Boolean).find((w) => tout.includes(w));
  if (mot) return `mot interdit détecté (« ${mot} »)`;
  if (extra) return extra;
  const max = Number(regles.maxParHeure || 20);
  try {
    const since = new Date(Date.now() - 3600e3).toISOString();
    const commits = await ghJson(`/repos/${REPO}/commits?sha=${BRANCH}&since=${since}&per_page=100`);
    const n = commits.filter((c) => (c.commit && c.commit.message || "").startsWith(AUTO)).length;
    if (n >= max) return `plus de ${max} publications automatiques dans la dernière heure`;
  } catch (e) {}
  return "";
}

exports.handler = async (event) => {
  if (!TOKEN || !REPO) { console.log("GITHUB_TOKEN ou GITHUB_REPO manquant : la contribution reste dans Netlify Forms."); return { statusCode: 200 }; }
  console.log(`Dépôt ciblé : ${REPO} (branche ${BRANCH})`);
  let payload;
  try { payload = JSON.parse(event.body).payload; } catch (e) { return { statusCode: 400 }; }
  const form = payload.form_name || (payload.data && payload.data["form-name"]);
  console.log(`Contribution reçue : formulaire « ${form} »`);
  const d = payload.data || {};
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 12);
  const rnd = Math.random().toString(36).slice(2, 6);
  const regles = (await readJsonFile("moderation.json", BRANCH)) || {};
  const pied = `\n\n---\n✅ **Merge pull request** pour publier · ❌ **Close pull request** pour refuser.\nLe contact de la personne, s’il a été donné, est dans Netlify > Forms.`;

  try {
    if (form === "manif") {
      const type = clean(d.type) === "Autre" && clean(d.type_precision) ? clean(d.type_precision, 80) : clean(d.type, 80) || "Autre";
      if (!dateParts(d.date)) throw new Error("Date de manif invalide");
      const { ids, nouvelle } = await manifPour(d.date, type);
      const m = {
        slug: ids.slug, hashtag: ids.hashtag, date: clean(d.date), type, mouvement: clean(d.mouvement, 60),
        villes: clean(d.villes, 500).split(",").map(ville).filter(Boolean), chiffres: "", contexte: clean(d.contexte, 3000),
        sources: clean(d.sources, 2000).split(/\s+/).map(url).filter(Boolean).map((u) => ({ titre: u.replace(/^https?:\/\/(www\.)?/, "").split("/")[0], url: u }))
      };
      const path = `contenu/manifs/${ids.slug}${nouvelle ? "" : "-doublon-" + rnd}.json`;
      console.log(`Manif envoyée en validation : ${ids.hashtag}`);
      await openPR([{ path, base64: json(m) }], `Proposition de manif ${ids.hashtag}`,
        `Manif : ${dateAff(m.date)} (${type})`,
        `**Nouvelle manif proposée** : ${ids.hashtag}\n\n- Date : ${dateAff(m.date)}\n- Type : ${type}\n- Villes : ${m.villes.join(", ") || "non précisées"}\n\n${m.contexte || "_Pas de contexte._"}` +
        (nouvelle ? "" : `\n\n⚠️ La manif ${ids.hashtag} existe déjà : probablement un doublon. Fermez cette proposition ou complétez la manif existante.`) + pied,
        `manif-${ids.slug}-${rnd}`);
      return { statusCode: 200 };
    }

    let files = [], label = "", textes = [], extra = "", titrePR = "", corpsPR = "", manifPR = null;

    if (form === "pancarte") {
      const id = `p-${stamp}-${rnd}`;
      let manifSlug = clean(d.manif, 80);
      if (manifSlug === "autre") {
        manifSlug = "";
        if (dateParts(d.autre_date)) {
          const type = clean(d.autre_type) === "Autre" && clean(d.autre_type_precision) ? clean(d.autre_type_precision, 80) : clean(d.autre_type, 80) || "Autre";
          const { ids, nouvelle } = await manifPour(d.autre_date, type);
          manifSlug = ids.slug;
          if (nouvelle) manifPR = { ids, type, date: clean(d.autre_date) };
        }
      }
      let fichier = "";
      const ph = d.photo, phUrl = ph && (typeof ph === "string" ? ph : ph.url);
      if (phUrl) {
        try {
          const r = await fetch(phUrl);
          if (r.ok) {
            const buf = Buffer.from(await r.arrayBuffer());
            const ct = (r.headers.get("content-type") || "").toLowerCase();
            fichier = `photos/${id}.${ct.includes("png") ? "png" : ct.includes("webp") ? "webp" : "jpg"}`;
            files.push({ path: fichier, base64: buf.toString("base64") });
          }
        } catch (e) { console.log("Photo non récupérée : " + e.message); }
      }
      const p = {
        id, texte: clean(d.texte, 500), ville: ville(d.ville), manif: manifSlug,
        registre: liste(d.registre, d.registre_autre), sujet: liste(d.sujet, d.sujet_autre),
        forme: liste(d.forme, d.forme_autre), references: liste(d.references, d.references_autre),
        auteur: clean(d.auteur_pancarte, 200), photo: { credit: clean(d.credit_photo, 200), fichier },
        source: url(d.lien) ? { titre: "Publication d’origine", url: url(d.lien) } : {},
        note: clean(d.note, 2000), ajoute: new Date().toISOString().slice(0, 10)
      };
      if (clean(d.departement)) p.departement = clean(d.departement, 5);
      files.push({ path: `contenu/pancartes/${id}.json`, base64: json(p) });
      label = `pancarte « ${p.texte.slice(0, 60)} »`;
      textes = [p.texte, p.note, p.auteur, p.photo.credit, d.registre_autre, d.sujet_autre, d.forme_autre, d.references_autre];
      if (!fichier) extra = "pancarte sans photo";
      else if (/https?:\/\/|www\./i.test(p.texte)) extra = "lien dans le texte de la pancarte";
      else if (clean(d.confirmation) !== "oui") extra = "case de confirmation (floutage, droits) non cochée";
      titrePR = `Pancarte : « ${p.texte.slice(0, 70)} »`;
      corpsPR = `> ${p.texte}\n\n- Ville : ${p.ville || "non précisée"}\n- Manif : ${manifSlug || "non précisée"}\n- Photo prise par : ${p.photo.credit || "non précisé"}`;
    }
    else if (form === "chant") {
      const id = `c-${stamp}-${rnd}`;
      let manifSlug = clean(d.manif, 80); if (manifSlug === "autre") manifSlug = "";
      const c = {
        id, titre: clean(d.titre, 160),
        type: clean(d.type) === "Autre" && clean(d.type_precision) ? clean(d.type_precision, 80) : clean(d.type, 80) || "Autre",
        air: clean(d.air, 160), paroles: clean(d.paroles, 6000), manif: manifSlug, mouvement: "",
        sujet: liste(d.sujet, d.sujet_autre), lien: url(d.lien_ecoute),
        source: url(d.lien_source) ? { titre: "Source", url: url(d.lien_source) } : {},
        credit: clean(d.credit, 300), note: clean(d.note, 2000), ajoute: new Date().toISOString().slice(0, 10)
      };
      files.push({ path: `contenu/chants/${id}.json`, base64: json(c) });
      label = `chant « ${c.titre} »`;
      textes = [c.titre, c.paroles, c.air, c.credit, c.note, d.type_precision, d.sujet_autre];
      titrePR = `Chant : ${c.titre}`;
      corpsPR = `- Type : ${c.type}${c.air ? "\n- Sur l’air de : " + c.air : ""}\n- Écouter : ${c.lien || "pas de lien"}\n\n> ${c.paroles.replace(/\n/g, "\n> ")}`;
    }
    else if (form === "tactique") {
      const id = `t-${stamp}-${rnd}`;
      const fam = clean(d.famille, 40) || "autre";
      const t = {
        id, nom: clean(d.nom, 140), famille: fam, description: clean(d.description, 3000),
        exemples: (clean(d.lieu) || url(d.lien)) ? [{ texte: clean(d.lieu, 300), source: "Lien", url: url(d.lien) }] : [],
        credit: clean(d.credit, 200), ajoute: new Date().toISOString().slice(0, 10)
      };
      if (fam === "autre" && clean(d.famille_precision)) t.famillePrecision = clean(d.famille_precision, 80);
      files.push({ path: `contenu/tactiques/${id}.json`, base64: json(t) });
      label = `tactique « ${t.nom} »`;
      textes = [t.nom, t.description, t.credit, d.lieu, t.famillePrecision];
      titrePR = `Tactique : ${t.nom}`;
      corpsPR = `- Type : ${fam}${t.famillePrecision ? " (" + t.famillePrecision + ")" : ""}\n\n${t.description}`;
    }
    else {
      return { statusCode: 200 }; // signalements et autres formulaires : seulement dans Netlify Forms
    }

    const raison = await raisonAttente(textes, regles, extra);
    if (raison) {
      console.log(`Mise en attente (pull request) : ${label}, raison : ${raison}`);
      await openPR(files, `Contribution mise en attente : ${label}`, `[En attente] ${titrePR}`,
        `**Contribution mise en attente automatiquement** : ${raison}.\n\n${corpsPR}` + pied, `${form}-${stamp}-${rnd}`);
    } else {
      const sha = await commitFiles(files, `${AUTO} : ${label}`, BRANCH);
      console.log(`Publié directement : ${label} (commit ${String(sha).slice(0, 7)})`);
    }

    if (manifPR) {
      const { ids, type, date } = manifPR;
      await openPR([{ path: `contenu/manifs/${ids.slug}.json`, base64: json({ slug: ids.slug, hashtag: ids.hashtag, date, type, mouvement: "", villes: ville(d.ville) ? [ville(d.ville)] : [], chiffres: "", contexte: "", sources: [] }) }],
        `Proposition de manif ${ids.hashtag}`, `Manif : ${dateAff(date)} (${type})`,
        `**Nouvelle manif**, créée par l’envoi d’une pancarte.\n\n- Date : ${dateAff(date)}\n- Type : ${type}\n\nLa pancarte est déjà en ligne ; elle sera reliée à cette manif dès que vous l’aurez validée. Pensez à compléter le contexte dans \`contenu/manifs/${ids.slug}.json\`.` + pied,
        `manif-${ids.slug}-${rnd}`);
    }
    return { statusCode: 200 };
  } catch (e) {
    console.error("Échec du traitement de la contribution : " + e.message);
    return { statusCode: 200 };
  }
};
