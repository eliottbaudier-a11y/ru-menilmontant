"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPlaqueByNumber } from "@/data/plaques";

/**
 * Alias court (legacy) : /plaque/1 … /plaque/8 → redirige vers la fiche
 * /plaques/[slug]?scan=1 (qui enregistre le déblocage). Les QR définitifs
 * pointent désormais directement vers /plaques/[slug]?scan=1.
 */
export default function PlaqueScanRedirect() {
  const router = useRouter();
  const params = useParams<{ n: string }>();

  useEffect(() => {
    const n = Number(params?.n);
    const plaque = Number.isFinite(n) ? getPlaqueByNumber(n) : undefined;
    router.replace(plaque ? `/plaques/${plaque.slug}?scan=1` : "/");
  }, [params, router]);

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
