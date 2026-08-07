"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./Map3D.module.css";

const ROM = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const LBL = [
  "Ménilmontant",
  "Saint-Martin",
  "Le Marais",
  "Grands Boulevards",
  "Opéra",
  "Bd Haussmann",
  "Saint-Lazare",
  "Alma",
];
const COORD: [string, string][] = [
  ["48.8677", "2.3860"],
  ["48.8664", "2.3689"],
  ["48.8680", "2.3534"],
  ["48.8710", "2.3469"],
  ["48.8731", "2.3328"],
  ["48.8741", "2.3272"],
  ["48.8759", "2.3295"],
  ["48.8675", "2.3071"],
];

/**
 * Spatialisation du ru façon Terra Forma (relief en volume, sol en coupe,
 * cours d'eau enfoui). Portage vanilla three.js de la maquette carte-3D.
 * Glisser pour tourner, survol d'une plaque pour la situer.
 */
export default function Map3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const tip = tipRef.current;
    if (!canvas || !container || !tip) return;
    const tipEl: HTMLDivElement = tip;

    const W = () => container.clientWidth;
    const H = () => container.clientHeight;

    const frac = (x: number) => x - Math.floor(x);
    const hash = (x: number, y: number) => frac(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);
    const smooth = (k: number) => {
      k = Math.max(0, Math.min(1, k));
      return k * k * (3 - 2 * k);
    };

    const N = 16,
      CELL = 6.2,
      HALF = (N - 1) / 2,
      BASEY = -7,
      WLEVEL = 0.7;
    const RUCELL: [number, number][] = [
      [14, 2],
      [12, 4],
      [11, 7],
      [9, 7],
      [8, 8],
      [6, 9],
      [4, 10],
      [1, 12],
    ];
    const RIVERGY = 13.4;
    const w = (gx: number, gy: number) => ({ x: (gx - HALF) * CELL, z: (gy - HALF) * CELL });
    function distRuPath(px: number, py: number) {
      let best = 1e9,
        nx = 0,
        ny = 0;
      for (let i = 0; i < RUCELL.length - 1; i++) {
        const ax = RUCELL[i][0],
          ay = RUCELL[i][1],
          bx = RUCELL[i + 1][0],
          by = RUCELL[i + 1][1];
        const dx = bx - ax,
          dy = by - ay,
          t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
        const qx = ax + t * dx,
          qy = ay + t * dy,
          d = Math.hypot(px - qx, py - qy);
        if (d < best) {
          best = d;
          nx = px - qx;
          ny = py - qy;
        }
      }
      return { d: best, nx, ny };
    }
    function terr(gx: number, gy: number) {
      const slope = 1 - gy / (N - 1);
      let h = 2 + slope * 5.5;
      h += 6 * Math.exp(-((gx - 14) ** 2 + (gy - 2) ** 2) / 18);
      h += 2.4 * Math.exp(-((gx - 4) ** 2 + (gy - 5) ** 2) / 30);
      h += (hash(gx, gy) - 0.5) * 1.1;
      const dr = Math.abs(gy - RIVERGY),
        band = 4.2;
      if (dr < band) {
        const kk = smooth(1 - dr / band);
        h = h * (1 - kk);
      }
      return Math.max(0, h);
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1b1d70);
    scene.fog = new THREE.Fog(0x1b1d70, 220, 520);
    const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 900);
    scene.add(new THREE.AmbientLight(0x9a9aff, 0.82));
    const dir = new THREE.DirectionalLight(0xffffff, 0.55);
    dir.position.set(50, 90, 30);
    scene.add(dir);
    const dir2 = new THREE.DirectionalLight(0x8ad4ff, 0.25);
    dir2.position.set(-40, 40, -20);
    scene.add(dir2);
    const city = new THREE.Group();
    scene.add(city);

    // surface du relief
    {
      const pos: number[] = [],
        col: number[] = [],
        idxArr: number[] = [];
      const lo = [0.13, 0.14, 0.44],
        hi = [0.24, 0.25, 0.64];
      for (let gy = 0; gy < N; gy++)
        for (let gx = 0; gx < N; gx++) {
          const p = w(gx, gy),
            e = terr(gx, gy);
          pos.push(p.x, e, p.z);
          const t = Math.min(1, e / 9);
          col.push(
            lo[0] + (hi[0] - lo[0]) * t,
            lo[1] + (hi[1] - lo[1]) * t,
            lo[2] + (hi[2] - lo[2]) * t,
          );
        }
      for (let gy = 0; gy < N - 1; gy++)
        for (let gx = 0; gx < N - 1; gx++) {
          const a = gy * N + gx,
            b = a + 1,
            c = a + N,
            d = c + 1;
          idxArr.push(a, c, b, b, c, d);
        }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
      g.setIndex(idxArr);
      g.computeVertexNormals();
      city.add(
        new THREE.Mesh(
          g,
          new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 1, metalness: 0 }),
        ),
      );
      city.add(
        new THREE.LineSegments(
          new THREE.WireframeGeometry(g),
          new THREE.LineBasicMaterial({ color: 0xededff, transparent: true, opacity: 0.1 }),
        ),
      );
    }

    // parois + fond + strates
    {
      const pos: number[] = [],
        idxArr: number[] = [];
      const edge = (list: [number, number][]) => {
        for (let i = 0; i < list.length - 1; i++) {
          const [ax, ay] = list[i],
            [bx, by] = list[i + 1];
          const A = w(ax, ay),
            B = w(bx, by);
          const s = pos.length / 3;
          pos.push(A.x, terr(ax, ay), A.z, B.x, terr(bx, by), B.z, B.x, BASEY, B.z, A.x, BASEY, A.z);
          idxArr.push(s, s + 1, s + 2, s, s + 2, s + 3);
        }
      };
      const top: [number, number][] = [],
        bot: [number, number][] = [],
        left: [number, number][] = [],
        right: [number, number][] = [];
      for (let gx = 0; gx < N; gx++) {
        top.push([gx, 0]);
        bot.push([gx, N - 1]);
      }
      for (let gy = 0; gy < N; gy++) {
        left.push([0, gy]);
        right.push([N - 1, gy]);
      }
      edge(top);
      edge(bot);
      edge(left);
      edge(right);
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idxArr);
      g.computeVertexNormals();
      city.add(
        new THREE.Mesh(
          g,
          new THREE.MeshStandardMaterial({ color: 0x161952, roughness: 1, metalness: 0, side: THREE.DoubleSide, flatShading: true }),
        ),
      );
      for (const yy of [-1.5, -3.5, -5.5]) {
        const ring = [...top, ...right.slice(1), ...bot.slice().reverse().slice(1), ...left.slice().reverse().slice(1)];
        const lp = ring.map(([gx, gy]) => {
          const P = w(gx, gy);
          return new THREE.Vector3(P.x, yy, P.z);
        });
        const lg = new THREE.BufferGeometry().setFromPoints(lp);
        city.add(new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0xededff, transparent: true, opacity: 0.08 })));
      }
      const capW = (N - 1) * CELL + CELL;
      const cap = new THREE.Mesh(new THREE.PlaneGeometry(capW, capW), new THREE.MeshBasicMaterial({ color: 0x11143f, side: THREE.DoubleSide }));
      cap.rotation.x = -Math.PI / 2;
      cap.position.y = BASEY;
      city.add(cap);
    }

    // la Seine
    {
      const LAND = (N - 1) * CELL,
        Wd = 20,
        zc = LAND / 2 - Wd / 2;
      const water = new THREE.Mesh(
        new THREE.PlaneGeometry(LAND, Wd),
        new THREE.MeshStandardMaterial({ color: 0x2f6fb4, roughness: 0.3, metalness: 0.3 }),
      );
      water.rotation.x = -Math.PI / 2;
      water.position.set(0, WLEVEL, zc);
      city.add(water);
      const sheen = new THREE.Mesh(
        new THREE.PlaneGeometry(LAND, 2.2),
        new THREE.MeshBasicMaterial({ color: 0x9fdcff, transparent: true, opacity: 0.35 }),
      );
      sheen.rotation.x = -Math.PI / 2;
      sheen.position.set(0, WLEVEL + 0.05, (RIVERGY - HALF) * CELL);
      city.add(sheen);
    }

    // bâtiments
    {
      const edgeMat = new THREE.LineBasicMaterial({ color: 0xededff, transparent: true, opacity: 0.4 });
      const faceMat = new THREE.MeshStandardMaterial({ color: 0x2a2aa2, metalness: 0, roughness: 0.95, flatShading: true });
      for (let gx = 1; gx < N - 1; gx++)
        for (let gy = 1; gy < N - 1; gy++) {
          if (Math.abs(gy - RIVERGY) < 2.4) continue;
          const rp = distRuPath(gx, gy);
          if (rp.d < 0.85) continue;
          if (hash(gx * 1.3, gy * 1.9) < 0.42) continue;
          let ox = 0,
            oz = 0;
          if (rp.d < 1.7) {
            const Ln = Math.hypot(rp.nx, rp.ny) || 1,
              push = (1.7 - rp.d) * CELL * 0.45;
            ox = (rp.nx / Ln) * push;
            oz = (rp.ny / Ln) * push;
          }
          const base = terr(gx, gy),
            h = 3 + hash(gx, gy) * 7.5,
            bw = CELL * 0.66;
          const box = new THREE.BoxGeometry(bw, h, bw),
            p = w(gx, gy);
          const m = new THREE.Mesh(box, faceMat);
          m.position.set(p.x + ox, base + h / 2, p.z + oz);
          city.add(m);
          const eg = new THREE.LineSegments(new THREE.EdgesGeometry(box), edgeMat);
          eg.position.copy(m.position);
          city.add(eg);
        }
    }

    // le ru
    const ruPts = RUCELL.map(([gx, gy]) => {
      const p = w(gx, gy);
      return new THREE.Vector3(p.x, terr(gx, gy) + 0.8, p.z);
    });
    const ruCurve = new THREE.CatmullRomCurve3(ruPts, false, "catmullrom", 0.5);
    city.add(new THREE.Mesh(new THREE.TubeGeometry(ruCurve, 140, 1.0, 8, false), new THREE.MeshBasicMaterial({ color: 0x63d0de, transparent: true, opacity: 0.16 })));
    city.add(new THREE.Mesh(new THREE.TubeGeometry(ruCurve, 140, 0.42, 8, false), new THREE.MeshBasicMaterial({ color: 0x9ceff8 })));
    const puise = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), new THREE.MeshBasicMaterial({ color: 0xeaffff }));
    city.add(puise);

    // labels flottants
    function textSprite(txt: string, size: number, color: string, sx: number) {
      const cv = document.createElement("canvas");
      cv.width = 512;
      cv.height = 128;
      const x = cv.getContext("2d")!;
      x.fillStyle = color;
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.font = "italic " + size + "px Spectral, serif";
      x.fillText(txt, 256, 70);
      const t = new THREE.CanvasTexture(cv);
      t.anisotropy = 4;
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false }));
      s.scale.set(sx, sx / 4, 1);
      return s;
    }
    {
      const s = textSprite("LA SEINE", 60, "rgba(205,232,255,0.92)", 30);
      s.position.set(-16, 3, (RIVERGY - HALF) * CELL);
      city.add(s);
    }
    {
      const p = w(14, 2),
        s = textSprite("MÉNILMONTANT · source", 42, "rgba(237,237,255,0.85)", 30);
      s.position.set(p.x, terr(14, 2) + 7, p.z);
      city.add(s);
    }
    {
      const p = w(1, 12),
        s = textSprite("ALMA · embouchure", 42, "rgba(237,237,255,0.85)", 26);
      s.position.set(p.x, terr(1, 12) + 7, p.z);
      city.add(s);
    }

    // plaques
    function discTexture(rom: string, hot: boolean) {
      const s = 256,
        cv = document.createElement("canvas");
      cv.width = cv.height = s;
      const x = cv.getContext("2d")!;
      x.beginPath();
      x.arc(s / 2, s / 2, 92, 0, 7);
      x.fillStyle = hot ? "#173a63" : "#12143f";
      x.fill();
      x.lineWidth = 10;
      x.strokeStyle = hot ? "#BFF6FF" : "#63D0DE";
      x.stroke();
      if (hot) {
        x.beginPath();
        x.arc(s / 2, s / 2, 112, 0, 7);
        x.lineWidth = 5;
        x.strokeStyle = "rgba(127,231,242,.55)";
        x.stroke();
      }
      x.fillStyle = "#EDEDFF";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.font = "600 " + (rom.length > 2 ? 74 : 96) + "px Spectral, serif";
      x.fillText(rom, s / 2, s / 2 + 6);
      const t = new THREE.CanvasTexture(cv);
      t.anisotropy = 4;
      return t;
    }
    type Plot = {
      spr: THREE.Sprite;
      halo: THREE.Mesh;
      texN: THREE.Texture;
      texH: THREE.Texture;
      hit: THREE.Mesh;
      pos: THREE.Vector3;
      i: number;
    };
    const plots: Plot[] = [];
    // hitbox élargie sur écran tactile (carte dézoomée → plaques petites) :
    // en glissant le doigt au niveau d'une plaque, le survol se déclenche.
    const coarsePointer =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    const HIT_R = coarsePointer ? 8 : 4.4;
    ruPts.forEach((pos, i) => {
      const g = new THREE.Group();
      g.position.copy(pos);
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 9, 8),
        new THREE.MeshBasicMaterial({ color: 0x63d0de, transparent: true, opacity: 0.3 }),
      );
      beam.position.y = 4.5;
      g.add(beam);
      const texN = discTexture(ROM[i], false),
        texH = discTexture(ROM[i], true);
      const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: texN, transparent: true, depthTest: false }));
      spr.position.y = 11;
      spr.scale.set(6.6, 6.6, 1);
      g.add(spr);
      const halo = new THREE.Mesh(new THREE.CircleGeometry(2.2, 24), new THREE.MeshBasicMaterial({ color: 0x63d0de, transparent: true, opacity: 0.22 }));
      halo.rotation.x = -Math.PI / 2;
      halo.position.y = 0.06;
      g.add(halo);
      const hit = new THREE.Mesh(new THREE.SphereGeometry(HIT_R, 10, 10), new THREE.MeshBasicMaterial({ visible: false }));
      hit.position.y = 11;
      g.add(hit);
      city.add(g);
      plots.push({ spr, halo, texN, texH, hit, pos: pos.clone(), i });
    });

    // caméra orbit
    const target = new THREE.Vector3(0, 4, 0);
    let theta = 0.85,
      phi = 0.66;
    // distance recalculée selon le format : sur mobile (portrait) on recule
    // pour que TOUTE la carte tienne à l'écran d'un coup.
    let R = 165;
    function fitDistance() {
      const aspect = W() / H();
      const vFov = (camera.fov * Math.PI) / 180;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
      const halfExtent = 56; // demi-emprise du terrain + marge (unités monde)
      const dV = halfExtent / Math.tan(vFov / 2);
      const dH = halfExtent / Math.tan(hFov / 2);
      R = Math.min(430, Math.max(150, Math.max(dV, dH)));
    }
    let autoRot = true;
    let dragging = false,
      lastX = 0,
      lastY = 0;
    const mouse = new THREE.Vector2(-9, -9);
    const place = () => {
      camera.position.set(
        target.x + R * Math.sin(phi) * Math.cos(theta),
        target.y + R * Math.cos(phi),
        target.z + R * Math.sin(phi) * Math.sin(theta),
      );
      camera.lookAt(target);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      autoRot = false;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => (dragging = false);
    const onMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      if (dragging) {
        theta -= (e.clientX - lastX) * 0.006;
        phi = Math.max(0.18, Math.min(1.32, phi - (e.clientY - lastY) * 0.005));
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    // bloque le menu contextuel / la sélection au maintien (mobile)
    const onCtx = (e: Event) => e.preventDefault();
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("contextmenu", onCtx);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);

    const ray = new THREE.Raycaster();
    let hov = -1;

    // double-clic sur une plaque survolée → copie ses coordonnées géographiques
    let copyTO: ReturnType<typeof setTimeout> | undefined;
    function fallbackCopy(t: string) {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignoré */
      }
      document.body.removeChild(ta);
    }
    function copyText(t: string) {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(t).catch(() => fallbackCopy(t));
      } else {
        fallbackCopy(t);
      }
    }
    const onDblClick = () => {
      if (hov < 0) return;
      copyText(`${COORD[hov][0]}, ${COORD[hov][1]}`);
      const co = tipEl.querySelector(".co") as HTMLElement;
      const cur = hov;
      co.textContent = "coordonnées copiées ✓";
      clearTimeout(copyTO);
      copyTO = setTimeout(() => {
        if (hov === cur) co.textContent = `${COORD[cur][0]} N · ${COORD[cur][1]} E`;
      }, 1400);
    };
    canvas.addEventListener("dblclick", onDblClick);

    function updateHover() {
      ray.setFromCamera(mouse, camera);
      const hits = ray.intersectObjects(plots.map((p) => p.hit), false);
      const i = hits.length ? plots.findIndex((p) => p.hit === hits[0].object) : -1;
      if (i !== hov) {
        if (hov >= 0) {
          plots[hov].spr.material.map = plots[hov].texN;
          plots[hov].spr.material.needsUpdate = true;
        }
        hov = i;
        if (hov >= 0) {
          plots[hov].spr.material.map = plots[hov].texH;
          plots[hov].spr.material.needsUpdate = true;
          (tipEl.querySelector(".r") as HTMLElement).textContent = "Plaque " + ROM[hov];
          (tipEl.querySelector(".l") as HTMLElement).textContent = LBL[hov];
          (tipEl.querySelector(".co") as HTMLElement).textContent = COORD[hov][0] + " N · " + COORD[hov][1] + " E";
          tipEl.style.opacity = "1";
        } else {
          tipEl.style.opacity = "0";
        }
      }
      if (hov >= 0) {
        const v = plots[hov].pos.clone();
        v.project(camera);
        tipEl.style.left = (v.x * 0.5 + 0.5) * W() + "px";
        tipEl.style.top = (-v.y * 0.5 + 0.5) * H() - 70 + "px";
      }
    }

    let raf = 0;
    function loop(t: number) {
      raf = requestAnimationFrame(loop);
      if (autoRot) theta += 0.0016;
      place();
      const s = 1 + 0.06 * Math.sin(t * 0.004);
      plots.forEach((p, k) => {
        const sc = (k === hov ? 8.1 : 6.6) * s;
        p.spr.scale.set(sc, sc, 1);
        (p.halo.material as THREE.MeshBasicMaterial).opacity = 0.16 + 0.12 * Math.sin(t * 0.004 + k);
      });
      puise.position.copy(ruCurve.getPointAt((t * 0.00007) % 1));
      updateHover();
      renderer.render(scene, camera);
    }
    function resize() {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H(), false);
      fitDistance();
    }
    window.addEventListener("resize", resize);
    resize();
    place();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("dblclick", onDblClick);
      canvas.removeEventListener("contextmenu", onCtx);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      clearTimeout(copyTO);
      renderer.dispose();
    };
  }, []);

  return (
    <div className={styles.stage}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.ui}>
        <div className={styles.k}>Ru de Ménilmontant</div>
        <h1>Spatialisation du RU.</h1>
        <p>Des hauteurs de Ménilmontant jusqu&apos;à la Seine — le relief et le cours d&apos;eau enfoui.</p>
      </div>
      <div className={styles.badge}>carte 3D</div>
      <div className={styles.hint}>
        <b>Glissez</b> pour tourner · <b>survolez</b> une plaque · <b>double-clic</b> pour copier ses coordonnées
      </div>
      <div ref={tipRef} className={styles.tip}>
        <div className="r" />
        <div className="l" />
        <div className="co" />
      </div>
    </div>
  );
}
