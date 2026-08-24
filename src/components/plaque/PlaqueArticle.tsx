import Image from "next/image";
import Link from "next/link";
import type { Plaque } from "@/data/plaques";
import { plaques, TOTAL_PLAQUES } from "@/data/plaques";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import SituerMap from "@/components/SituerMap";
import CollectionGrid from "@/components/CollectionGrid";
import PlaquePlate from "./PlaquePlate";
import styles from "@/app/plaques/plaque.module.css";

export default function PlaqueArticle({ plaque }: { plaque: Plaque }) {
  const c = plaque.content!;
  const prev = plaques.find((p) => p.n === plaque.n - 1);
  const next = plaques.find((p) => p.n === plaque.n + 1);

  return (
    <>
      {/* nav minimale de fiche */}
      <nav className={styles.navbar}>
        <Link href="/parcours">← Le parcours</Link>
        <span className={styles.mid}>
          Plaque {plaque.roman} / VIII
        </span>
        <span className={styles.status}>● Débloquée</span>
      </nav>

      {/* héros */}
      <header className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src={plaque.hero} alt="" fill priority sizes="100vw" style={{ objectFit: "cover", transform: "scale(1.06)" }} />
        </div>
        <div className={styles.scanline}>
          <span className={styles.pulse} /> Plaque scannée · bienvenue dans le ru
        </div>
        <div className={styles.heroInner}>
          <div className={`${styles.kicker} anim-rise`}>
            <span className={styles.pill}>Plaque {plaque.roman} / VIII</span> {plaque.quartier} ·{" "}
            {plaque.arrondissement}
          </div>
          <h1 className="display anim-rise anim-d1">{plaque.title}</h1>
          <p className={`${styles.accroche} anim-rise anim-d2`}>{plaque.subtitle}</p>
          <p className={`${styles.herocred} anim-rise anim-d3`}>{c.heroCredit}</p>
        </div>
      </header>

      {/* intro + duo */}
      <section className={`paper ${styles.sec}`}>
        <div className={`${styles.wrap} ${styles.intro}`}>
          <Reveal>
            <div className="eyebrow">{c.intro.eyebrow}</div>
            <h2 className="display">{c.intro.title}</h2>
          </Reveal>
          <Reveal>
            <p className={styles.lead}>{c.intro.lead}</p>
            {c.intro.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </div>

        <Reveal className={`${styles.wrap} ${styles.duo}`}>
          {c.duo.map((d, i) => (
            <figure key={i}>
              <Image className={styles.dc} src={d.back} alt="" fill sizes="(max-width:640px) 100vw, 560px" style={{ objectFit: "cover" }} />
              <Image className={styles.dd} src={d.front} alt="" fill sizes="(max-width:640px) 100vw, 560px" style={{ objectFit: "cover" }} />
              <figcaption>{d.caption}</figcaption>
            </figure>
          ))}
        </Reveal>
      </section>

      {/* bande image + texte */}
      <section className={styles.band}>
        <div className={styles.img}>
          <Image src={c.band.image} alt="" fill sizes="(max-width:820px) 100vw, 55vw" style={{ objectFit: "cover" }} />
        </div>
        <Reveal className={styles.txt}>
          <div className="eyebrow eau">{c.band.eyebrow}</div>
          <h3 className="display">{c.band.title}</h3>
          {c.band.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
      </section>

      {/* citation pleine */}
      <section className={styles.quote}>
        <div className={styles.qbg}>
          <Image src={c.quote.image} alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
        </div>
        <blockquote>{c.quote.text}</blockquote>
      </section>

      {/* l'objet : plaque en fonte */}
      <section className={`paper ${styles.sec}`}>
        <div className={`${styles.wrap} ${styles.plaqueobj}`}>
          <PlaquePlate plaque={plaque} />
          <Reveal>
            <div className="eyebrow">L&apos;objet</div>
            <h3 className="display">{c.object.title}</h3>
            {c.object.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* fiche technique */}
      <section className={`paper ${styles.sec}`} style={{ paddingBottom: 36 }}>
        <Reveal className={styles.wrap}>
          <div className="eyebrow">Fiche technique</div>
          <h3 className="display" style={{ fontSize: "clamp(26px,3vw,44px)" }}>
            Plaque {plaque.roman} · caractéristiques
          </h3>
          <p className={styles.specnote}>
            Coordonnées relevées sur le terrain · dimensions et matériau confirmés.
          </p>
          <div className={styles.specs}>
            {plaque.specs.map((s) => (
              <div className={styles.spec} key={s.label}>
                <span>{s.label}</span>
                <b>{s.value}</b>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* situer sur le tracé */}
      <section className={`paper ${styles.sec}`} style={{ paddingTop: 0 }}>
        <Reveal className={`${styles.wrap} ${styles.locate}`}>
          <div className="eyebrow">Situer</div>
          <h3 className="display" style={{ fontSize: "clamp(26px,3vw,44px)" }}>
            Le point {plaque.roman} sur le tracé
          </h3>
          <div className={styles.map}>
            <SituerMap active={plaque.n} />
          </div>
        </Reveal>
      </section>

      {/* rappel collection + nav plaque */}
      <section className={styles.sec}>
        <div className={`${styles.wrap} ${styles.collec}`}>
          <Reveal>
            <div className="eyebrow center eau">Ma collection</div>
            <h2 className="display">Plaque {plaque.roman} débloquée</h2>
            <p className={styles.collecProg}>
              Continuez le parcours : scannez les autres plaques pour compléter le flux
              ({TOTAL_PLAQUES} au total).
            </p>
          </Reveal>
          <Reveal>
            <CollectionGrid linkUnlocked />
          </Reveal>
        </div>
        <div className={styles.navp}>
          {prev ? (
            <Link href={`/plaques/${prev.slug}`}>← Plaque {prev.roman}</Link>
          ) : (
            <span className={styles.disabled}>← Plaque précédente</span>
          )}
          {next ? (
            <Link href={`/plaques/${next.slug}`}>Plaque {next.roman} →</Link>
          ) : (
            <span className={styles.disabled}>Plaque suivante →</span>
          )}
        </div>
      </section>

      <Footer paper note={`Plaque ${plaque.roman} / VIII · Ru de Ménilmontant`} />
    </>
  );
}
