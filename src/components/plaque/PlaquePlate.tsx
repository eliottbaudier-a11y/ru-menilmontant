import Image from "next/image";
import type { Plaque } from "@/data/plaques";
import { ondePaths } from "@/data/onde-paths";
import styles from "@/app/plaques/plaque.module.css";

/**
 * Emplacement du halo QR par plaque (repère plateau 0–100).
 *  - Plaque 1 : anneau centré autour de la fente, le tracé fin le traverse
 *    (donut + saignée). `carve` = on soustrait le tracé du masque.
 *  - Plaques 2 & 3 : disque plein posé sur une zone de BÉTON CLAIR, à l'écart
 *    du sillon (gris foncé) ET de la fente noire centrale. Pas de saignée.
 */
type QrZone = { cx: number; cy: number; r: number; donut: boolean; carve: boolean };
const QR_ZONES: Record<string, QrZone> = {
  "aux-sources-du-ru": { cx: 50, cy: 50, r: 31, donut: true, carve: true },
  "saint-martin": { cx: 66, cy: 63, r: 10, donut: false, carve: false },
  "le-marais": { cx: 50, cy: 33, r: 11, donut: false, carve: false },
};

/**
 * La plaque en fonte + le tracé exact du ru gravé, révélé « par l'eau » au
 * survol (sur mobile, un appui sur la plaque déclenche l'état de survol).
 */
export default function PlaquePlate({ plaque }: { plaque: Plaque }) {
  const onde = ondePaths[plaque.slug];
  const z = QR_ZONES[plaque.slug] ?? { cx: 50, cy: 50, r: 31, donut: true, carve: true };
  const qx = z.cx - z.r;
  const qy = z.cy - z.r;
  const qs = z.r * 2;

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
        {/* zone QR gravée, révélée « par la pluie » au survol.
            Plaque 1 : anneau centré + saignée du tracé. Plaques 2 & 3 : disque
            plein posé sur le béton clair, à l'écart du sillon et de la fente. */}
        <svg
          className={styles.qr}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <radialGradient
              id={`ring-${plaque.n}`}
              gradientUnits="userSpaceOnUse"
              cx={z.cx}
              cy={z.cy}
              r={z.r}
            >
              {z.donut ? (
                <>
                  <stop offset="0.18" stopColor="#000" />
                  <stop offset="0.25" stopColor="#fff" />
                  <stop offset="0.88" stopColor="#fff" />
                  <stop offset="0.96" stopColor="#000" />
                </>
              ) : (
                <>
                  <stop offset="0" stopColor="#fff" />
                  <stop offset="0.82" stopColor="#fff" />
                  <stop offset="0.97" stopColor="#000" />
                </>
              )}
            </radialGradient>
            <mask id={`qrmask-${plaque.n}`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <circle cx={z.cx} cy={z.cy} r={z.r} fill={`url(#ring-${plaque.n})`} />
              {z.carve && onde && (
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
            x={qx}
            y={qy}
            width={qs}
            height={qs}
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
