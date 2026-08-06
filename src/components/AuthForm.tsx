"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useStore } from "@/lib/store";
import styles from "@/app/(auth)/auth.module.css";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const { refreshUser } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<{ type: "err" | "ok" | "warn"; text: string } | null>(null);

  const isLogin = mode === "login";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const supabase = createClient();
    if (!supabase) {
      setMsg({
        type: "warn",
        text: "L'authentification n'est pas encore configurée (clés Supabase manquantes). En attendant, ta collection est sauvegardée sur cet appareil.",
      });
      return;
    }

    setPending(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await refreshUser();
        router.push("/collection");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg({
          type: "ok",
          text: "Compte créé. Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.",
        });
      }
    } catch (err) {
      setMsg({ type: "err", text: (err as Error).message ?? "Une erreur est survenue." });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <Link href="/" className={styles.back}>
          ← Accueil
        </Link>
        <h1 className="display">{isLogin ? "Connexion" : "Créer un compte"}</h1>
        <p className={styles.sub}>
          {isLogin
            ? "Retrouvez votre collection et votre progression."
            : "Sauvegardez les plaques scannées et débloquez votre récompense."}
        </p>

        {!isSupabaseConfigured && (
          <div className={`${styles.msg} ${styles.warn}`} style={{ marginBottom: 24, marginTop: 0 }}>
            Mode démonstration : les comptes seront actifs une fois les clés Supabase
            ajoutées. Votre progression est déjà sauvegardée localement.
          </div>
        )}

        <form onSubmit={onSubmit}>
          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.fr"
            />
          </label>
          <label className={styles.field}>
            <span>Mot de passe</span>
            <input
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className={`cta ${styles.submit}`} disabled={pending}>
            {pending ? "…" : isLogin ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>

        {msg && <div className={`${styles.msg} ${styles[msg.type]}`}>{msg.text}</div>}

        <p className={styles.alt}>
          {isLogin ? (
            <>
              Pas encore de compte ? <Link href="/signup">Créer un compte</Link>
            </>
          ) : (
            <>
              Déjà inscrit ? <Link href="/login">Se connecter</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
