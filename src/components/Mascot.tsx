/**
 * Le totem / mascotte du projet : une silhouette-goutte posée sur une flaque
 * gravée. Au survol (classe .rainOn du parent), la pluie tombe et l'onde
 * « re-signalée » s'illumine. Utilisé dans les pieds de page.
 */
export default function Mascot({
  className = "",
  color = "var(--bleu)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 260 250" aria-hidden="true">
      <ellipse cx="176" cy="212" rx="66" ry="13" fill="rgba(45,48,140,.12)" />
      {/* flaque gravée (creux, faible) */}
      <g className="fgrave" fill="none" stroke="rgba(45,48,140,.28)" strokeWidth={1.4}>
        <ellipse cx="176" cy="198" rx="60" ry="19" />
        <ellipse cx="176" cy="198" rx="50" ry="15.5" />
        <path d="M158 186 C170 191 162 200 174 203 C186 205 180 211 192 208" />
      </g>
      {/* flaque re-signalée (onde eau, s'anime au survol) */}
      <g className="frev" fill="none" stroke="var(--eau)" strokeWidth={1.7} strokeLinecap="round">
        <ellipse cx="176" cy="198" rx="60" ry="19" opacity={0.85} />
        <path d="M158 186 C170 191 162 200 174 203 C186 205 180 211 192 208" />
      </g>
      {/* le totem */}
      <g transform="translate(8,70) scale(1.78)" fill={color}>
        <rect x="18" y="6" width="24" height="22" rx="5" />
        <path d="M23 32 h14 a4 4 0 0 1 4 3.6 l4 40 a4 4 0 0 1 -4 4.4 h-22 a4 4 0 0 1 -4 -4.4 l4 -40 a4 4 0 0 1 4 -3.6 z" />
      </g>
      {/* la pluie */}
      <g className="frain">
        {[
          [146, 46],
          [160, 40],
          [176, 48],
          [190, 42],
          [204, 46],
          [168, 44],
          [184, 40],
          [154, 42],
        ].map(([cx, cy], i) => (
          <ellipse key={i} className="frd" cx={cx} cy={cy} rx={1.4} ry={4.6} fill="var(--eau)" />
        ))}
      </g>
    </svg>
  );
}
