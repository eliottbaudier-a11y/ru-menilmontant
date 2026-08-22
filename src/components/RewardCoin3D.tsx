"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * La plaque-récompense en vraie 3D (Three.js) : un cylindre épais façon plaque
 * d'égout, roundel gravé sur les faces, tranche métallique, éclairage qui donne
 * le volume. Tourne en continu ; grisée/à l'arrêt si `locked`.
 */
export default function RewardCoin3D({ locked = false }: { locked?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lockedRef = useRef(locked);
  lockedRef.current = locked;

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const S = () => Math.max(160, Math.min(parent.clientWidth, parent.clientHeight) || 220);

    // ---- texture des faces : le roundel gravé sur un fond dégradé ----
    function faceTexture() {
      const s = 512;
      const cv = document.createElement("canvas");
      cv.width = cv.height = s;
      const x = cv.getContext("2d")!;
      const C = s / 2;
      const k = s / 100; // repère 0–100 → canvas
      const g = x.createRadialGradient(s * 0.42, s * 0.38, 12, C, C, C);
      g.addColorStop(0, "#3a3d80");
      g.addColorStop(1, "#12143f");
      x.fillStyle = g;
      x.beginPath();
      x.arc(C, C, C, 0, 7);
      x.fill();
      x.strokeStyle = "#63D0DE";
      x.lineWidth = 1.5 * k;
      [46, 40, 12].forEach((r) => {
        x.beginPath();
        x.arc(C, C, r * k, 0, 7);
        x.stroke();
      });
      for (let i = 0; i < 16; i++) {
        const a = (i * 22.5 * Math.PI) / 180;
        x.beginPath();
        x.moveTo(C + 12 * k * Math.cos(a), C + 12 * k * Math.sin(a));
        x.lineTo(C + 40 * k * Math.cos(a), C + 40 * k * Math.sin(a));
        x.stroke();
      }
      // deux vagues « eau » horizontales (début et fin à la même hauteur)
      x.lineCap = "round";
      x.strokeStyle = "#8CEBF5";
      x.lineWidth = 2.6 * k;
      x.beginPath();
      x.moveTo(20 * k, 47 * k);
      x.bezierCurveTo(32 * k, 39 * k, 43 * k, 39 * k, 51 * k, 47 * k);
      x.bezierCurveTo(59 * k, 55 * k, 70 * k, 55 * k, 80 * k, 47 * k);
      x.stroke();
      x.globalAlpha = 0.7;
      x.lineWidth = 1.7 * k;
      x.beginPath();
      x.moveTo(24 * k, 60 * k);
      x.bezierCurveTo(34 * k, 53 * k, 44 * k, 53 * k, 52 * k, 60 * k);
      x.bezierCurveTo(60 * k, 67 * k, 70 * k, 67 * k, 76 * k, 60 * k);
      x.stroke();
      x.globalAlpha = 1;
      const t = new THREE.CanvasTexture(cv);
      t.anisotropy = 8;
      // rotation du dessin de 45° (n'affecte pas le sens de rotation du modèle)
      t.center.set(0.5, 0.5);
      t.rotation = Math.PI / 4;
      return t;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    scene.add(new THREE.AmbientLight(0x8f96d8, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(2.5, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x63d0de, 0.7);
    rim.position.set(-3, -1.5, 1.5);
    scene.add(rim);

    const tex = faceTexture();
    const faceMat = new THREE.MeshStandardMaterial({
      map: tex,
      metalness: 0.35,
      roughness: 0.55,
      emissive: new THREE.Color(0x0b0d2a),
      emissiveMap: tex,
      emissiveIntensity: 0.45,
    });
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x262a68,
      metalness: 0.6,
      roughness: 0.38,
    });

    // cylindre épais = la plaque. Axe Y → on le bascule pour que la face regarde
    // la caméra, puis on le fait tourner sur l'axe vertical (on voit la tranche).
    const geo = new THREE.CylinderGeometry(1, 1, 0.15, 96, 1, false);
    const coin = new THREE.Mesh(geo, [edgeMat, faceMat, faceMat]);
    coin.rotation.x = Math.PI / 2;
    const group = new THREE.Group();
    group.add(coin);
    group.rotation.x = -0.18; // légère plongée pour révéler l'épaisseur
    scene.add(group);

    function resize() {
      const size = S();
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = 0;
    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      const dt = last ? (t - last) / 1000 : 0;
      last = t;
      if (!lockedRef.current) group.rotation.y += dt * 0.9;
      renderer.render(scene, camera);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      geo.dispose();
      faceMat.dispose();
      edgeMat.dispose();
      tex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        filter: locked ? "grayscale(0.7) brightness(0.7)" : "none",
      }}
      aria-label="Plaque récompense en 3D"
    />
  );
}
