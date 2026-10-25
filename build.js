/*
  Atlas des manifs : assemble le contenu.
  Netlify lance ce script à chaque mise en ligne. Il lit tous les fichiers
  du dossier contenu/ et fabrique data.js, que le site charge.
  Ne modifiez pas data.js à la main : il est réécrit à chaque fois.
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

fs.writeFileSync(
  path.join(__dirname, "data.js"),
  "/* Fichier fabriqué automatiquement par build.js à partir du dossier contenu/. Ne pas modifier à la main. */\n" +
  "window.ATLAS = " + JSON.stringify(ATLAS, null, 1) + ";\n"
);
console.log(`Atlas assemblé : ${ATLAS.pancartes.length} pancartes, ${ATLAS.manifs.length} manifs, ${ATLAS.tactiques.length} tactiques, ${ATLAS.chants.length} chants.`);
