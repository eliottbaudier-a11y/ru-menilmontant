"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { plaques } from "@/data/plaques";
import { useStore } from "@/lib/store";
import Roundel from "./Roundel";
import styles from "./PlaqueSlider.module.css";

const CARD = 380;
const GAP = 24;

/** Carrousel des 8 plaques (le cours du ru). Débloquées cliquables. */
export default function PlaqueSlider() {
  const router = useRouter();
  const { isUnlocked } = useStore();
  const [idx, setIdx] = useState(0);
  const [offset, setOffset] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const layout = useCallback(() => {
    const vw = sliderRef.current?.clientWidth ?? 0;
    // largeur de carte effective (responsive)
    const cw = vw < 680 ? 300 : CARD;
    setOffset(vw / 2 - cw / 2 - idx * (cw + GAP));
  }, [idx]);

  useEffect(() => {
    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [layout]);

  // autoplay, en pause au survol
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % plaques.length), 3800);
    return () => clearInterval(t);
  }, [paused]);

  const go = (n: number) => setIdx((n + plaques.length) % plaques.length);

  return (
    <section
      className={styles.section}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className={styles.head}>
        <div>
          <div className="eyebrow eau">Le parcours · les 8 plaques</div>
          <h2 className="display">Le flux à débloquer</h2>
        </div>
        <p className={styles.sub}>
          Chaque plaque se débloque en la scannant sur le terrain. Découvrez le cours du ru,
          de la source à l&apos;embouchure.
        </p>
      </div>

      <div className={styles.slider} ref={sliderRef}>
        <div className={styles.track} style={{ transform: `translateX(${offset}px)` }}>
          {plaques.map((p, i) => {
            const unlocked = isUnlocked(p.slug);
            return (
              <article
                key={p.slug}
                className={`${styles.card} ${i === idx ? styles.active : ""} ${
                  unlocked ? "" : styles.locked
                }`}
                onClick={() => (i === idx ? router.push(`/plaques/${p.slug}`) : go(i))}
              >
                <div className={styles.img}>
                  <Image src={p.hero} alt="" fill sizes="380px" style={{ objectFit: "cover" }} />
                </div>
                <div className={styles.ov} />
                <Roundel unlocked={unlocked} className={styles.roundel} />
                {!unlocked && (
                  <div className={styles.lockbadge}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#F3F1EA" strokeWidth={2}>
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                    à débloquer
                  </div>
                )}
                <div className={styles.meta}>
                  <div className={styles.rn}>Plaque {p.roman} / VIII</div>
                  <div className={styles.nm}>{p.title}</div>
                  <div className={styles.sc}>{p.subtitle}</div>
                  <div className={styles.go}>{unlocked ? "Découvrir →" : "Scannez la plaque"}</div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.ctrl}>
        <button className={styles.arrow} onClick={() => go(idx - 1)} aria-label="Précédent">
          ←
        </button>
        <button className={styles.arrow} onClick={() => go(idx + 1)} aria-label="Suivant">
          →
        </button>
        <span className={styles.idx}>
          <b>{String(idx + 1).padStart(2, "0")}</b> / 08
        </span>
        <div className={styles.dots}>
          {plaques.map((p, i) => (
            <button
              key={p.slug}
              className={`${styles.dot} ${i === idx ? styles.on : ""}`}
              onClick={() => go(i)}
              aria-label={`Aller à la plaque ${p.roman}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
