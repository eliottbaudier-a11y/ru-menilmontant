/**
 * Le « roundel » : glyphe circulaire d'une plaque (rayons + onde d'eau).
 * unlocked = true → tracé couleur eau + onde visible ; sinon papier atténué.
 * Provisoire côté graphisme (cf. CLAUDE.md : roundels à remodeler).
 */
export default function Roundel({
  unlocked = false,
  className = "",
}: {
  unlocked?: boolean;
  className?: string;
}) {
  const stroke = unlocked ? "var(--eau)" : "var(--papier)";
  const rays = Array.from({ length: 16 }).map((_, i) => {
    const a = (i * 22.5 * Math.PI) / 180;
    return (
      <line
        key={i}
        x1={50 + 12 * Math.cos(a)}
        y1={50 + 12 * Math.sin(a)}
        x2={50 + 40 * Math.cos(a)}
        y2={50 + 40 * Math.sin(a)}
      />
    );
  });
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="none" stroke={stroke} strokeWidth={1.4}>
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="12" />
        {rays}
      </g>
      {unlocked && (
        <path
          d="M22 44 C34 38 40 54 52 48 S70 42 80 52"
          fill="none"
          stroke="var(--eau)"
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
