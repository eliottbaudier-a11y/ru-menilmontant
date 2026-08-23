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
        {/* zone QR gravée, révélée « par la pluie » au survol. Le QR est masqué
            par (anneau − tracé) : la ligne du ru traverse une saignée libre. */}
        <svg
          className={styles.qr}
          viewBox="19 19 62 62"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={`ring-${plaque.n}`} gradientUnits="userSpaceOnUse" cx="50" cy="50" r="31">
              <stop offset="0.18" stopColor="#000" />
              <stop offset="0.25" stopColor="#fff" />
              <stop offset="0.88" stopColor="#fff" />
              <stop offset="0.96" stopColor="#000" />
            </radialGradient>
            <mask id={`qrmask-${plaque.n}`} maskUnits="userSpaceOnUse" x="19" y="19" width="62" height="62">
              <circle cx="50" cy="50" r="31" fill={`url(#ring-${plaque.n})`} />
              {onde && (
                <>
                  <path d={onde.top} fill="none" stroke="#000" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                  {onde.bot && (
                    <path d={onde.bot} fill="none" stroke="#000" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </>
              )}
            </mask>
          </defs>
          <image
            href={`/qr/reveal/plaque-${plaque.n}.svg`}
            x="19"
            y="19"
            width="62"
            height="62"
            preserveAspectRatio="none"
            mask={`url(#qrmask-${plaque.n})`}
          />
        </svg>
        {onde && (
          <svg className={styles.onde} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className={`${styles.ru} ${styles.top}`} pathLength={1} d={onde.top} />
            {onde.bot && (
              <path className={`${styles.ru} ${styles.bot}`} pathLength={1} d={onde.bot} />
            )}
          </svg>
        )}
      </figure>
      <div className={styles.hint}>
        Survolez : la pluie révèle le tracé du ru <em>et</em> le QR code gravés ↑
      </div>
    </div>
  );
}
