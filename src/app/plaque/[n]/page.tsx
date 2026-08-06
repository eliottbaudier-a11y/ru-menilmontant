"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPlaqueByNumber } from "@/data/plaques";
import { useStore } from "@/lib/store";

/**
 * Cible des QR codes : /plaque/1 … /plaque/8
 * Enregistre le scan (progression) puis redirige vers la fiche /plaques/[slug].
 * Ce niveau d'indirection permet des URL courtes et stables sur les plaques.
 */
export default function PlaqueScanRedirect() {
  const router = useRouter();
  const { markScanned } = useStore();
  const params = useParams<{ n: string }>();

  useEffect(() => {
    const n = Number(params?.n);
    const plaque = Number.isFinite(n) ? getPlaqueByNumber(n) : undefined;
    if (!plaque) {
      router.replace("/");
      return;
    }
    markScanned(plaque.slug);
    router.replace(`/plaques/${plaque.slug}`);
  }, [params, markScanned, router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        flexDirection: "column",
        background:
          "radial-gradient(120% 90% at 50% 12%, #232674 0%, var(--nuit) 45%, var(--encre) 100%)",
      }}
    >
      <span
        style={{
          fontSize: 12,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--eau)",
        }}
      >
        Plaque scannée
      </span>
      <span className="display" style={{ fontSize: 26 }}>
        Révélation en cours…
      </span>
    </div>
  );
}
