/**
 * Stellar core: four hydrogen nuclei in, one helium nucleus plus energy out.
 *
 * A static SVG. The "core" is a layered radial gradient rather than a glow
 * filter — filters are the expensive part of SVG on mobile, gradients are free.
 */
export function StellarFusionDiagram() {
  return (
    <div className="panel-solid overflow-hidden rounded-2xl p-5 sm:p-7">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-2">
        Main-sequence core · hydrogen burning
      </p>

      <svg
        viewBox="0 0 420 200"
        className="mt-5 h-auto w-full"
        role="img"
        aria-label="Four hydrogen nuclei fuse into one helium nucleus, releasing energy."
      >
        <defs>
          <radialGradient id="core-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#a9c9ff" stopOpacity="0.8" />
            <stop offset="62%" stopColor="#2997ff" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#2997ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="flow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#64d2ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#64d2ff" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* In: four protons */}
        {[46, 76, 106, 136].map((y, i) => (
          <g key={y}>
            <circle cx="42" cy={y} r="11" fill="rgba(255,95,126,0.14)" stroke="#ff5f7e" strokeWidth="1" />
            <text
              x="42"
              y={y + 4}
              textAnchor="middle"
              fill="#ff5f7e"
              style={{ fontSize: "11px", fontWeight: 600 }}
            >
              H
            </text>
            <path
              d={`M 58 ${y} Q 110 ${y} 132 ${100 + (i - 1.5) * 6}`}
              fill="none"
              stroke="url(#flow)"
              strokeWidth="1.25"
            />
          </g>
        ))}
        <text x="42" y="172" textAnchor="middle" className="fill-muted" style={{ fontSize: "10px" }}>
          4 × hydrogen
        </text>

        {/* Core */}
        <circle cx="196" cy="100" r="62" fill="url(#core-fill)" />
        <circle cx="196" cy="100" r="34" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" />
        <text x="196" y="96" textAnchor="middle" fill="#ffffff" style={{ fontSize: "13px", fontWeight: 600 }}>
          Fusion
        </text>
        <text x="196" y="112" textAnchor="middle" fill="rgba(255,255,255,0.65)" style={{ fontSize: "9px" }}>
          ~15 million K
        </text>

        {/* Out: helium + energy */}
        <path d="M 262 100 L 316 100" stroke="rgba(255,255,255,0.28)" strokeWidth="1.25" />
        <path d="M 310 95 L 318 100 L 310 105 Z" fill="rgba(255,255,255,0.5)" />

        <circle cx="352" cy="76" r="16" fill="rgba(100,210,255,0.14)" stroke="#64d2ff" strokeWidth="1" />
        <text x="352" y="81" textAnchor="middle" fill="#64d2ff" style={{ fontSize: "13px", fontWeight: 600 }}>
          He
        </text>

        <g>
          <circle cx="352" cy="132" r="16" fill="rgba(255,159,10,0.12)" stroke="#ff9f0a" strokeWidth="1" />
          <text x="352" y="137" textAnchor="middle" fill="#ff9f0a" style={{ fontSize: "12px", fontWeight: 600 }}>
            E
          </text>
        </g>
        <text x="352" y="172" textAnchor="middle" className="fill-muted" style={{ fontSize: "10px" }}>
          helium + energy
        </text>
      </svg>

      <div className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
        <p className="font-mono text-sm text-foreground">
          4 <span className="text-[#ff5f7e]">H</span> →{" "}
          <span className="text-accent-cyan">He</span> + energy
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted">
          The helium nucleus weighs slightly less than the four hydrogen nuclei
          that made it. That missing mass leaves as energy — and as starlight.
        </p>
      </div>
    </div>
  );
}

/** One step in a fusion chain: what goes in, what comes out. */
const HELIUM_CHAIN = [
  {
    from: "3 He",
    to: "C",
    name: "Triple-alpha process",
    detail: "Three helium nuclei combine into carbon, by way of a fleeting intermediate.",
    color: "#64d2ff",
  },
  {
    from: "C + He",
    to: "O",
    name: "Helium capture",
    detail: "Carbon captures another helium nucleus and becomes oxygen.",
    color: "#2997ff",
  },
] as const;

/**
 * Helium → carbon → oxygen. Rendered as two labelled steps rather than a single
 * arrow chain, because the two reactions are different in kind: one is a
 * three-body coincidence, the other a straightforward capture.
 */
export function FusionChain() {
  return (
    <div className="panel-solid rounded-2xl p-5 sm:p-7">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-2">
        Helium burning · the foundations of chemistry
      </p>

      <div className="mt-5 flex items-center justify-between gap-2 sm:gap-4">
        <Nuclide symbol="He" label="Helium" color="#64d2ff" />
        <Arrow />
        <Nuclide symbol="C" label="Carbon" color="#a9c9ff" />
        <Arrow />
        <Nuclide symbol="O" label="Oxygen" color="#ffffff" />
      </div>

      <ol className="mt-6 space-y-2.5">
        {HELIUM_CHAIN.map((step) => (
          <li
            key={step.name}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3"
          >
            <div className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-mono text-sm" style={{ color: step.color }}>
                {step.from} → {step.to}
              </span>
              <span className="text-xs font-medium text-foreground">{step.name}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Carbon and oxygen are the two most abundant elements in the universe
        after hydrogen and helium — and between them, the raw material for rock,
        water, and every living cell.
      </p>
    </div>
  );
}

function Nuclide({
  symbol,
  label,
  color,
}: {
  symbol: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full border text-xl font-semibold sm:h-20 sm:w-20 sm:text-2xl"
        style={{
          color,
          borderColor: `${color}40`,
          background: `radial-gradient(circle at 50% 35%, ${color}26, transparent 70%)`,
        }}
      >
        {symbol}
      </div>
      <span className="text-[0.7rem] text-muted">{label}</span>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 40 12"
      aria-hidden="true"
      className="h-3 w-8 shrink-0 sm:w-12"
      style={{ marginBottom: "1.5rem" }}
    >
      <path d="M 0 6 L 32 6" stroke="rgba(255,255,255,0.28)" strokeWidth="1.25" />
      <path d="M 28 2 L 36 6 L 28 10 Z" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}
