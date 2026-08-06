/* =========================================================================
   Génère les 8 QR codes du parcours → <BASE>/plaque/<n>
   Usage :
     node scripts/generate-qr.mjs                 # base = NEXT_PUBLIC_SITE_URL ou localhost
     node scripts/generate-qr.mjs https://mon-site.vercel.app
   Les fichiers sont écrits dans public/qr/.
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

const COLORS = { dark: "#1B1D5E", light: "#F3F1EAFF" };

async function main() {
  await mkdir(OUT, { recursive: true });
  const index = [];
  for (let n = 1; n <= 8; n++) {
    const url = `${BASE}/plaque/${n}`;
    const file = join(OUT, `plaque-${n}.png`);
    await QRCode.toFile(file, url, {
      color: COLORS,
      width: 1024,
      margin: 2,
      errorCorrectionLevel: "M",
    });
    // version SVG (impression nette)
    const svg = await QRCode.toString(url, { type: "svg", color: COLORS, margin: 2 });
    await writeFile(join(OUT, `plaque-${n}.svg`), svg, "utf8");
    index.push({ n, url, png: `qr/plaque-${n}.png`, svg: `qr/plaque-${n}.svg` });
    console.log(`✓ Plaque ${n} → ${url}`);
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
