import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import styles from "./galerie.module.css";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "La plaque d'égout, un langage universel : un inventaire des formes, à travers le monde et au fil du temps.",
};

const WORLD = [
  "Barcelone · Espagne",
  "Berlin · Allemagne",
  "Budapest · Hongrie",
  "Cannes · France",
  "Shizuoka · Japon",
  "Hiroshima · Japon",
  "Israël",
  "Japon",
  "Corée",
  "Lisbonne · Portugal",
  "Moscou · Russie",
  "Nara · Japon",
  "Nice · France",
  "Lausanne · Suisse",
  "Pologne",
  "Séoul · Corée",
  "Stockholm · Suède",
];

const TIME = [
  "Plaque · 1930",
  "Plaque romaine · Vindobona",
  "New York · XXᵉ siècle",
  "Manchester · 1900",
  "France · XXIᵉ siècle",
  "Indiana · XXᵉ siècle",
];

function Tile({ src, label }: { src: string; label: string }) {
  return (
    <div className={styles.tile}>
      {/* vignette légère servie directement (chargement fiable mobile + web) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} loading="lazy" />
      <span className={styles.lab}>{label}</span>
    </div>
  );
}

export default function GaleriePage() {
  return (
    <>
      <Nav />

      <div className={styles.page}>
      <header className={styles.hero}>
        <div className="eyebrow eau anim-rise">Libre-service · inventaire des formes</div>
        <h1 className="display anim-rise anim-d1">La plaque d&apos;égout, un langage universel</h1>
        <p className={`${styles.intro} anim-rise anim-d2`}>
          Objet banal du trottoir, la plaque d&apos;égout est partout, et partout différente.
          Motifs, matériaux, inscriptions : chaque ville, chaque époque y inscrit sa signature.
          Survolez pour révéler leurs couleurs.
        </p>
      </header>

      <section className={styles.sec}>
        <div className={styles.sechead}>
          <h2 className="display">À travers le monde</h2>
          <span className={styles.note}>survolez pour révéler la couleur</span>
        </div>
        <div className={styles.grid}>
          {WORLD.map((label, i) => (
            <Tile key={i} src={`/img/galerie/${String(i).padStart(2, "0")}.jpg`} label={label} />
          ))}
        </div>
      </section>

      <section className={styles.sec}>
        <div className={styles.sechead}>
          <h2 className="display">Au fil du temps</h2>
          <span className={styles.note}>de la Rome antique à aujourd&apos;hui</span>
        </div>
        <div className={styles.grid}>
          {TIME.map((label, i) => (
            <Tile
              key={i}
              src={`/img/galerie/${String(i + WORLD.length).padStart(2, "0")}.jpg`}
              label={label}
            />
          ))}
        </div>
      </section>

      <p className={styles.credits}>
        Sources : archives BnF / Gallica &amp; collections diverses · usage pédagogique, projet de
        diplôme. Les localisations indiquées sont données à titre indicatif.
      </p>
      </div>

      <Footer paper />
    </>
  );
}
