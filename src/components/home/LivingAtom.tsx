"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's living atom — the visual centrepiece.
 *
 * Precise and luminous, like a scientific render rather than a lens flare:
 * a tightly clustered nucleus of shaded protons and neutrons (subtle jitter +
 * a slow breathing pulse), four crisp elliptical electron shells at varied
 * inclinations, and electrons drawn as small bright points with short
 * motion-blur trails. Structure is drawn with normal compositing; additive
 * "lighter" glow is reserved for small, localised accents (electron cores, an
 * occasional flare, a restrained nucleus halo) so the bloom accents the atom
 * instead of erasing it.
 *
 * The system tilts toward the pointer and drifts on scroll. One rAF loop,
 * DPR-capped, z-sorted so electrons pass in front of and behind the nucleus.
 * Scales down on small screens and paints one still frame under
 * `prefers-reduced-motion`.
 */

type Vec3 = { x: number; y: number; z: number };

interface Orbit {
  radius: number;
  incX: number;
  incZ: number;
  speed: number;
  color: string;
  glow: string;
  electrons: Electron[];
}

interface Electron {
  phase: number;
  flareIn: number;
  flare: number;
  trail: Vec3[];
}

interface Nucleon {
  base: Vec3;
  kind: "proton" | "neutron";
  seed: number;
}

const TAU = Math.PI * 2;

function rotX(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}
function rotY(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}
function rotZ(p: Vec3, a: number): Vec3 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z };
}

export function LivingAtom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let size = 0;
    let dpr = 1;
    let mobile = false;
    let R = 0;
    let focal = 0;
    let orbits: Orbit[] = [];
    let nucleons: Nucleon[] = [];

    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
    let spin = 0;
    let t = 0;

    function build() {
      const rect = canvas!.getBoundingClientRect();
      size = rect.width;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      mobile = size < 380;
      canvas!.width = Math.round(size * dpr);
      canvas!.height = Math.round(size * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Kept comfortably inside the square so shells never clip the edge.
      R = size * 0.26;
      focal = R * 4.2;

      const trailLen = mobile ? 7 : 12;
      const shells = [
        { r: 0.52, incX: 1.4, incZ: 0.1, speed: 0.03, n: 1, color: "120, 215, 255", glow: "200, 240, 255" },
        { r: 0.74, incX: 1.1, incZ: 1.15, speed: -0.022, n: 2, color: "40, 150, 255", glow: "150, 205, 255" },
        { r: 0.96, incX: 1.5, incZ: -0.7, speed: 0.016, n: 2, color: "170, 120, 255", glow: "215, 180, 255" },
        { r: 1.15, incX: 0.85, incZ: 0.55, speed: -0.012, n: mobile ? 1 : 2, color: "100, 210, 255", glow: "190, 235, 255" },
      ];

      orbits = shells.map((s) => ({
        radius: s.r * R,
        incX: s.incX,
        incZ: s.incZ,
        speed: s.speed,
        color: s.color,
        glow: s.glow,
        electrons: Array.from({ length: s.n }, (_, i) => ({
          phase: (i / s.n) * TAU + Math.random() * 1.2,
          flareIn: 120 + Math.floor(Math.random() * 320),
          flare: 0,
          trail: Array.from({ length: trailLen }, () => ({ x: 0, y: 0, z: 0 })),
        })),
      }));

      // Nucleus: a tight ball of protons + neutrons via a jittered golden
      // spiral, packed close enough to cluster but loose enough to stay legible.
      const count = mobile ? 12 : 16;
      const nr = R * 0.16;
      nucleons = Array.from({ length: count }, (_, i) => {
        const y = 1 - (i / (count - 1)) * 2;
        const rad = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = i * 2.399963;
        const spread = 0.72 + Math.random() * 0.28;
        return {
          base: {
            x: Math.cos(theta) * rad * nr * spread,
            y: y * nr * spread,
            z: Math.sin(theta) * rad * nr * spread,
          },
          kind: i % 2 === 0 ? "proton" : "neutron",
          seed: Math.random() * TAU,
        };
      });
    }

    function orient(p: Vec3, o: Orbit): Vec3 {
      let q = rotX(p, o.incX);
      q = rotZ(q, o.incZ);
      q = rotY(q, spin + tilt.x);
      q = rotX(q, tilt.y);
      return q;
    }
    function globalOrient(p: Vec3): Vec3 {
      return rotX(rotY(p, spin + tilt.x), tilt.y);
    }
    function project(p: Vec3) {
      const f = focal / (focal - p.z);
      return { sx: size / 2 + p.x * f, sy: size / 2 + p.y * f, scale: f, z: p.z };
    }

    function drawOrbitRing(o: Orbit) {
      const steps = 96;
      // A faint outer glow stroke, then a crisp hairline on top.
      for (const pass of [0, 1] as const) {
        ctx!.beginPath();
        for (let k = 0; k <= steps; k++) {
          const a = (k / steps) * TAU;
          const p = orient(
            { x: Math.cos(a) * o.radius, y: Math.sin(a) * o.radius, z: 0 },
            o,
          );
          const pr = project(p);
          if (k === 0) ctx!.moveTo(pr.sx, pr.sy);
          else ctx!.lineTo(pr.sx, pr.sy);
        }
        if (pass === 0) {
          ctx!.strokeStyle = `rgba(${o.color}, 0.10)`;
          ctx!.lineWidth = 3;
        } else {
          ctx!.strokeStyle = `rgba(${o.color}, 0.42)`;
          ctx!.lineWidth = 1;
        }
        ctx!.stroke();
      }
    }

    function drawNucleus(breath: number) {
      const cx = size / 2;
      const cy = size / 2;

      // Restrained halo — a small, soft bloom, not a screen-wide wash.
      const halo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R * 0.42 * breath);
      halo.addColorStop(0, "rgba(150, 200, 255, 0.30)");
      halo.addColorStop(0.55, "rgba(90, 140, 255, 0.10)");
      halo.addColorStop(1, "rgba(90, 140, 255, 0)");
      ctx!.fillStyle = halo;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R * 0.42 * breath, 0, TAU);
      ctx!.fill();

      const rendered = nucleons
        .map((nuc) => {
          const jx = reduceMotion ? 0 : Math.sin(t * 0.06 + nuc.seed) * R * 0.012;
          const jy = reduceMotion ? 0 : Math.cos(t * 0.05 + nuc.seed * 1.7) * R * 0.012;
          const p = globalOrient({
            x: (nuc.base.x + jx) * breath,
            y: (nuc.base.y + jy) * breath,
            z: nuc.base.z * breath,
          });
          return { pr: project(p), nuc };
        })
        .sort((a, b) => a.pr.z - b.pr.z);

      for (const { pr, nuc } of rendered) {
        const rad = R * 0.088 * pr.scale;
        // Shaded sphere: off-centre highlight → mid tone → dark rim, so each
        // nucleon reads as a distinct ball rather than a merged glow.
        const g = ctx!.createRadialGradient(
          pr.sx - rad * 0.35,
          pr.sy - rad * 0.35,
          rad * 0.1,
          pr.sx,
          pr.sy,
          rad,
        );
        if (nuc.kind === "proton") {
          g.addColorStop(0, "rgba(255, 190, 195, 1)");
          g.addColorStop(0.45, "rgba(240, 80, 105, 1)");
          g.addColorStop(1, "rgba(150, 30, 55, 1)");
        } else {
          g.addColorStop(0, "rgba(225, 238, 255, 1)");
          g.addColorStop(0.45, "rgba(140, 165, 200, 1)");
          g.addColorStop(1, "rgba(70, 90, 120, 1)");
        }
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(pr.sx, pr.sy, rad, 0, TAU);
        ctx!.fill();
        // Thin dark rim for separation between adjacent nucleons.
        ctx!.strokeStyle = "rgba(0, 0, 0, 0.35)";
        ctx!.lineWidth = 0.6;
        ctx!.stroke();
      }
    }

    interface ER {
      sx: number;
      sy: number;
      scale: number;
      z: number;
      color: string;
      glow: string;
      flare: number;
      trail: { sx: number; sy: number }[];
    }

    function computeElectron(o: Orbit, e: Electron): ER {
      const p = orient(
        { x: Math.cos(e.phase) * o.radius, y: Math.sin(e.phase) * o.radius, z: 0 },
        o,
      );
      const pr = project(p);
      const trail = e.trail.map((tp) => {
        const q = project(tp);
        return { sx: q.sx, sy: q.sy };
      });
      return { sx: pr.sx, sy: pr.sy, scale: pr.scale, z: pr.z, color: o.color, glow: o.glow, flare: e.flare, trail };
    }

    function drawElectron(er: ER) {
      // Short motion-blur trail: thin, fading wisp in the shell colour.
      ctx!.lineCap = "round";
      for (let i = 1; i < er.trail.length; i++) {
        const a = (i / er.trail.length) * 0.28;
        ctx!.strokeStyle = `rgba(${er.color}, ${a})`;
        ctx!.lineWidth = R * 0.03 * (i / er.trail.length) + 0.4;
        ctx!.beginPath();
        ctx!.moveTo(er.trail[i - 1].sx, er.trail[i - 1].sy);
        ctx!.lineTo(er.trail[i].sx, er.trail[i].sy);
        ctx!.stroke();
      }

      const core = R * 0.05 * er.scale;
      // Compact additive glow, sized to the electron — not a flare.
      ctx!.globalCompositeOperation = "lighter";
      const gr = core * (1.8 + er.flare * 2.2);
      const g = ctx!.createRadialGradient(er.sx, er.sy, 0, er.sx, er.sy, gr);
      g.addColorStop(0, `rgba(${er.glow}, ${0.7 + er.flare * 0.3})`);
      g.addColorStop(0.5, `rgba(${er.color}, ${0.35 + er.flare * 0.3})`);
      g.addColorStop(1, `rgba(${er.color}, 0)`);
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(er.sx, er.sy, gr, 0, TAU);
      ctx!.fill();
      ctx!.globalCompositeOperation = "source-over";

      // Crisp bright core so it reads as a discrete point.
      ctx!.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx!.beginPath();
      ctx!.arc(er.sx, er.sy, core * 0.62, 0, TAU);
      ctx!.fill();
    }

    function frame(animate: boolean) {
      ctx!.clearRect(0, 0, size, size);

      if (animate) {
        tilt.x += (tilt.tx - tilt.x) * 0.06;
        tilt.y += (tilt.ty - tilt.y) * 0.06;
        spin += 0.0015;
        t += 1;
      }

      // Split shells so back rings/electrons render behind the nucleus.
      const back: ER[] = [];
      const front: ER[] = [];
      for (const o of orbits) {
        for (const e of o.electrons) {
          if (animate) {
            e.phase += o.speed;
            const p = orient(
              { x: Math.cos(e.phase) * o.radius, y: Math.sin(e.phase) * o.radius, z: 0 },
              o,
            );
            e.trail.push({ x: p.x, y: p.y, z: p.z });
            e.trail.shift();
            e.flareIn -= 1;
            if (e.flareIn <= 0) {
              e.flare = 1;
              e.flareIn = 260 + Math.floor(Math.random() * 380);
            }
            e.flare *= 0.93;
          }
          const er = computeElectron(o, e);
          (er.z < 0 ? back : front).push(er);
        }
      }

      // Rings first (structure), then depth-sorted electrons around nucleus.
      for (const o of orbits) drawOrbitRing(o);
      for (const er of back) drawElectron(er);
      const breath = reduceMotion ? 1 : 1 + Math.sin(t * 0.03) * 0.035;
      drawNucleus(breath);
      for (const er of front) drawElectron(er);
    }

    let raf = 0;
    function loop() {
      frame(true);
      raf = requestAnimationFrame(loop);
    }
    function start() {
      cancelAnimationFrame(raf);
      if (reduceMotion) {
        frame(false);
        return;
      }
      raf = requestAnimationFrame(loop);
    }

    function onPointerMove(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      tilt.tx = nx * 0.4;
      tilt.ty = ny * 0.28;
    }

    // Gentle scroll parallax: the atom drifts up slower than the page.
    let scrollRaf = 0;
    function onScroll() {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        if (!reduceMotion) {
          wrap!.style.transform = `translateY(${window.scrollY * -0.06}px)`;
        }
      });
    }
    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduceMotion) start();
    }

    const ro = new ResizeObserver(() => {
      build();
      start();
    });
    ro.observe(canvas);

    build();
    start();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scrollRaf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative aspect-square w-full max-w-[28rem] select-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 47%, rgba(10,132,255,0.14), rgba(191,90,242,0.05) 46%, transparent 68%)",
          filter: "blur(24px)",
        }}
      />
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.7rem] font-medium tracking-wide text-muted backdrop-blur">
        Open any element for the full 3D atom
      </span>
    </div>
  );
}
