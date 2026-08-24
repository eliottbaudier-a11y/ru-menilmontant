"use client";

import Link from "next/link";
import type { Plaque } from "@/data/plaques";
import { plaques, TOTAL_PLAQUES } from "@/data/plaques";
import { useStore } from "@/lib/store";
import styles from "./LockedPlaque.module.css";

/**
 * Page « à révéler » pour les plaques non encore rédigées (IV → VIII).
 * Totem + pluie au survol, invite à scanner sur le terrain. Affiche la
 * progression réelle (store) et signale si la plaque a déjà été scannée.
 */
export default function LockedPlaque({ plaque }: { plaque: Plaque }) {
  const { progress, isUnlocked } = useStore();
  const already = isUnlocked(plaque.slug);

  return (
    <div className={styles.body}>
      <div className={styles.caustic}>
        <i />
        <i />
      </div>

      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          Ru de Ménilmontant
        </Link>
        <div className={styles.st}>
          Plaque {plaque.roman} / VIII · À révéler
        </div>
      </nav>

      <div className={styles.wrap}>
        <div>
          <div className={styles.stage}>
            <svg className={styles.scene} viewBox="0 0 260 250" aria-label="Le totem et la plaque ; au survol la pluie réveille le ru">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <ellipse cx="176" cy="212" rx="70" ry="15" fill="rgba(0,0,0,.28)" />
              {/* plaque gravée (faible) */}
              <g fill="none" stroke="rgba(243,241,234,.20)" strokeWidth={1.4}>
                <ellipse cx="176" cy="198" rx="60" ry="19" />
                <ellipse cx="176" cy="198" rx="50" ry="15.5" />
                <path d="M158 186 C170 191 162 200 174 203 C186 205 180 211 192 208" />
              </g>
              {/* plaque re-signalée (au survol) */}
              <g className={styles.reveal} fill="none" stroke="var(--eau)" strokeWidth={1.7} filter="url(#glow)" strokeLinecap="round">
                <ellipse cx="176" cy="198" rx="60" ry="19" opacity={0.85} />
                <path d="M158 186 C170 191 162 200 174 203 C186 205 180 211 192 208" />
              </g>
              <ellipse className={styles.splash} cx="176" cy="196" rx="13" ry="5" fill="none" stroke="var(--eau)" strokeWidth={1.4} />
              {/* totem */}
              <g transform="translate(8,70) scale(1.78)">
                <rect className={styles.figd} x="18" y="6" width="24" height="22" rx="5" />
                <path className={styles.figd} d="M23 32 h14 a4 4 0 0 1 4 3.6 l4 40 a4 4 0 0 1 -4 4.4 h-22 a4 4 0 0 1 -4 -4.4 l4 -40 a4 4 0 0 1 4 -3.6 z" />
              </g>
              {/* pluie */}
              <g>
                {[
                  [146, 46],
                  [160, 40],
                  [176, 48],
                  [190, 42],
                  [204, 46],
                  [168, 44],
                  [184, 40],
                  [154, 42],
                ].map(([cx, cy], i) => (
                  <ellipse key={i} className={styles.rd} cx={cx} cy={cy} rx={1.4} ry={4.6} />
                ))}
              </g>
            </svg>
          </div>
          <div className={styles.hint}>Passez sur la scène : la pluie réveille le ru ↑</div>
        </div>

        <div>
          <div className={styles.eyebrow}>
            Plaque {plaque.roman} / VIII · {already ? "Scannée" : "Verrouillée"}
          </div>
          <h1 className={`display ${styles.title}`}>{plaque.title}</h1>
          <p className={styles.sub}>
            Une plaque du parcours encore enfouie. Son histoire («&nbsp;{plaque.subtitle}&nbsp;»)
            attend d&apos;être ravivée.
          </p>

          <div className={styles.cta}>
            <svg className={styles.vf} viewBox="0 0 28 28">
              <rect x="3" y="3" width="8" height="8" rx="1" />
              <rect x="17" y="3" width="8" height="8" rx="1" />
              <rect x="3" y="17" width="8" height="8" rx="1" />
              <rect x="17" y="17" width="8" height="8" rx="1" />
              <line x1="6" y1="14" x2="22" y2="14" />
            </svg>
            <div>
              <b>Scannez la plaque, dans la rue</b>
              <span>La gravure révèle son histoire</span>
            </div>
          </div>

          {already && (
            <p className={styles.scanned}>
              ✓ Plaque scannée : le contenu narratif de ce point est en préparation.
            </p>
          )}

          <div className={styles.dots}>
            {plaques.map((p) => {
              const done = isUnlocked(p.slug);
              const cur = p.n === plaque.n;
              return (
                <span
                  key={p.slug}
                  className={`${styles.d} ${done ? styles.done : ""} ${cur ? styles.cur : ""}`}
                />
              );
            })}
            <span className={styles.lab}>
              {progress} / {TOTAL_PLAQUES} débloquées
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
