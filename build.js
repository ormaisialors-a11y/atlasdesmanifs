/*
  Atlas des manifs : assemble le contenu.
  Ce script lit tous les fichiers du dossier contenu/ et fabrique data.json
  (lu en direct par le site) et data.js (version de secours).
  GitHub le lance automatiquement à chaque changement dans contenu/
  (voir .github/workflows/assembler.yml), et Netlify à chaque mise en ligne.
  Ne modifiez pas data.json ni data.js à la main : ils sont réécrits à chaque fois.
*/
const fs = require("fs");
const path = require("path");

const dossiers = ["mouvements", "manifs", "pancartes", "tactiques", "chants"];
const ATLAS = {};
const erreurs = [];

for (const d of dossiers) {
  const dir = path.join(__dirname, "contenu", d);
  ATLAS[d] = [];
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).sort()) {
    if (!f.endsWith(".json")) continue;
    try {
      ATLAS[d].push(JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
    } catch (e) {
      erreurs.push(`contenu/${d}/${f} : ${e.message}`);
    }
  }
}

if (erreurs.length) {
  console.error("\nCes fichiers contiennent une erreur d’écriture et ont été ignorés :\n" + erreurs.join("\n") + "\n");
}

// data.json : lu en direct par le site depuis GitHub
fs.writeFileSync(path.join(__dirname, "data.json"), JSON.stringify(ATLAS) + "\n");
// data.js : version de secours, publiée avec le site
fs.writeFileSync(
  path.join(__dirname, "data.js"),
  "/* Fichier fabriqué automatiquement par build.js à partir du dossier contenu/. Ne pas modifier à la main. */\n" +
  "window.ATLAS = " + JSON.stringify(ATLAS, null, 1) + ";\n"
);
console.log(`Atlas assemblé : ${ATLAS.pancartes.length} pancartes, ${ATLAS.manifs.length} manifs, ${ATLAS.tactiques.length} tactiques, ${ATLAS.chants.length} chants.`);
