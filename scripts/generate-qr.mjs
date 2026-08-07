/* =========================================================================
   Génère les 8 QR codes du parcours → <BASE>/plaques/<slug>?scan=1
   Couleurs projet : modules bleu #2D308C sur fond papier #F3F1EA.
   Usage :
     node scripts/generate-qr.mjs                 # base = NEXT_PUBLIC_SITE_URL ou localhost
     node scripts/generate-qr.mjs https://mon-site.vercel.app
   Sortie : public/qr/plaque-<n>.{png,svg} + index.json.
   À relancer une fois l'URL Vercel connue.
   ========================================================================= */
import QRCode from "qrcode";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "qr");

const BASE = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

// slugs des 8 plaques, dans l'ordre (miroir de src/data/plaques.ts)
const PLAQUES = [
  { n: 1, roman: "I", slug: "aux-sources-du-ru", titre: "Aux sources du ru" },
  { n: 2, roman: "II", slug: "saint-martin", titre: "Saint-Martin" },
  { n: 3, roman: "III", slug: "le-marais", titre: "Le Marais" },
  { n: 4, roman: "IV", slug: "grands-boulevards", titre: "Les Grands Boulevards" },
  { n: 5, roman: "V", slug: "opera-chaussee-dantin", titre: "Opéra · Chaussée d'Antin" },
  { n: 6, roman: "VI", slug: "boulevard-haussmann", titre: "Boulevard Haussmann" },
  { n: 7, roman: "VII", slug: "saint-lazare", titre: "Saint-Lazare" },
  { n: 8, roman: "VIII", slug: "alma-la-seine", titre: "Alma · la Seine" },
];

// modules bleu projet sur fond papier
const COLORS = { dark: "#2D308CFF", light: "#F3F1EAFF" };

async function main() {
  await mkdir(OUT, { recursive: true });
  const index = [];
  for (const p of PLAQUES) {
    const url = `${BASE}/plaques/${p.slug}?scan=1`;
    await QRCode.toFile(join(OUT, `plaque-${p.n}.png`), url, {
      color: COLORS,
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "M",
    });
    const svg = await QRCode.toString(url, { type: "svg", color: COLORS, margin: 2 });
    await writeFile(join(OUT, `plaque-${p.n}.svg`), svg, "utf8");
    index.push({ ...p, url, png: `qr/plaque-${p.n}.png`, svg: `qr/plaque-${p.n}.svg` });
    console.log(`✓ Plaque ${p.roman} → ${url}`);
  }
  await writeFile(join(OUT, "index.json"), JSON.stringify({ base: BASE, plaques: index }, null, 2));
  console.log(`\n8 QR codes générés dans public/qr/ (base : ${BASE})`);
  if (BASE.includes("localhost")) {
    console.log("⚠ Base localhost : relance avec l'URL Vercel pour les QR définitifs.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
