"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import { plaques, TOTAL_PLAQUES } from "@/data/plaques";
import { useStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import styles from "./collection.module.css";

const PREVIEW: Record<string, string> = {
  "aux-sources-du-ru": "/img/collection/00.jpg",
  "saint-martin": "/img/collection/01.jpg",
  "le-marais": "/img/collection/02.jpg",
};

// vraies images d'archive HD (public/downloads/) + nom de fichier propre
const HD_DOWNLOAD: Record<string, { src: string; filename: string }> = {
  "aux-sources-du-ru": {
    src: "/downloads/plaque-1-vignes-de-belleville.jpg",
    filename: "ru-plaque-1-vignes-de-belleville.jpg",
  },
  "saint-martin": {
    src: "/downloads/plaque-2-canal-saint-martin.jpg",
    filename: "ru-plaque-2-canal-saint-martin.jpg",
  },
  "le-marais": {
    src: "/downloads/plaque-3-place-des-vosges.jpg",
    filename: "ru-plaque-3-place-des-vosges.jpg",
  },
};

/** roundel (rayons + double onde d'eau), aux couleurs passées en props */
function Roundel({ ray, water, gradient }: { ray: string; water: string; gradient?: boolean }) {
  const rays = Array.from({ length: 16 }).map((_, i) => {
    const a = (i * 22.5 * Math.PI) / 180;
    return (
      <line
        key={i}
        x1={(50 + 12 * Math.cos(a)).toFixed(1)}
        y1={(50 + 12 * Math.sin(a)).toFixed(1)}
        x2={(50 + 40 * Math.cos(a)).toFixed(1)}
        y2={(50 + 40 * Math.sin(a)).toFixed(1)}
      />
    );
  });
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      {gradient && (
        <>
          <defs>
            <radialGradient id="pl" cx="42%" cy="38%">
              <stop offset="0" stopColor="#3a3d80" />
              <stop offset="1" stopColor="#12143f" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="49" fill="url(#pl)" />
          <circle cx="50" cy="50" r="49" fill="none" stroke="#2b2e7a" strokeWidth="1.5" />
        </>
      )}
      <g fill="none" stroke={ray} strokeWidth="1.4">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="12" />
        {rays}
      </g>
      <path d="M22 44 C34 38 40 54 52 48 S70 42 80 52" fill="none" stroke={water} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M26 60 C36 54 44 66 56 60 S72 56 78 62" fill="none" stroke={water} strokeWidth="1.7" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export default function CollectionClient() {
  const { isUnlocked, progress, ratio, user, supabaseEnabled, signOut, demoUnlock, refreshUser } =
    useStore();
  const complete = progress >= TOTAL_PLAQUES;
  const demoDone = ["aux-sources-du-ru", "saint-martin", "le-marais"].every(isUnlocked);

  // formulaire de compte
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ type: "err" | "ok"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const supabase = createClient();
    if (!supabase) {
      setMsg({
        type: "ok",
        text: "Comptes en ligne bientôt actifs. En attendant, ta progression est sauvegardée sur cet appareil.",
      });
      return;
    }
    setPending(true);
    try {
      if (tab === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await refreshUser();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg({ type: "ok", text: "Compte créé. Confirme ton e-mail puis connecte-toi." });
      }
    } catch (err) {
      setMsg({ type: "err", text: (err as Error).message });
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Nav />
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className="eyebrow eau">Mon compte</div>
          <h1 className="display">Ma Collection</h1>
          <p>
            Ton compte garde une vraie trace de chaque plaque scannée. Chaque plaque débloquée te
            donne son image en HD, et scanner les huit débloque la récompense finale.
          </p>
        </header>

        {/* compte : formulaire + état */}
        <section className={styles.sec}>
          <div className={styles.account}>
            <div className={styles.accForm}>
              {user ? (
                <>
                  <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
                    Connecté·e
                  </div>
                  <div style={{ opacity: 0.75, fontSize: 14 }}>{user.email}</div>
                  <p className={styles.mini}>
                    Tes plaques scannées sont sauvegardées sur ton compte et te suivent sur tous tes
                    appareils.
                  </p>
                </>
              ) : (
                <form onSubmit={submit}>
                  <div className={styles.tabs}>
                    <button
                      type="button"
                      className={`${styles.tab} ${tab === "login" ? styles.on : ""}`}
                      onClick={() => setTab("login")}
                    >
                      Connexion
                    </button>
                    <button
                      type="button"
                      className={`${styles.tab} ${tab === "signup" ? styles.on : ""}`}
                      onClick={() => setTab("signup")}
                    >
                      Inscription
                    </button>
                  </div>
                  <label>E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.fr"
                  />
                  <label>Mot de passe</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button className={styles.btn} disabled={pending}>
                    {pending ? "…" : tab === "login" ? "Se connecter" : "Créer mon compte"}
                  </button>
                  {msg && <div className={`${styles.msg} ${styles[msg.type]}`}>{msg.text}</div>}
                  <p className={styles.mini}>
                    Ton compte sauvegarde tes plaques scannées et débloque ta récompense. Sans
                    compte, la progression reste locale à ton appareil.
                    {!supabaseEnabled && " (Comptes en ligne bientôt activés.)"}
                  </p>
                </form>
              )}
            </div>

            <div className={styles.accState}>
              <div className={styles.chip}>
                ● {user ? `Connecté · ${user.email?.split("@")[0]}` : "Progression locale"}
              </div>
              <div className={styles.big}>
                {progress}
                <span>/{TOTAL_PLAQUES}</span>
              </div>
              <div className={styles.lbl}>
                {user ? "plaques sauvegardées dans ton compte" : "plaques débloquées sur cet appareil"}
              </div>
              <div className={styles.progbar}>
                <span style={{ width: `${Math.round(ratio * 100)}%` }} />
              </div>
              {!demoDone && (
                <button className={styles.demo} onClick={() => demoUnlock()}>
                  Mode démo — débloquer I·II·III
                </button>
              )}
              {user && (
                <button className={styles.signout} onClick={() => signOut()}>
                  Se déconnecter
                </button>
              )}
            </div>
          </div>
        </section>

        {/* mes plaques */}
        <section className={styles.sec}>
          <div className={styles.sechead}>
            <h2 className="display">Mes plaques</h2>
            <span>télécharge l&apos;image HD de chaque plaque débloquée</span>
          </div>
          <div className={styles.grid}>
            {plaques.map((p) => {
              const unlocked = isUnlocked(p.slug);
              const thumb = PREVIEW[p.slug] ?? p.hero;
              const hd = HD_DOWNLOAD[p.slug];
              return (
                <article key={p.slug} className={`${styles.pcard} ${unlocked ? "" : styles.off}`}>
                  {/* toutes les images sont montrées ; les non débloquées sont grisées
                      (comme dans le slider Parcours) */}
                  <div className={`${styles.pimg} ${unlocked ? "" : styles.locked}`}>
                    {/* petite vignette (fichier léger) servie directement */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb} alt="" />
                    <span className={styles.rd}>
                      <Roundel ray="#EDEDFF" water="#63D0DE" />
                    </span>
                    {!unlocked && (
                      <span className={styles.lockbadge}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#F3F1EA" strokeWidth={2}>
                          <rect x="5" y="11" width="14" height="10" rx="2" />
                          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                        à débloquer
                      </span>
                    )}
                  </div>
                  <div className={styles.pmeta}>
                    <div className={styles.pn}>
                      Plaque {p.roman} · {p.title}
                    </div>
                    <div className={styles.pl}>
                      {p.quartier} · {p.arrondissement}
                    </div>
                    <div className={`${styles.pscan} ${unlocked ? "" : styles.off}`}>
                      {unlocked ? "✓ Débloquée" : "À scanner sur le terrain"}
                    </div>
                    {unlocked && hd ? (
                      <a className={styles.dl} href={hd.src} download={hd.filename}>
                        Télécharger l&apos;image (HD) ↓
                      </a>
                    ) : (
                      <span className={`${styles.dl} ${styles.muted}`}>
                        {unlocked ? "Image HD à venir" : "Image disponible après scan"}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* récompense */}
        <section className={styles.sec}>
          <div className={styles.sechead}>
            <h2 className="display">Ma récompense</h2>
            <span>le NFT du parcours complet</span>
          </div>
          <div className={styles.reward}>
            <div className={styles.spinwrap}>
              <div className={`${styles.spin} ${complete ? "" : styles.locked}`}>
                <Roundel ray="#63D0DE" water="#8CEBF5" gradient />
              </div>
            </div>
            <div>
              <h3>Le parcours complet</h3>
              <p>
                Scanne les huit plaques pour débloquer la récompense : la plaque du parcours complet,
                en 3D — une plaque qui tourne, en édition unique (NFT à venir).
              </p>
              <div className={styles.rprog}>
                {complete ? "✓ Débloqué — 8 / 8" : `Débloqué à 8/8 — plus que ${TOTAL_PLAQUES - progress} plaques`}
              </div>
              <span className={styles.badge}>
                {complete ? "Récompense débloquée" : `Récompense verrouillée — ${progress}/8`}
              </span>
            </div>
          </div>
        </section>

        <footer className={styles.foot}>
          <div>Ru de Ménilmontant · Les ruisseaux oubliés de Paris</div>
          <div className={styles.sub}>
            Ma Collection · compte, images HD &amp; récompense
            <br />
            Eliott Baudier · 2026
          </div>
        </footer>
      </div>
    </>
  );
}
