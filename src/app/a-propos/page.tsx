import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PlaquePlate from "@/components/plaque/PlaquePlate";
import { plaques } from "@/data/plaques";
import styles from "./apropos.module.css";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Le dispositif : une plaque de fonte gravée qui, sous la pluie, révèle le tracé du ru et un QR code : scanner, découvrir, collectionner, jusqu'à la récompense.",
};

const plaque = plaques.find((p) => p.slug === "aux-sources-du-ru") ?? plaques[0];

const STEPS = [
  {
    n: "01",
    t: "On scanne le QR révélé",
    p: "Intrigué par la plaque qui s'anime sous la pluie, le passant sort son téléphone et scanne le code qui vient d'apparaître.",
  },
  {
    n: "02",
    t: "La page de la plaque s'ouvre",
    p: "Le scan mène directement à l'histoire de cette plaque précise : son lieu, son avant / après, le tracé du ru à cet endroit.",
  },
  {
    n: "03",
    t: "La collection se remplit",
    p: "Chaque plaque scannée rejoint la collection. Huit plaques jalonnent Paris, de Belleville à la Seine, huit fragments du même ruisseau.",
  },
];

export default function AProposPage() {
  return (
    <>
      <Nav />

      {/* Hero (bleu) */}
      <header className={styles.hero}>
        <div className="eyebrow eau anim-rise">À propos du dispositif</div>
        <h1 className="display anim-rise anim-d1">Quand il pleut, le ru réapparaît</h1>
        <p className={`${styles.sub} anim-rise anim-d2`}>
          Une plaque de fonte, posée sur le trottoir parisien, qui ne livre son secret que sous la
          pluie.
        </p>
      </header>

      {/* 1 — L'intrigue (papier) */}
      <section className={`paper ${styles.sec}`}>
        <Reveal className={`${styles.wrap} ${styles.prose}`}>
          <div className="eyebrow">L&apos;intrigue</div>
          <h2 className="display">Une plaque qui attend la pluie</h2>
          <p>
            Chaque jour, des milliers de passants marchent sur les plaques d&apos;égout de Paris
            sans jamais les regarder. Le Ru de Ménilmontant s&apos;installe précisément là, dans ce
            passage répété et distrait.
          </p>
          <p>
            Par temps sec, la plaque reste discrète, presque muette. Elle intrigue sans se livrer :
            un objet familier du sol parisien, mais dont quelque chose semble attendre.
          </p>
        </Reveal>
      </section>

      {/* 2 — Le déclencheur (bleu) — plaque interactive */}
      <section className={styles.sec}>
        <div className={`${styles.wrap} ${styles.grid}`}>
          <Reveal>
            <div className="eyebrow eau">Le déclencheur</div>
            <h2 className="display">La pluie révèle</h2>
            <p>
              C&apos;est la pluie qui active tout. En se logeant dans la gravure, l&apos;eau fait
              apparaître la <strong>peinture hydrochromique</strong> : le <strong>tracé du
              ruisseau</strong> enfoui se dessine sous les pas, et avec lui, un <strong>QR
              code</strong> jusque-là invisible.
            </p>
            <p>
              Sans pluie, pas de QR, donc pas d&apos;accès. C&apos;est la météo qui décide : elle
              change un objet banal du trottoir en point d&apos;entrée, et rend la rencontre rare.
            </p>
          </Reveal>
          <Reveal className={styles.plateWrap}>
            <PlaquePlate plaque={plaque} />
            <div className={styles.legend}>
              Sous la pluie, le tracé du ru et le QR code se révèlent.
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 — Le parcours (papier) — 3 étapes */}
      <section className={`paper ${styles.sec}`}>
        <div className={styles.wrap}>
          <Reveal className={styles.stepsHead}>
            <div className="eyebrow center">Le parcours</div>
            <h2 className="display">Scanner, découvrir, collectionner</h2>
          </Reveal>
          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <Reveal key={s.n} className={styles.step} delay={i * 110}>
                <span className={styles.num}>{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — La récompense (bleu) */}
      <section className={styles.sec}>
        <Reveal className={`${styles.wrap} ${styles.reward}`}>
          <div className="eyebrow center eau">La récompense</div>
          <h2 className="display">Au bout du parcours</h2>
          <p>
            Une fois les huit plaques réunies, la récompense se débloque. Un prolongement logique
            du voyage, du souterrain rêvé au souterrain réel :
          </p>
          <div className={styles.card}>
            <div className={styles.big}>−50 %</div>
            <div className={styles.lbl}>
              sur l&apos;entrée du <strong>Musée des Égouts de Paris</strong>
            </div>
            <div className={styles.fine}>remis sous forme de code / QR de réduction.</div>
          </div>
        </Reveal>
      </section>

      {/* Note de conception (bleu, discrète) */}
      <div className={styles.note}>
        <div className={styles.inner}>
          L&apos;hydrochromie est l&apos;intention d&apos;origine du dispositif. Pour le diplôme,
          l&apos;objet est réalisé en <strong>gravure béton</strong> : le tracé et la cartographie
          incisés dans la matière, où l&apos;eau de pluie vient se loger pour révéler le dessin. Un
          prototype béton accompagne la soutenance.
        </div>
      </div>

      <Footer />
    </>
  );
}
