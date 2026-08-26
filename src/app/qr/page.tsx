import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Nav from "@/components/Nav";
import PrintButton from "./PrintButton";
import styles from "./qr.module.css";

export const metadata: Metadata = {
  title: "QR codes",
  description: "Les 8 QR codes du parcours, à imprimer et poser sur les plaques.",
  robots: { index: false, follow: false },
};

type QrEntry = { n: number; roman: string; slug: string; titre: string; url: string; png: string };

function loadIndex(): { base: string; plaques: QrEntry[] } {
  try {
    const raw = readFileSync(join(process.cwd(), "public", "qr", "index.json"), "utf8");
    return JSON.parse(raw);
  } catch {
    return { base: "", plaques: [] };
  }
}

export default function QrPage() {
  const { base, plaques } = loadIndex();

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <div className={styles.head}>
          <div className="eyebrow eau">Parcours · terrain</div>
          <h1 className="display">Les QR codes</h1>
          <p>
            Un QR par plaque. Il ouvre la fiche correspondante et enregistre le déblocage
            (<code>/plaques/[slug]?scan=1</code>). Modules bleu #2D308C sur fond papier. Pour la
            première mise en place, seuls les <strong>4 premiers</strong> sont nécessaires.
            {base && (
              <>
                {" "}
                Base : <code>{base}</code>.
              </>
            )}
          </p>
          <PrintButton />
        </div>

        <div className={styles.grid}>
          {plaques.map((p) => (
            <div key={p.n} className={styles.card}>
              {/* image statique du dossier public : <img> volontaire (hors next/image) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/${p.png}`} alt={`QR code plaque ${p.roman}`} />
              <div className={styles.rn}>Plaque {p.roman}</div>
              <div className={styles.nm}>{p.titre}</div>
              <div className={styles.url}>{p.url}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
