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
        {/* zone QR gravée, révélée « par la pluie » au survol. Le QR remplit un
            grand disque (jusqu'aux lettres) MOINS le couloir du ru (saignée) et
            MOINS la fente noire centrale → deux lobes de part et d'autre du tracé. */}
        <svg
          className={styles.qr}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={`ring-${plaque.n}`} gradientUnits="userSpaceOnUse" cx="50" cy="50" r="32">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.9" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </radialGradient>
            <mask id={`qrmask-${plaque.n}`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <circle cx="50" cy="50" r="32" fill={`url(#ring-${plaque.n})`} />
              {/* évidement de la fente centrale : le QR ne la recouvre pas */}
              <rect x="40.5" y="43.5" width="19" height="11" rx="3" ry="3" fill="#000" />
              {/* saignée du ru : couloir libre autour du tracé */}
              {onde && (
                <>
                  <path d={onde.top} fill="none" stroke="#000" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
                  {onde.bot && (
                    <path d={onde.bot} fill="none" stroke="#000" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
                  )}
                </>
              )}
            </mask>
          </defs>
          <image
            href={`/qr/reveal/plaque-${plaque.n}.svg`}
            x="18"
            y="18"
            width="64"
            height="64"
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
