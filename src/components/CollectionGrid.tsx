"use client";

import Link from "next/link";
import { plaques } from "@/data/plaques";
import { useStore } from "@/lib/store";
import Roundel from "./Roundel";
import styles from "./CollectionGrid.module.css";

/**
 * Grille des 8 roundels + barre de progression, alimentée par le store.
 * `linkUnlocked` : rend les plaques débloquées cliquables vers leur fiche.
 */
export default function CollectionGrid({ linkUnlocked = false }: { linkUnlocked?: boolean }) {
  const { isUnlocked, ratio } = useStore();

  return (
    <>
      <div className={styles.progbar}>
        <span style={{ width: `${Math.round(ratio * 100)}%` }} />
      </div>
      <div className={styles.grid8}>
        {plaques.map((p) => {
          const unlocked = isUnlocked(p.slug);
          const cell = (
            <div
              className={`${styles.cell} ${unlocked ? styles.done : styles.locked} ${
                linkUnlocked && unlocked ? styles.linked : ""
              }`}
            >
              <Roundel unlocked={unlocked} />
              <span className={styles.cn}>{p.roman}</span>
            </div>
          );
          if (linkUnlocked && unlocked) {
            return (
              <Link key={p.slug} href={`/plaques/${p.slug}`} aria-label={`Plaque ${p.roman}`}>
                {cell}
              </Link>
            );
          }
          return <div key={p.slug}>{cell}</div>;
        })}
      </div>
    </>
  );
}
