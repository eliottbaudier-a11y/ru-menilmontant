import Image from "next/image";
import type { Plaque } from "@/data/plaques";
import { ondePaths } from "@/data/onde-paths";
import styles from "@/app/plaques/plaque.module.css";

/**
 * La plaque en fonte + le tracé exact du ru gravé, révélé « par l'eau » au
 * survol (sur mobile, un appui sur la plaque déclenche l'état de survol).
 */
export default function PlaquePlate({ plaque }: { plaque: Plaque }) {
  const onde = ondePaths[plaque.slug];

  return (
    <div>
      <figure className={styles.platefig}>
        {plaque.fonte && (
          <Image
            className={styles.plate}
            src={plaque.fonte}
            alt={`Plaque en fonte gravée — ${plaque.title}`}
            width={860}
            height={860}
            sizes="(max-width:820px) 90vw, 430px"
          />
        )}
        {onde && (
          <svg className={styles.onde} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className={`${styles.ru} ${styles.top}`} pathLength={1} d={onde.top} />
            {onde.bot && (
              <path className={`${styles.ru} ${styles.bot}`} pathLength={1} d={onde.bot} />
            )}
          </svg>
        )}
      </figure>
      <div className={styles.hint}>Survolez : l&apos;eau révèle le tracé du ru gravé ↑</div>
    </div>
  );
}
