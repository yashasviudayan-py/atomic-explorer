"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient, physics-flavoured motion layer drawn behind all page content.
 *
 * Two systems share one <canvas>:
 *   1. A parallax field of drifting element symbols (C, O, Au, …) at varied
 *      depth, size, opacity, and rotation, so it reads as a 3D space rather
 *      than a flat sprite sheet. Symbols brighten as the cursor passes near.
 *   2. A quantum-field haze of faint particles that link with short energy
 *      wisps when they drift close together.
 *
 * The whole field parallaxes gently toward the pointer. It is fixed, full
 * viewport, and non-interactive (`pointer-events-none`), sitting above the
 * static app-backdrop but below the hero content.
 *
 * Performance: one requestAnimationFrame loop, DPR-capped canvas, counts scaled
 * to viewport area, and the loop pauses when the tab is hidden. Under
 * `prefers-reduced-motion` it paints a single static frame and never animates.
 */

/** Symbols chosen to read as "the periodic table" at a glance — light gases,
 *  common metals, and a few evocative heavies. */
const SYMBOLS = [
  "H", "He", "C", "N", "O", "Ne", "Na", "Mg", "Al", "Si",
  "P", "S", "Ar", "K", "Ca", "Fe", "Cu", "Zn", "Ag", "Au",
  "Ni", "Ti", "Li", "B", "F", "Cl", "Kr", "Xe", "Pt", "U",
];

interface Sym {
  x: number;
  y: number;
  /** 0 (far) → 1 (near); drives size, opacity, and parallax strength. */
  depth: number;
  size: number;
  baseAlpha: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  text: string;
  /** Eased cursor-proximity brightness, 0 → 1. */
  glow: number;
}

interface Particle {
  x: number;
  y: number;
  depth: number;
  r: number;
  vx: number;
  vy: number;
  hue: "cyan" | "blue" | "violet";
}

const HUES: Record<Particle["hue"], string> = {
  cyan: "100, 210, 255",
  blue: "10, 132, 255",
  violet: "191, 90, 242",
};

export function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let syms: Sym[] = [];
    let particles: Particle[] = [];

    // Pointer, in CSS pixels. Parallax offset eases toward it.
    const pointer = { x: 0, y: 0, has: false };
    const parallax = { x: 0, y: 0 };
    // Scroll offset drives a gentle vertical parallax (deeper = slower).
    let scrollY = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function build() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const mobile = width < 640;
      // Density scaled to area, capped so large monitors stay calm.
      const symCount = Math.min(mobile ? 14 : 30, Math.round(area / 46000));
      const partCount = Math.min(mobile ? 26 : 70, Math.round(area / 17000));

      syms = Array.from({ length: symCount }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          depth,
          // Wider size + opacity spread so depth reads clearly (far = small,
          // soft, faint; near = large, sharp, brighter).
          size: 13 + depth * 60,
          baseAlpha: 0.06 + depth * 0.18,
          // Perceptible slow drift, scaled by depth so near symbols move more.
          vx: rand(-0.2, 0.2) * (0.35 + depth),
          vy: rand(-0.26, -0.06) * (0.35 + depth),
          rot: rand(-0.4, 0.4),
          vrot: rand(-0.0018, 0.0018),
          text: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          glow: 0,
        };
      });

      const hues: Particle["hue"][] = ["cyan", "blue", "violet"];
      particles = Array.from({ length: partCount }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          depth,
          r: 0.6 + depth * 1.6,
          vx: rand(-0.15, 0.15),
          vy: rand(-0.18, 0.05),
          hue: hues[Math.floor(Math.random() * hues.length)],
        };
      });
    }

    function wrap(v: number, max: number, pad: number) {
      if (v < -pad) return max + pad;
      if (v > max + pad) return -pad;
      return v;
    }

    function symPos(s: Sym) {
      return {
        px: s.x + parallax.x * s.depth * 1.4,
        py: s.y + parallax.y * s.depth * 1.4 - scrollY * (0.06 + s.depth * 0.16),
      };
    }

    function drawSym(s: Sym) {
      const { px, py } = symPos(s);
      const alpha = s.baseAlpha + s.glow * 0.72;
      ctx!.save();
      ctx!.translate(px, py);
      ctx!.rotate(s.rot);
      ctx!.font = `600 ${s.size}px "SF Pro Display", system-ui, sans-serif`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      // Depth-of-field: far symbols (low depth) render soft, near ones sharp.
      const blur = (1 - s.depth) * 2.6;
      if (blur > 0.4 && !reduceMotion) ctx!.filter = `blur(${blur.toFixed(1)}px)`;
      // Near the cursor, symbols warm toward the accent blue and pick up a glow.
      if (s.glow > 0.02) {
        ctx!.shadowColor = `rgba(10, 132, 255, ${0.85 * s.glow})`;
        ctx!.shadowBlur = 24 * s.glow;
      }
      // Cool white at rest → shift the blue channel up and red/green down as it
      // brightens toward the accent near the pointer.
      const r = Math.round(214 - s.glow * 150);
      const g = Math.round(224 - s.glow * 70);
      ctx!.fillStyle = `rgba(${r}, ${g}, 255, ${alpha})`;
      ctx!.fillText(s.text, 0, 0);
      ctx!.restore();
    }

    function step(animate: boolean) {
      ctx!.clearRect(0, 0, width, height);

      if (animate) {
        // Ease parallax toward the pointer's offset from centre.
        const tx = pointer.has ? (pointer.x - width / 2) * -0.03 : 0;
        const ty = pointer.has ? (pointer.y - height / 2) * -0.03 : 0;
        parallax.x += (tx - parallax.x) * 0.05;
        parallax.y += (ty - parallax.y) * 0.05;
      }

      // Particles + connecting wisps. Draw links first, under the dots.
      const partY = (p: Particle) =>
        p.y + parallax.y * p.depth - scrollY * (0.04 + p.depth * 0.1);
      ctx!.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const px = p.x + parallax.x * p.depth;
        const py = partY(p);
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const qx = q.x + parallax.x * q.depth;
          const qy = partY(q);
          const dx = px - qx;
          const dy = py - qy;
          const d2 = dx * dx + dy * dy;
          if (d2 < 118 * 118) {
            const a = (1 - Math.sqrt(d2) / 118) * 0.14;
            ctx!.strokeStyle = `rgba(120, 190, 255, ${a})`;
            ctx!.beginPath();
            ctx!.moveTo(px, py);
            ctx!.lineTo(qx, qy);
            ctx!.stroke();
          }
        }
      }
      for (const p of particles) {
        if (animate) {
          p.x = wrap(p.x + p.vx, width, 20);
          p.y = wrap(p.y + p.vy, height, 20);
        }
        const px = p.x + parallax.x * p.depth;
        const py = partY(p);
        const rgb = HUES[p.hue];
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${rgb}, ${0.25 + p.depth * 0.4})`;
        ctx!.shadowColor = `rgba(${rgb}, 0.9)`;
        ctx!.shadowBlur = 6 + p.depth * 8;
        ctx!.arc(px, py, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.shadowBlur = 0;

      // Element symbols on top, back-to-front so nearer ones overlap farther.
      for (const s of syms) {
        if (animate) {
          s.x = wrap(s.x + s.vx, width, s.size);
          s.y = wrap(s.y + s.vy, height, s.size);
          s.rot += s.vrot;
          // Cursor proximity (in screen space, including parallax + scroll).
          let target = 0;
          if (pointer.has) {
            const { px, py } = symPos(s);
            const dist = Math.hypot(px - pointer.x, py - pointer.y);
            if (dist < 140) target = 1 - dist / 140;
          }
          s.glow += (target - s.glow) * 0.08;
        }
        drawSym(s);
      }
    }

    let raf = 0;
    function loop() {
      step(true);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(raf);
      if (reduceMotion) {
        step(false);
        return;
      }
      raf = requestAnimationFrame(loop);
    }

    function onResize() {
      build();
      start();
    }
    function onPointerMove(e: PointerEvent) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.has = true;
    }
    function onScroll() {
      scrollY = window.scrollY;
      // Under reduced motion the loop isn't running, so repaint the still frame
      // at the new offset to keep parallax coherent without animating.
      if (reduceMotion) step(false);
    }
    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduceMotion) start();
    }

    build();
    start();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
