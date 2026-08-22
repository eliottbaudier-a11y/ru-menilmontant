"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEFAULT_UNLOCKED, TOTAL_PLAQUES, plaques } from "@/data/plaques";

const LS_KEY = "ru_scans";

/** Démo : à true, les plaques I/II/III sont débloquées d'office (soutenance
 *  sans scanner sur place). Par défaut false → tout est verrouillé au départ. */
const DEMO_UNLOCK = process.env.NEXT_PUBLIC_DEMO_UNLOCK === "true";

/** Déverrouillage global temporaire (démo/capture) : les 8 plaques sont
 *  ouvertes à tout le monde jusqu'à ce timestamp, puis tout se reverrouille
 *  automatiquement. Mettre 0 pour désactiver. */
const GLOBAL_UNLOCK_UNTIL = 1787427758000; // 22/08 ~21h42

type Store = {
  /** clés (slugs) réellement scannées/débloquées par l'utilisateur */
  scanned: string[];
  /** débloquées effectives (= scannées, + baseline démo si activée) */
  unlocked: string[];
  isUnlocked: (slug: string) => boolean;
  /** enregistre le déblocage d'une plaque (scan) — local + Supabase si connecté */
  markScanned: (slug: string) => void;
  /** débloque I/II/III sans QR (bouton démo) */
  demoUnlock: () => void;
  progress: number; // 0 → TOTAL_PLAQUES
  ratio: number; // 0 → 1
  /** true une fois l'état lu depuis le stockage (évite le flash « verrouillé ») */
  hydrated: boolean;
  demoAvailable: boolean;
  /** état auth */
  user: User | null;
  authReady: boolean;
  supabaseEnabled: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

function readLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [scanned, setScanned] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // -- initialisation : lecture du stockage local ---------------------------
  useEffect(() => {
    setScanned(readLocal());
    setHydrated(true);
  }, []);

  // -- auth Supabase (si configuré) -----------------------------------------
  const refreshUser = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setAuthReady(true);
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user ?? null);
    setAuthReady(true);
    if (user) {
      const { data } = await supabase.from("scans").select("plaque_slug");
      if (data) {
        const remote = data.map((r) => r.plaque_slug as string);
        const merged = Array.from(new Set([...readLocal(), ...remote]));
        setScanned(merged);
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(merged));
        } catch {
          /* ignore */
        }
        const missing = merged.filter((s) => !remote.includes(s));
        if (missing.length) {
          await supabase
            .from("scans")
            .insert(missing.map((slug) => ({ user_id: user.id, plaque_slug: slug })));
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthReady(true);
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setAuthReady(true);
      return;
    }
    refreshUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshUser();
    });
    return () => subscription.unsubscribe();
  }, [refreshUser]);

  const markScanned = useCallback(
    (slug: string) => {
      setScanned((prev) => {
        if (prev.includes(slug)) return prev;
        const next = [...prev, slug];
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(next));
        } catch {
          /* quota / SSR — ignoré */
        }
        return next;
      });
      const supabase = createClient();
      if (supabase && user) {
        supabase
          .from("scans")
          .upsert(
            { user_id: user.id, plaque_slug: slug },
            { onConflict: "user_id,plaque_slug", ignoreDuplicates: true },
          )
          .then(() => {});
      }
    },
    [user],
  );

  const demoUnlock = useCallback(() => {
    DEFAULT_UNLOCKED.forEach((slug) => markScanned(slug));
  }, [markScanned]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }, []);

  const unlocked = useMemo(() => {
    // fenêtre de déverrouillage global (démo/capture) : les 8 plaques ouvertes
    if (GLOBAL_UNLOCK_UNTIL && Date.now() < GLOBAL_UNLOCK_UNTIL) {
      return plaques.map((p) => p.slug);
    }
    const base = DEMO_UNLOCK ? DEFAULT_UNLOCKED : [];
    return Array.from(new Set([...base, ...scanned]));
  }, [scanned]);

  const value: Store = useMemo(
    () => ({
      scanned,
      unlocked,
      isUnlocked: (slug: string) => unlocked.includes(slug),
      markScanned,
      demoUnlock,
      progress: unlocked.length,
      ratio: unlocked.length / TOTAL_PLAQUES,
      hydrated,
      demoAvailable: true,
      user,
      authReady,
      supabaseEnabled: isSupabaseConfigured,
      signOut,
      refreshUser,
    }),
    [scanned, unlocked, markScanned, demoUnlock, hydrated, user, authReady, signOut, refreshUser],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore doit être utilisé dans <AppProvider>");
  return ctx;
}
