import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPlaque, plaques } from "@/data/plaques";
import { SITE_URL } from "@/lib/site";
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
  const desc = `${plaque.subtitle}. ${plaque.quartier}, ${plaque.arrondissement} : une étape du parcours du ru de Ménilmontant, de Belleville à la Seine.`;
  return {
    title: `Plaque ${plaque.roman} · ${plaque.title}`,
    description: desc,
    alternates: { canonical: `/plaques/${plaque.slug}` },
    openGraph: {
      title: `Plaque ${plaque.roman} · ${plaque.title} · Ru de Ménilmontant`,
      description: desc,
      type: "article",
      url: `/plaques/${plaque.slug}`,
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Plaque ${plaque.roman} · ${plaque.title}`,
    description: plaque.subtitle,
    inLanguage: "fr-FR",
    about: "Ru de Ménilmontant",
    author: { "@type": "Person", name: "Eliott Baudier" },
    isPartOf: { "@type": "WebSite", name: "Ru de Ménilmontant", url: SITE_URL },
    url: `${SITE_URL}/plaques/${plaque.slug}`,
    contentLocation: {
      "@type": "Place",
      name: `${plaque.quartier}, ${plaque.arrondissement}`,
      geo: {
        "@type": "GeoCoordinates",
        latitude: plaque.coords.lat,
        longitude: plaque.coords.lng,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlaqueGate plaque={plaque} scan={scan} />
    </>
  );
}
