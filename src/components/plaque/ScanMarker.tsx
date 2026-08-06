"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/**
 * Marque la plaque comme scannée dès l'arrivée sur sa fiche (les pages de
 * plaque ne sont atteintes que par scan). Rend `null`.
 */
export default function ScanMarker({ slug }: { slug: string }) {
  const { markScanned } = useStore();
  useEffect(() => {
    markScanned(slug);
  }, [slug, markScanned]);
  return null;
}
