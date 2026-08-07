"use client";

import { useEffect } from "react";
import type { Plaque } from "@/data/plaques";
import { useStore } from "@/lib/store";
import PlaqueArticle from "./PlaqueArticle";
import LockedPlaque from "./LockedPlaque";

/**
 * Décide quoi afficher pour une plaque :
 *  - arrivée avec ?scan=1 → on enregistre le déblocage (Supabase si connecté,
 *    sinon local) et on montre la fiche.
 *  - sinon → fiche complète si déjà débloquée, sinon page « à révéler ».
 * Le déblocage « en dur » n'existe plus : au départ tout est verrouillé.
 */
export default function PlaqueGate({ plaque, scan }: { plaque: Plaque; scan: boolean }) {
  const { isUnlocked, markScanned, hydrated } = useStore();

  useEffect(() => {
    if (scan) markScanned(plaque.slug);
  }, [scan, plaque.slug, markScanned]);

  const show = scan || isUnlocked(plaque.slug);

  // évite le flash « verrouillé » pour une plaque déjà débloquée (état lu en local)
  if (!hydrated && !scan) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(120% 90% at 50% 12%, #232674 0%, var(--nuit) 45%, var(--encre) 100%)",
        }}
      />
    );
  }

  return show && plaque.hasContent ? (
    <PlaqueArticle plaque={plaque} />
  ) : (
    <LockedPlaque plaque={plaque} />
  );
}
