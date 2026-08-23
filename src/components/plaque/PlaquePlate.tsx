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
        {/* zone QR gravée, révélée « par la pluie » au survol. Le masque est
            dérivé directement de l'image de la plaque (public/qr/reveal/mask-N.png) :
            le QR ne s'affiche QUE sur le béton clair, jamais sur le sillon ni la
            fente (marge de sécurité incluse). */}
        <svg
          className={styles.qr}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <mask id={`qrmask-${plaque.n}`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <image
                href={`/qr/reveal/mask-${plaque.n}.png`}
                x="0"
                y="0"
                width="100"
                height="100"
                preserveAspectRatio="none"
              />
            </mask>
          </defs>
          <image
            href={`/qr/reveal/plaque-${plaque.n}.svg`}
            x="0"
            y="0"
            width="100"
            height="100"
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
