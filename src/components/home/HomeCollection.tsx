"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { TOTAL_PLAQUES } from "@/data/plaques";
import CollectionGrid from "@/components/CollectionGrid";
import Reveal from "@/components/Reveal";
import styles from "@/app/home.module.css";

export default function HomeCollection() {
  const { progress } = useStore();
  const remaining = TOTAL_PLAQUES - progress;

  return (
    <section className={styles.collec} id="collection">
      <Reveal>
        <div className="eyebrow center eau">Ma collection</div>
        <h2 className="display">Débloquez le ruisseau</h2>
        <p className={styles.prog}>
          {progress} / {TOTAL_PLAQUES} plaques découvertes
          {remaining > 0
            ? ` — scannez les ${remaining} dernières pour compléter le flux.`
            : " — le flux est complet, félicitations !"}
        </p>
      </Reveal>
      <Reveal>
        <CollectionGrid linkUnlocked />
      </Reveal>
      <Link className="cta" href="/collection">
        Voir ma collection
      </Link>
    </section>
  );
}
