import { plaques } from "@/data/plaques";

/**
 * Carte « Situer » de la fiche : la vraie carte Terra Forma de la plaque active
 * (relief / lignes de niveau, tracé du ru + 8 points, « vous êtes ici », coupe).
 * Une image par plaque dans /public/cartes/ (carte-1..8).
 */
export default function SituerMap({ active }: { active: number }) {
  const p = plaques[active - 1];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/cartes/carte-${active}.png`}
      alt={`Carte du tracé du ru : position de la plaque ${p?.roman} (${p?.title})`}
      width={2167}
      height={1125}
      loading="lazy"
    />
  );
}
