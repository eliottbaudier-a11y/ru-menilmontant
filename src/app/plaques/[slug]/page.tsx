import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlaque, plaques } from "@/data/plaques";
import PlaqueArticle from "@/components/plaque/PlaqueArticle";
import LockedPlaque from "@/components/plaque/LockedPlaque";

export function generateStaticParams() {
  return plaques.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plaque = getPlaque(slug);
  if (!plaque) return { title: "Plaque introuvable" };
  return {
    title: `Plaque ${plaque.roman} — ${plaque.title}`,
    description: plaque.subtitle,
  };
}

export default async function PlaquePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plaque = getPlaque(slug);
  if (!plaque) notFound();

  return plaque.hasContent ? (
    <PlaqueArticle plaque={plaque} />
  ) : (
    <LockedPlaque plaque={plaque} />
  );
}
