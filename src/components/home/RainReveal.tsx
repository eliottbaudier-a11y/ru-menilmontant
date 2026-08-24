"use client";

import { useRef } from "react";
import styles from "@/app/home.module.css";

/**
 * « La pluie révèle le ru » : sous le curseur, un masque radial efface la
 * couche sèche (--cover) et laisse apparaître le cours d'eau lumineux dessous.
 * Reproduit l'interaction hydrochromique de la maquette d'accueil.
 */
export default function RainReveal() {
  const stageRef = useRef<HTMLDivElement>(null);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }

  // tracé du ru (dans le repère 1000x430 du stage)
  const ru =
    "M 40 250 C 220 180 300 300 460 290 S 700 200 820 260 S 980 330 1120 300";
  const contour1 = "M -20 150 C 200 120 380 200 560 170 S 900 110 1200 160";
  const contour2 = "M -20 340 C 220 300 420 360 620 330 S 940 280 1200 320";
  const pts = [
    [120, 230],
    [300, 268],
    [460, 290],
    [640, 250],
    [820, 258],
    [980, 300],
    [1080, 300],
    [1120, 300],
  ];

  return (
    <section className={styles.rain}>
      <div className="eyebrow center eau">Interactif · révélation</div>
      <h2 className="display">La pluie révèle le ru</h2>
      <p className="sub">
        Comme sur la gravure de béton : passez le curseur sur la surface, l&apos;eau
        s&apos;infiltre dans les creux et fait ressurgir le cours d&apos;eau enfoui.
      </p>

      <div
        ref={stageRef}
        className={styles.stage}
        onPointerMove={move}
        role="img"
        aria-label="Surface révélant le tracé du ru sous le curseur"
      >
        {/* couche mouillée (dessous) : le ru lumineux */}
        <svg className={styles.water} viewBox="0 0 1200 430" preserveAspectRatio="xMidYMid slice">
          <path className={styles.contour} d={contour1} />
          <path className={styles.contour} d={contour2} />
          <path className={styles.band} d={ru} />
          <path className={styles.riv} d={ru} />
          {pts.map(([x, y], i) => (
            <circle key={i} className={styles.pt} cx={x} cy={y} r={3.4} />
          ))}
        </svg>

        {/* couche sèche (dessus) : effacée sous le curseur par le masque */}
        <div className={styles.cover}>
          <svg className={styles.drygrid} viewBox="0 0 1200 430" preserveAspectRatio="xMidYMid slice">
            <g stroke="rgba(243,241,234,0.10)" strokeWidth="1" fill="none">
              {Array.from({ length: 13 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={430} />
              ))}
              {Array.from({ length: 5 }).map((_, i) => (
                <line key={`h${i}`} x1={0} y1={i * 100} x2={1200} y2={i * 100} />
              ))}
            </g>
          </svg>
        </div>

        <div className={styles.hintlabel}>Déplacez le curseur : la pluie révèle le tracé</div>
      </div>
    </section>
  );
}
