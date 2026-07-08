/**
 * Hero atom — a lightweight, static scientific illustration.
 *
 * Deliberately not a canvas or 3D scene: it's a single inline SVG with crisp
 * orbit rings, a small packed nucleus, and static electron dots. There is no
 * requestAnimationFrame loop and no per-frame work, so it costs nothing to
 * scroll past on a phone. The only motion is a slow opacity/scale breath on the
 * nucleus halo, enabled through CSS on desktop pointers only (see
 * `.atom-preview-glow` in globals.css); mobile and reduced-motion hold it still.
 *
 * The full interactive 3D atom lives on each element page — this is the
 * restrained portrait that invites you there.
 */

const RING = "rgba(100, 210, 255, 0.28)";
const RING_FAINT = "rgba(100, 210, 255, 0.16)";

/** Elliptical orbit tilts (degrees) giving the flat SVG a sense of depth. */
const RINGS = [
  { rx: 132, ry: 52, rotate: 0, stroke: RING },
  { rx: 132, ry: 52, rotate: 60, stroke: RING_FAINT },
  { rx: 132, ry: 52, rotate: -60, stroke: RING_FAINT },
];

/** Static electron dots, placed on the outer edge of a ring at a fixed angle. */
const ELECTRONS = [
  { ringRotate: 0, angle: 0 },
  { ringRotate: 60, angle: 150 },
  { ringRotate: -60, angle: 210 },
  { ringRotate: 0, angle: 180 },
];

/** Small nucleons packed near the centre (proton = warm, neutron = cool). */
const NUCLEONS = [
  { x: -9, y: -5, kind: "p" as const },
  { x: 8, y: -8, kind: "n" as const },
  { x: 11, y: 6, kind: "p" as const },
  { x: -6, y: 9, kind: "n" as const },
  { x: 0, y: -1, kind: "p" as const },
  { x: -14, y: 3, kind: "n" as const },
  { x: 15, y: -2, kind: "n" as const },
];

const PROTON = "#ff5f7e";
const NEUTRON = "#5ac8fa";

/** Point on the outer edge of a ring (rx,ry ellipse) rotated by `ringRotate`. */
function electronPoint(ringRotate: number, angle: number) {
  const { rx, ry } = RINGS[0];
  const a = (angle * Math.PI) / 180;
  const ex = Math.cos(a) * rx;
  const ey = Math.sin(a) * ry;
  const r = (ringRotate * Math.PI) / 180;
  return {
    x: 160 + ex * Math.cos(r) - ey * Math.sin(r),
    y: 160 + ex * Math.sin(r) + ey * Math.cos(r),
  };
}

export function AtomPreview() {
  return (
    <div className="relative aspect-square w-full max-w-[26rem] select-none">
      <svg
        viewBox="0 0 320 320"
        role="img"
        aria-label="Illustration of an atom with orbiting electrons around a nucleus"
        className="h-full w-full"
      >
        {/* Soft nucleus halo — the only animated element, desktop-only. */}
        <circle
          className="atom-preview-glow"
          cx="160"
          cy="160"
          r="42"
          fill="url(#nucleusGlow)"
        />

        {/* Orbit rings */}
        {RINGS.map((ring, i) => (
          <ellipse
            key={i}
            cx="160"
            cy="160"
            rx={ring.rx}
            ry={ring.ry}
            fill="none"
            stroke={ring.stroke}
            strokeWidth="1"
            transform={`rotate(${ring.rotate} 160 160)`}
          />
        ))}

        {/* Nucleus */}
        {NUCLEONS.map((n, i) => (
          <circle
            key={i}
            cx={160 + n.x}
            cy={160 + n.y}
            r="6.5"
            fill={n.kind === "p" ? PROTON : NEUTRON}
            opacity="0.92"
          />
        ))}

        {/* Static electron dots */}
        {ELECTRONS.map((e, i) => {
          const p = electronPoint(e.ringRotate, e.angle);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="7" fill="#64d2ff" opacity="0.18" />
              <circle cx={p.x} cy={p.y} r="3.4" fill="#eaf6ff" />
            </g>
          );
        })}

        <defs>
          <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(41,151,255,0.5)" />
            <stop offset="55%" stopColor="rgba(41,151,255,0.12)" />
            <stop offset="100%" stopColor="rgba(41,151,255,0)" />
          </radialGradient>
        </defs>
      </svg>

      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.7rem] font-medium tracking-wide text-muted">
        Open any element for the full 3D atom
      </span>
    </div>
  );
}
