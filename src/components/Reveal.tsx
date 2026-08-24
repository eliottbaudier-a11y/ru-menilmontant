"use client";

import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";

/**
 * Enveloppe un bloc et lui applique la classe .reveal (opacité + translation)
 * qui s'active quand l'élément entre dans le viewport. Reproduit l'IntersectionObserver
 * des maquettes, en version React réutilisable.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  style,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      // seuil 0 + marge basse : se déclenche dès que le bloc entre dans le
      // viewport, même s'il est plus haut que l'écran (grilles longues sur mobile).
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    // filet de sécurité : si l'observer ne se déclenche jamais (cas limites
    // mobile / blocs très hauts), on affiche quand même le bloc après un délai.
    const failsafe = window.setTimeout(() => setShown(true), 1600);
    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </Tag>
  );
}
