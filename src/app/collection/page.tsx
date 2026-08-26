import type { Metadata } from "next";
import CollectionClient from "./CollectionClient";

export const metadata: Metadata = {
  alternates: { canonical: "/collection" },
  title: "Ma Collection",
  description:
    "Retrouvez les plaques scannées, téléchargez leur image HD et débloquez la récompense du parcours complet.",
};

export default function CollectionPage() {
  return <CollectionClient />;
}
