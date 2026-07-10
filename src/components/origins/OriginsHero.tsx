import Link from "next/link";
import { ChevronRight } from "@/components/ui/Icon";

/**
 * Opening statement of the origins story.
 *
 * The hero image is the argument in one picture: a single arc sweeping from the
 * Big Bang to the present, with the six element-forging channels marked as
 * nodes along it, each in its own accent. It is a static SVG over one radial
 * bloom — no canvas, no animation loop, no particle field.
 */
export function OriginsHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="origin-hero-glow origin-stars pointer-events-none absolute inset-0 -z-10"
      />

      <div className="page-shell relative py-16 text-center sm:py-24 lg:py-28">
        <span className="hero-eyebrow inline-block text-xs font-semibold uppercase">
          The Cosmic Origin of Elements
        </span>

        <h1 className="hero-headline mx-auto mt-6 max-w-4xl text-4xl sm:text-6xl lg:text-[4.5rem]">
          Every Atom Has a <span className="hero-accent">Cosmic Memory</span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
          The universe began with almost nothing but hydrogen and helium. Every
          heavier element — the carbon in your cells, the oxygen in your breath,
          the iron in your blood, the gold on your hand — was forged later, in
          stars, in their deaths, and in collisions between the densest objects
          that exist.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Nothing on Earth was made here. This is where it all came from.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#first-three-minutes"
            className="cta-primary group inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-7 py-3.5 text-sm font-semibold text-white sm:w-auto"
          >
            Follow the Story
            <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/elements"
            className="cta-secondary inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-foreground hover:border-white/30 hover:bg-white/10 sm:w-auto"
          >
            Explore Periodic Table
          </Link>
        </div>

        <div className="mx-auto mt-16 max-w-5xl sm:mt-20">
          <CosmicArc />
        </div>
      </div>
    </section>
  );
}

/** Nodes along the arc: fraction of the path, label, accent, and dot radius. */
const ARC_NODES = [
  { t: 0.02, label: "Big Bang", color: "#64d2ff", r: 6 },
  { t: 0.19, label: "First stars", color: "#2997ff", r: 4.5 },
  { t: 0.38, label: "Fusion", color: "#2997ff", r: 4.5 },
  { t: 0.57, label: "Supernovae", color: "#ff9f0a", r: 5.5 },
  { t: 0.74, label: "Mergers", color: "#bf5af2", r: 5 },
  { t: 0.89, label: "Solar System", color: "#a9c9ff", r: 4.5 },
  { t: 0.985, label: "Us", color: "#f5f5f7", r: 5.5 },
] as const;

/**
 * The arc of cosmic chemistry: one shallow curve from the Big Bang to now.
 *
 * Node positions are computed from an explicit quadratic Bézier so the dots sit
 * exactly on the drawn path. Doing the algebra here keeps the markup free of
 * hand-tuned magic coordinates that drift whenever the curve changes.
 */
function CosmicArc() {
  // Control points of the curve drawn below: P0 (40,150) → P1 (500,20) → P2 (960,150).
  const p0 = { x: 40, y: 150 };
  const p1 = { x: 500, y: 20 };
  const p2 = { x: 960, y: 150 };

  const pointAt = (t: number) => {
    const u = 1 - t;
    return {
      x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
      y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    };
  };

  return (
    <svg
      viewBox="0 0 1000 210"
      className="h-auto w-full"
      role="img"
      aria-label="An arc from the Big Bang through the first stars, stellar fusion, supernovae, and neutron star mergers, to the Solar System and us."
    >
      <defs>
        <linearGradient id="arc-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64d2ff" stopOpacity="0.15" />
          <stop offset="22%" stopColor="#2997ff" stopOpacity="0.85" />
          <stop offset="58%" stopColor="#ff9f0a" stopOpacity="0.7" />
          <stop offset="78%" stopColor="#bf5af2" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#f5f5f7" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Faint baseline: the arc's shadow on the floor of the diagram. */}
      <path
        d={`M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d={`M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
        fill="none"
        stroke="url(#arc-stroke)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {ARC_NODES.map((node) => {
        const { x, y } = pointAt(node.t);
        return (
          <g key={node.label}>
            <circle cx={x} cy={y} r={node.r * 3.2} fill={node.color} opacity="0.1" />
            <circle cx={x} cy={y} r={node.r} fill={node.color} />
            <circle cx={x} cy={y} r={node.r} fill="none" stroke="#000" strokeWidth="0.5" />
            <line
              x1={x}
              y1={y + node.r + 4}
              x2={x}
              y2={186}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.75"
            />
            <text
              x={x}
              y={202}
              textAnchor="middle"
              className="fill-muted"
              style={{ fontSize: "11px", letterSpacing: "0.02em" }}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
