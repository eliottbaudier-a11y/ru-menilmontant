"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "/le-ru", label: "Le Ru" },
  { href: "/parcours", label: "Le Parcours" },
  { href: "/carte", label: "La Carte" },
  { href: "/galerie", label: "Galerie" },
  { href: "/collection", label: "Ma Collection" },
  { href: "/a-propos", label: "À propos" },
];

/** Barre de navigation fixe, mix-blend-difference (lisible sur tout fond). */
export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Link className={styles.brand} href="/">
        Ru de Ménilmontant
      </Link>
      <div className={styles.links}>
        {LINKS.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link key={l.href} href={l.href} className={active ? styles.active : ""}>
              {l.label}
            </Link>
          );
        })}
      </div>
      <div className={styles.tag}>Paris · 629 → 1823</div>
    </nav>
  );
}
