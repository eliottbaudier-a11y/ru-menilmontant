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
import { DEFAULT_UNLOCKED, TOTAL_PLAQUES } from "@/data/plaques";

const LS_KEY = "ru_scans";
const LS_SEEDED = "ru_seeded";

type Store = {
  /** clés (slugs) réellement scannées par l'utilisateur */
  scanned: string[];
  /** débloquées = baseline démo (I/II/III) ∪ scannées */
  unlocked: string[];
  isUnlocked: (slug: string) => boolean;
  markScanned: (slug: string) => void;
  progress: number; // 0 → TOTAL_PLAQUES
  ratio: number; // 0 → 1
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
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // -- initialisation : seed démo (I/II/III) au tout premier passage --------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(LS_SEEDED)) {
      localStorage.setItem(LS_KEY, JSON.stringify(DEFAULT_UNLOCKED));
      localStorage.setItem(LS_SEEDED, "1");
    }
    setScanned(readLocal());
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
    // si connecté, on lit les scans du compte et on fusionne avec le local
    if (user) {
      const { data } = await supabase.from("scans").select("plaque_slug");
      if (data) {
        const remote = data.map((r) => r.plaque_slug as string);
        const merged = Array.from(new Set([...readLocal(), ...remote]));
        setScanned(merged);
        localStorage.setItem(LS_KEY, JSON.stringify(merged));
        // pousse les scans locaux non encore enregistrés côté serveur
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
      // persistance serveur si connecté
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

  const signOut = useCallback(async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }, []);

  const unlocked = useMemo(
    () => Array.from(new Set([...DEFAULT_UNLOCKED, ...scanned])),
    [scanned],
  );

  const value: Store = useMemo(
    () => ({
      scanned,
      unlocked,
      isUnlocked: (slug: string) => unlocked.includes(slug),
      markScanned,
      progress: unlocked.length,
      ratio: unlocked.length / TOTAL_PLAQUES,
      user,
      authReady,
      supabaseEnabled: isSupabaseConfigured,
      signOut,
      refreshUser,
    }),
    [scanned, unlocked, markScanned, user, authReady, signOut, refreshUser],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore doit être utilisé dans <AppProvider>");
  return ctx;
}
