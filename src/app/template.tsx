/**
 * template.tsx se re-monte à CHAQUE navigation (au contraire de layout.tsx).
 * On enveloppe donc chaque page dans un conteneur qui rejoue une animation
 * d'entrée (fondu + légère montée) à chaque changement de page. 100 % CSS
 * (voir .pageEnter dans globals.css), respecte prefers-reduced-motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="pageEnter">{children}</div>;
}
