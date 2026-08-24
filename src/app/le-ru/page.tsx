import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import styles from "./leru.module.css";

export const metadata: Metadata = {
  title: "Le Ru",
  description:
    "Qu'est-ce qu'un ru ? Le préambule au parcours : un mot presque oublié et un ruisseau enfoui sous Paris, de 629 à 1823.",
};

export default function LeRuPage() {
  return (
    <>
      <Nav />

      <div className={styles.page}>
      <header className={styles.hero}>
        <div className="eyebrow eau">Préambule</div>
        <h1 className="display">Qu&apos;est-ce qu&apos;un ru&nbsp;?</h1>
        <p className={styles.sub}>
          Avant les huit plaques, un mot presque oublié, et un ruisseau enfoui sous Paris.
        </p>
      </header>

      {/* définition */}
      <section className={`paper ${styles.sec}`}>
        <div className={`${styles.wrap} ${styles.grid}`}>
          <Reveal>
            <div className="eyebrow">Définition</div>
            <h2 className="display">Un ru, c&apos;est un ruisseau</h2>
            <p>
              Un ru (du latin <em>rivus</em>) désigne un petit cours d&apos;eau, un ruisseau.
              Le mot, aujourd&apos;hui tombé en désuétude, nommait ces filets d&apos;eau qui
              sillonnaient campagnes et villes avant d&apos;être détournés, busés ou enfouis.
            </p>
            <p>
              Nés sur les hauteurs, les ru descendaient vers les fleuves en épousant le relief :
              ils dessinaient, en creux, la géographie des lieux. Paris en comptait plusieurs,
              aujourd&apos;hui disparus sous la ville.
            </p>
          </Reveal>
          <Reveal className={styles.figure}>
            <Image src="/img/le-ru/00.jpg" alt="" fill sizes="(max-width:820px) 100vw, 560px" style={{ objectFit: "cover" }} />
            <figcaption className={styles.figcap}>
              La Bièvre à ciel ouvert, dans les rues des tanneurs : un ru dans la ville.
            </figcaption>
          </Reveal>
        </div>
      </section>

      {/* le ru de Ménilmontant */}
      <section className={styles.sec}>
        <div className={`${styles.wrap} ${styles.grid} ${styles.rev}`}>
          <Reveal className={styles.figure}>
            <Image src="/img/le-ru/01.jpg" alt="" fill sizes="(max-width:820px) 100vw, 560px" style={{ objectFit: "cover" }} />
            <figcaption className={styles.figcap}>Le ru enfoui, devenu galerie sous la ville.</figcaption>
          </Reveal>
          <Reveal>
            <div className="eyebrow eau">Le ru de Ménilmontant</div>
            <h2 className="display">De Belleville à la Seine</h2>
            <p>
              Le ru de Ménilmontant prenait sa source sur les hauteurs de Belleville et de
              Ménilmontant, à l&apos;est de Paris. Mentionné dès 629 dans une charte de Dagobert
              I<sup>er</sup>, il traversait la ville, alimentait les marécages du Marais, puis se
              jetait dans la Seine.
            </p>
            <p>
              Canalisé dès le XVI<sup>e</sup> siècle sous le nom de «&nbsp;Grand Égout&nbsp;», il
              fut peu à peu recouvert jusqu&apos;à disparaître entièrement de la surface vers 1823.
              Aujourd&apos;hui, plus rien n&apos;en paraît : la ville a poussé par-dessus.
            </p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <b>629</b>
                <span>première mention écrite</span>
              </div>
              <div className={styles.stat}>
                <b>1823</b>
                <span>disparition totale en surface</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* le choix */}
      <section className={`paper ${styles.sec}`}>
        <div className={`${styles.wrap} ${styles.grid}`}>
          <Reveal>
            <div className="eyebrow">Le choix</div>
            <h2 className="display">Pourquoi ce ruisseau</h2>
            <p>
              J&apos;ai choisi le ru de Ménilmontant parce qu&apos;il me correspond : je suis né
              là-bas, et c&apos;est mon quartier que ce ruisseau raconte. Voir sa ville (ou du
              moins son quartier) se transformer au fil des siècles, c&apos;est ce qui m&apos;a le
              plus parlé.
            </p>
            <p>
              Ce cours d&apos;eau condense toute une trajectoire : d&apos;élément naturel du
              paysage, il est devenu une infrastructure souterraine invisible (le Grand Égout)
              avant de disparaître sous la ville. M&apos;y intéresser, c&apos;est interroger cette
              transition du vivant vers le technique, et les conséquences urbaines, sociales et
              symboliques de cette disparition.
            </p>
            <p>
              De là vient l&apos;idée de <strong>re-signalisation</strong> : rendre de nouveau
              perceptible un élément du territoire effacé. La plaque d&apos;égout, banale sur le
              trottoir, devient le marqueur de surface de cette eau enfouie, le fil discret qui
              relie le ru d&apos;hier au réseau d&apos;aujourd&apos;hui.
            </p>
          </Reveal>
          <Reveal className={styles.figure}>
            <Image src="/img/le-ru/02.jpg" alt="" fill sizes="(max-width:820px) 100vw, 560px" style={{ objectFit: "cover" }} />
            <figcaption className={styles.figcap}>
              «&nbsp;Ruisseau de Paris&nbsp;», l&apos;eau qui court encore dans le caniveau (photo Pierre Boucher).
            </figcaption>
          </Reveal>
        </div>
      </section>

      {/* un principe pour tous les ru */}
      <section className={styles.sec}>
        <Reveal className={`${styles.wrap} ${styles.principle}`}>
          <div className="eyebrow center eau">Reproductible</div>
          <h2 className="display">Un principe pour tous les ru oubliés</h2>
          <p>
            Ce que je propose pour le ru de Ménilmontant vaut pour tous les cours d&apos;eau
            disparus de Paris. Le dispositif (une plaque gravée, un parcours à scanner, une
            mémoire rendue lisible dans la rue) est reproductible : partout où l&apos;eau a été
            enfouie, on peut la re-signaler.
          </p>
          <div className={styles.chips}>
            {["La Bièvre", "Le ru de Belleville", "Le ru de Montmartre", "Le ru d'Arcueil", "…"].map(
              (c) => (
                <span key={c} className={styles.chip}>
                  {c}
                </span>
              ),
            )}
          </div>
        </Reveal>
      </section>
      </div>

      <Footer paper />
    </>
  );
}
