import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlaque, plaques } from "@/data/plaques";
import PlaqueGate from "@/components/plaque/PlaqueGate";

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
    title: `Plaque ${plaque.roman} · ${plaque.title}`,
    description: plaque.subtitle,
  };
}

export default async function PlaquePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const plaque = getPlaque(slug);
  if (!plaque) notFound();

  const scan = sp?.scan === "1";
  return <PlaqueGate plaque={plaque} scan={scan} />;
}
