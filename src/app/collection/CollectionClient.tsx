"use client";

import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { plaques, TOTAL_PLAQUES } from "@/data/plaques";
import { useStore } from "@/lib/store";
import styles from "./collection.module.css";

// visuels d'aperçu disponibles pour la collection (extraits des maquettes)
const PREVIEW: Record<string, string> = {
  "aux-sources-du-ru": "/img/collection/00.jpg",
  "saint-martin": "/img/collection/01.jpg",
  "le-marais": "/img/collection/02.jpg",
};

// vraies images d'archive HD à télécharger (fichiers dans public/downloads/).
// { chemin, nom de fichier propre au téléchargement }
const HD_DOWNLOAD: Record<string, { src: string; filename: string }> = {
  "aux-sources-du-ru": {
    src: "/downloads/plaque-1-vignes-de-belleville.jpg",
    filename: "Ru-de-Menilmontant_Plaque-I_Vignes-de-Belleville.jpg",
  },
  "saint-martin": {
    src: "/downloads/plaque-2-canal-saint-martin.jpg",
    filename: "Ru-de-Menilmontant_Plaque-II_Canal-Saint-Martin.jpg",
  },
  "le-marais": {
    src: "/downloads/plaque-3-place-des-vosges.jpg",
    filename: "Ru-de-Menilmontant_Plaque-III_Place-des-Vosges.jpg",
  },
};

function LockIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function CollectionClient() {
  const { isUnlocked, progress, user, supabaseEnabled, signOut, demoUnlock } = useStore();
  const complete = progress >= TOTAL_PLAQUES;
  const remaining = TOTAL_PLAQUES - progress;
  const demoDone = ["aux-sources-du-ru", "saint-martin", "le-marais"].every(isUnlocked);

  return (
    <>
      <Nav />

      <header className={styles.hero}>
        <div className="eyebrow eau">Mon compte</div>
        <h1 className="display">Ma Collection</h1>

        <div className={styles.account}>
          <div className={styles.big}>
            {progress} / {TOTAL_PLAQUES}
          </div>
          <div className={styles.txt}>
            {user ? (
              <>
                Connecté·e en tant que <strong>{user.email}</strong>. Ton compte sauvegarde chaque
                plaque scannée ; télécharge l&apos;image HD de chaque plaque débloquée, et scanne
                les huit pour débloquer la récompense finale.
              </>
            ) : supabaseEnabled ? (
              <>
                Sans compte, ta progression reste locale à cet appareil. Crée un compte pour la
                sauvegarder et la retrouver partout.
              </>
            ) : (
              <>
                Ta progression est sauvegardée sur cet appareil. Les comptes en ligne seront
                activés une fois la base de données connectée.
              </>
            )}
          </div>
          <div className={styles.actions}>
            {!user && supabaseEnabled && (
              <>
                <Link className="cta" href="/login">
                  Se connecter
                </Link>
                <Link className="cta solid" href="/signup">
                  Créer un compte
                </Link>
              </>
            )}
            {user && (
              <button className="cta" onClick={() => signOut()}>
                Se déconnecter
              </button>
            )}
            {!demoDone && (
              <button
                className="cta"
                onClick={() => demoUnlock()}
                title="Débloque les plaques I·II·III sans scanner (pour la soutenance)"
              >
                Mode démo — débloquer I·II·III
              </button>
            )}
          </div>
        </div>
      </header>

      {/* mes plaques */}
      <section className={styles.sec}>
        <div className={styles.sechead}>
          <h2 className="display">Mes plaques</h2>
          <span className={styles.note}>télécharge l&apos;image HD de chaque plaque débloquée</span>
        </div>
        <div className={styles.grid}>
          {plaques.map((p) => {
            const unlocked = isUnlocked(p.slug);
            const thumb = PREVIEW[p.slug] ?? p.hero;
            const hd = HD_DOWNLOAD[p.slug];
            return (
              <Reveal key={p.slug} className={`${styles.card} ${unlocked ? "" : styles.locked}`}>
                <div className={styles.thumb}>
                  <Image src={thumb} alt="" fill sizes="280px" />
                  {!unlocked && (
                    <div className={styles.lockmark}>
                      <LockIcon />
                    </div>
                  )}
                </div>
                <div className={styles.body}>
                  <span className={styles.rn}>Plaque {p.roman} / VIII</span>
                  <span className={styles.nm}>{p.title}</span>
                  <span className={styles.loc}>
                    {p.quartier} · {p.arrondissement}
                  </span>
                  <span className={`${styles.status} ${unlocked ? styles.done : ""}`}>
                    {unlocked ? "✓ Débloquée" : "À scanner sur le terrain"}
                  </span>
                  {unlocked ? (
                    hd ? (
                      <div className={styles.dl}>
                        <a
                          href={hd.src}
                          download={hd.filename}
                          aria-label={`Télécharger l'image d'archive HD de la plaque ${p.roman}`}
                        >
                          Télécharger l&apos;image (HD) ↓
                        </a>
                      </div>
                    ) : (
                      <div className={styles.soon}>Image HD à venir</div>
                    )
                  ) : (
                    <div className={styles.soon}>Image disponible après scan</div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* récompense / NFT */}
      <section className={styles.reward}>
        <div className={styles.rewardWrap}>
          <div className={styles.scene}>
            <div className={`${styles.disc} ${complete ? "" : styles.locked}`}>
              <Image src="/plaques/plaque1-fonte.png" alt="Plaque du parcours complet, en 3D" width={720} height={720} priority={false} />
              {!complete && (
                <div className={styles.lockOverlay}>
                  <LockIcon />
                  <div className={styles.n}>{progress}/8</div>
                  <div className={styles.lab}>encore {remaining} plaque{remaining > 1 ? "s" : ""}</div>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="eyebrow eau">Ma récompense</div>
            <h2 className="display">Le NFT du parcours complet</h2>
            <p>
              Scanne les huit plaques pour débloquer la récompense : la plaque du parcours
              complet, en 3D — une plaque qui tourne, en édition unique.
            </p>
            {complete ? (
              <span className={styles.badge}>✓ Débloqué — 8 / 8 · édition unique (NFT à venir)</span>
            ) : (
              <span className={styles.badge}>
                Débloqué à 8/8 — plus que {remaining} plaque{remaining > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
