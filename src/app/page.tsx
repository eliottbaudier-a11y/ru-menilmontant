import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RainReveal from "@/components/home/RainReveal";
import HomeCollection from "@/components/home/HomeCollection";
import styles from "./home.module.css";

/** Accueil — structure allégée validée (31/07) :
 *  héros → interactif « la pluie révèle le ru » → collection → footer. */
export default function Home() {
  const nodes = [
    [120, 196],
    [330, 300],
    [520, 360],
    [700, 300],
    [880, 292],
    [1050, 360],
    [1210, 418],
    [1360, 382],
  ];

  return (
    <>
      <Nav />

      <header className={styles.hero} id="hero">
        <div className={styles.herobg}>
          <Image
            src="/img/accueil/00.jpg"
            alt="Vue cinématique du ru de Ménilmontant"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <svg
          className={styles.river}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path
            className={styles.rivpath}
            d="M -40 210 C 240 150 300 360 520 360 S 760 210 900 300 S 1120 470 1290 400 S 1500 300 1560 340"
          />
          <path
            className={`${styles.rivpath} ${styles.two}`}
            d="M -40 250 C 260 200 320 400 540 400 S 780 250 920 340 S 1140 510 1310 440 S 1520 350 1560 380"
          />
          <g>
            {nodes.map(([cx, cy], i) => (
              <circle
                key={i}
                className={styles.node}
                cx={cx}
                cy={cy}
                r={i === 2 ? 5 : 4}
                style={{ animationDelay: `${2 + i * 0.15}s` }}
              />
            ))}
          </g>
        </svg>

        <div className={styles.kicker}>Un parcours en 8 plaques · Paris</div>
        <h1 className="display">
          Les ruisseaux
          <br />
          oubliés de Paris
        </h1>
        <p className={styles.accroche}>
          Sous vos pas, une rivière a disparu. Suivez ses huit plaques pour la faire ressurgir.
        </p>
        <div className={styles.scrollcue}>
          <span className={styles.bar} /> Descendre
        </div>
      </header>

      <RainReveal />

      <HomeCollection />

      <Footer />
    </>
  );
}
