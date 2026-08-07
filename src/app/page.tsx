import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PlaqueSlider from "@/components/PlaqueSlider";
import Map3D from "@/components/Map3D";
import HomeCollection from "@/components/home/HomeCollection";
import Reveal from "@/components/Reveal";
import styles from "./home.module.css";

/** Accueil — fidèle à la maquette accueil-v3 :
 *  héros → carrousel des 8 plaques → carte 3D → collection → footer. */
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

      {/* HÉROS */}
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

      {/* LE PARCOURS — carrousel des 8 plaques */}
      <div id="parcours" style={{ scrollMarginTop: 86 }}>
        <PlaqueSlider />
      </div>

      {/* LA CARTE — spatialisation 3D */}
      <section id="carte" style={{ scrollMarginTop: 86, background: "var(--encre)", padding: "78px 0 90px" }}>
        <Reveal style={{ textAlign: "center", padding: "0 6vw" }}>
          <div className="eyebrow center eau">La carte</div>
          <h2 className="display" style={{ color: "#EDEDFF", fontSize: "clamp(30px,5vw,64px)" }}>
            Le ru dans Paris, en volume
          </h2>
          <p style={{ maxWidth: 680, margin: "12px auto 0", opacity: 0.82 }}>
            Tournez la ville (glisser gauche-droite, haut-bas), survolez une plaque pour la situer —
            des hauteurs de Ménilmontant jusqu&apos;à la Seine.
          </p>
        </Reveal>
        <div style={{ maxWidth: 1500, margin: "34px auto 0", padding: "0 clamp(16px,5vw,70px)" }}>
          <Map3D />
        </div>
      </section>

      {/* MA COLLECTION */}
      <HomeCollection />

      <Footer />
    </>
  );
}
