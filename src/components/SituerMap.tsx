import { plaques } from "@/data/plaques";

/**
 * Carte « Situer » façon Terra Forma : lignes de niveau, tracé du ru en coupe,
 * les 8 repères. La plaque active est mise en avant (« vous êtes ici »).
 * Base cartographique partagée par toutes les fiches.
 */

// positions des 8 repères dans le repère 1040×540 (relevées de la maquette)
const PTS: [number, number][] = [
  [940, 210], // I  Ménilmontant (source, est)
  [826.8, 255.6], // II
  [719.7, 230.7], // III
  [612.1, 262.0], // IV
  [505.0, 216.2], // V
  [398.8, 250.4], // VI
  [292.2, 228.9], // VII
  [120.0, 330.0], // VIII Alma (embouchure, ouest)
];

function isoline(baseY: number, amp: number, freq: number, phase: number): string {
  const pts: string[] = [];
  for (let x = -10; x <= 1040; x += 16) {
    const y = baseY + amp * Math.sin(x * freq + phase);
    pts.push(`${x === -10 ? "M" : "L"} ${x} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

// tracé fluide passant par les 8 points (courbe quadratique par milieux)
function tracePath(): string {
  const p = PTS;
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length; i++) {
    const [x0, y0] = p[i - 1];
    const [x1, y1] = p[i];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    d += ` Q ${x0} ${y0} ${mx} ${my}`;
  }
  d += ` T ${p[p.length - 1][0]} ${p[p.length - 1][1]}`;
  return d;
}

const ISO = [
  isoline(96, 34, 0.012, 0),
  isoline(150, 30, 0.011, 1.1),
  isoline(210, 40, 0.013, 2.0),
  isoline(272, 32, 0.012, 0.6),
  isoline(330, 36, 0.011, 1.7),
  isoline(392, 30, 0.013, 2.4),
  isoline(452, 34, 0.012, 0.3),
];

export default function SituerMap({ active }: { active: number }) {
  const trace = tracePath();
  return (
    <svg
      viewBox="0 0 1040 540"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Carte : position de la plaque ${plaques[active - 1]?.roman} sur le tracé du ru`}
    >
      <rect width="1040" height="540" fill="#E7E7F5" />

      {/* lignes de niveau */}
      <g>
        {ISO.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#2D308C"
            strokeWidth={i % 3 === 0 ? 1 : 0.6}
            opacity={i % 3 === 0 ? 0.28 : 0.16}
            strokeDasharray={i % 3 === 0 ? undefined : "2 3"}
          />
        ))}
      </g>

      {/* la Seine (bas gauche) */}
      <g>
        <path
          d="M -10 372 C 90 362 130 362 200 392"
          fill="none"
          stroke="#2D308C"
          strokeWidth={1.3}
          opacity={0.55}
        />
        <text x="60" y="418" fontFamily="var(--font-display), Anton" fontSize="17" fill="#2D308C" opacity="0.45">
          LA SEINE
        </text>
      </g>

      {/* tracé du ru : halo + trait */}
      <g>
        <path d={trace} fill="none" stroke="#2D308C" strokeWidth={7} opacity={0.13} strokeLinecap="round" strokeLinejoin="round" />
        <path d={trace} fill="none" stroke="#2D308C" strokeWidth={2.4} opacity={1} strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* repères */}
      <g fontFamily="var(--font-display), Anton">
        {PTS.map(([x, y], i) => {
          const p = plaques[i];
          const isActive = p.n === active;
          if (isActive) {
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={16} fill="none" stroke="#63D0DE" strokeWidth={1.8} />
                <circle cx={x} cy={y} r={6.5} fill="#2D308C" />
                <text x={x} y={y - 40} textAnchor="middle" fontSize={20} fill="#2D308C">
                  {p.roman}
                </text>
                <text
                  x={x}
                  y={y - 24}
                  textAnchor="middle"
                  fontFamily="var(--font-body), Barlow Semi Condensed"
                  fontSize={12}
                  letterSpacing="0.14em"
                  fill="#2D308C"
                >
                  {p.quartier.toUpperCase()}
                </text>
                <text
                  x={x}
                  y={y - 9}
                  textAnchor="middle"
                  fontFamily="var(--font-serif), Spectral"
                  fontStyle="italic"
                  fontSize={11}
                  fill="#3aa7b8"
                >
                  vous êtes ici
                </text>
              </g>
            );
          }
          return (
            <g key={i} opacity={0.45}>
              <circle cx={x} cy={y} r={4} fill="#2D308C" opacity={0.6} />
              <text x={x} y={y - 11} textAnchor="middle" fontSize={12} fill="#2D308C">
                {p.roman}
              </text>
            </g>
          );
        })}
      </g>

      {/* titre carte */}
      <g fontFamily="var(--font-body), Barlow Semi Condensed">
        <text x={1006} y={30} textAnchor="end" fontSize={11} letterSpacing="0.2em" fill="#2D308C" opacity={0.6}>
          CARTE
        </text>
        <text x={1006} y={51} textAnchor="end" fontFamily="var(--font-display), Anton" fontSize={18} fill="#2D308C">
          LIGNES DE NIVEAU
        </text>
      </g>
    </svg>
  );
}
