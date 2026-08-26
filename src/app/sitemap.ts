import type { MetadataRoute } from "next";
import { plaques } from "@/data/plaques";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/le-ru", priority: 0.9 },
    { path: "/a-propos", priority: 0.9 },
    { path: "/parcours", priority: 0.8 },
    { path: "/carte", priority: 0.8 },
    { path: "/galerie", priority: 0.6 },
    { path: "/collection", priority: 0.5 },
  ];

  const base: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p.priority,
  }));

  const plaquePages: MetadataRoute.Sitemap = plaques.map((p) => ({
    url: `${SITE_URL}/plaques/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...base, ...plaquePages];
}
