/**
 * The smaller static diagrams of the origins story, kept together because each
 * is a single SVG or gradient composition with no state and no shared logic.
 *
 * Everything here is a plain server component. No canvas, no animation loop, no
 * filters — the only GPU work is compositing a handful of gradients.
 */

/**
 * A nebula: overlapping radial gradients on black, with a few discrete "atoms"
 * scattered through it at fixed coordinates. Positions are hardcoded rather than
 * randomized so the server and client render identical markup.
 */
const NEBULA_ATOMS = [
  { x: 18, y: 32, size: 4, o: 0.75 },
  { x: 31, y: 61, size: 3, o: 0.55 },
  { x: 44, y: 24, size: 5, o: 0.85 },
  { x: 52, y: 48, size: 3, o: 0.5 },
  { x: 63, y: 70, size: 4, o: 0.7 },
  { x: 71, y: 38, size: 3, o: 0.55 },
  { x: 79, y: 58, size: 4, o: 0.65 },
  { x: 26, y: 78, size: 3, o: 0.45 },
  { x: 88, y: 26, size: 3, o: 0.5 },
] as const;

export function NebulaCloud() {
  return (
    <div className="panel-solid overflow-hidden rounded-2xl p-5 sm:p-7">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-2">
        Molecular cloud · gravity gathering hydrogen
      </p>

      <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden rounded-xl bg-black">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(42% 46% at 34% 42%, rgba(41,151,255,0.3), transparent 70%)",
              "radial-gradient(36% 40% at 64% 58%, rgba(100,210,255,0.22), transparent 72%)",
              "radial-gradient(22% 26% at 50% 50%, rgba(255,255,255,0.16), transparent 74%)",
              "radial-gradient(30% 34% at 78% 30%, rgba(191,90,242,0.1), transparent 76%)",
            ].join(","),
          }}
        />
        {/* The collapsing centre: the seed of a star. */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(169,201,255,0.45) 32%, transparent 70%)",
          }}
        />
        {NEBULA_ATOMS.map((atom) => (
          <span
            key={`${atom.x}-${atom.y}`}
            aria-hidden="true"
            className="absolute rounded-full bg-white"
            style={{
              left: `${atom.x}%`,
              top: `${atom.y}%`,
              width: atom.size,
              height: atom.size,
              opacity: atom.o,
            }}
          />
        ))}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        A cloud of primordial gas, mostly hydrogen. Where it is densest, gravity
        pulls hardest — and the centre begins to collapse.
      </p>
    </div>
  );
}

/**
 * Binding energy per nucleon, the curve that explains why stars die.
 *
 * Only the shape matters here, so the path is drawn from a handful of anchor
 * points rather than plotted from data. Fusing anything to the left of iron
 * releases energy; fusing anything to the right of it costs energy.
 */
export function IronBindingCurve() {
  return (
    <div className="panel-solid overflow-hidden rounded-2xl p-5 sm:p-7">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-2">
        Binding energy per nucleon
      </p>

      <svg
        viewBox="0 0 420 220"
        className="mt-5 h-auto w-full"
        role="img"
        aria-label="Binding energy per nucleon rises steeply from hydrogen, peaks near iron and nickel, then declines slowly toward uranium."
      >
        <defs>
          <linearGradient id="uphill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2997ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#64d2ff" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="downhill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff9f0a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#bf5af2" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* Axes */}
        <line x1="34" y1="172" x2="404" y2="172" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        <line x1="34" y1="18" x2="34" y2="172" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

        {/* Rising limb: fusion here releases energy. */}
        <path
          d="M 40 166 C 62 118, 78 74, 104 58 C 140 36, 176 44, 214 40"
          fill="none"
          stroke="url(#uphill)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Falling limb: fusion here consumes energy. */}
        <path
          d="M 214 40 C 268 46, 330 60, 398 78"
          fill="none"
          stroke="url(#downhill)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* The peak: iron and nickel. */}
        <line x1="214" y1="40" x2="214" y2="172" stroke="rgba(255,159,10,0.3)" strokeDasharray="3 4" strokeWidth="1" />
        <circle cx="214" cy="40" r="13" fill="rgba(255,159,10,0.14)" />
        <circle cx="214" cy="40" r="4.5" fill="#ff9f0a" />
        <text x="214" y="26" textAnchor="middle" fill="#ff9f0a" style={{ fontSize: "11px", fontWeight: 600 }}>
          Fe / Ni
        </text>

        {/* Endpoints */}
        <text x="40" y="188" textAnchor="middle" className="fill-muted-2" style={{ fontSize: "10px" }}>
          H
        </text>
        <text x="398" y="188" textAnchor="middle" className="fill-muted-2" style={{ fontSize: "10px" }}>
          U
        </text>
        <text x="120" y="200" textAnchor="middle" fill="#64d2ff" style={{ fontSize: "10px" }}>
          fusion releases energy
        </text>
        <text x="310" y="200" textAnchor="middle" fill="#bf5af2" style={{ fontSize: "10px" }}>
          fusion consumes energy
        </text>
      </svg>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-accent/25 bg-accent/[0.06] px-4 py-3">
          <p className="text-xs font-semibold text-accent-cyan">Before iron</p>
          <p className="mt-1 text-xs leading-relaxed text-secondary">
            Fusing light nuclei releases energy. That outward pressure is what
            holds a star up against its own gravity.
          </p>
        </div>
        <div className="rounded-xl border border-accent-violet/25 bg-accent-violet/[0.06] px-4 py-3">
          <p className="text-xs font-semibold text-accent-violet">Beyond iron</p>
          <p className="mt-1 text-xs leading-relaxed text-secondary">
            Fusion stops paying. A star with an iron core has run out of ways to
            support itself, and collapse can follow.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Rays of the supernova composition: angle in degrees, length, and weight. */
const BURST_RAYS = Array.from({ length: 24 }, (_, i) => ({
  angle: i * 15,
  length: i % 3 === 0 ? 130 : i % 2 === 0 ? 104 : 86,
  width: i % 3 === 0 ? 1.5 : 0.75,
}));

/** Elements the explosion scatters, placed on a ring around the blast. */
const SCATTERED = [
  { symbol: "O", angle: 208 },
  { symbol: "Si", angle: 262 },
  { symbol: "Ca", angle: 315 },
  { symbol: "Fe", angle: 20 },
  { symbol: "Ni", angle: 74 },
  { symbol: "S", angle: 140 },
] as const;

/**
 * A supernova, drawn as a static radial burst. The rays are straight lines from
 * a common centre — geometry, not particles — and the elements it scatters ring
 * the blast at fixed angles.
 */
export function SupernovaBurst() {
  const center = 170;
  return (
    <div className="panel-solid overflow-hidden rounded-2xl p-5 sm:p-7">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-2">
        Core collapse · the star turns inside out
      </p>

      <svg
        viewBox="0 0 340 340"
        className="mx-auto mt-5 h-auto w-full max-w-[21rem]"
        role="img"
        aria-label="A radial burst scattering oxygen, silicon, sulfur, calcium, iron, and nickel outward into space."
      >
        <defs>
          <radialGradient id="burst-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="24%" stopColor="#ffd8a0" stopOpacity="0.75" />
            <stop offset="52%" stopColor="#ff9f0a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ff9f0a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ray" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#ff9f0a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#64d2ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g>
          {BURST_RAYS.map((ray) => (
            <line
              key={ray.angle}
              x1={center}
              y1={center}
              x2={center + ray.length}
              y2={center}
              stroke="url(#ray)"
              strokeWidth={ray.width}
              strokeLinecap="round"
              transform={`rotate(${ray.angle} ${center} ${center})`}
            />
          ))}
        </g>

        {/* Shock front */}
        <circle cx={center} cy={center} r="118" fill="none" stroke="rgba(100,210,255,0.18)" strokeWidth="0.75" />
        <circle cx={center} cy={center} r="146" fill="none" stroke="rgba(100,210,255,0.08)" strokeWidth="0.75" />

        <circle cx={center} cy={center} r="88" fill="url(#burst-core)" />

        {SCATTERED.map((item) => {
          const rad = (item.angle * Math.PI) / 180;
          const x = center + Math.cos(rad) * 132;
          const y = center + Math.sin(rad) * 132;
          return (
            <g key={item.symbol}>
              <circle cx={x} cy={y} r="15" fill="#000000" />
              <circle cx={x} cy={y} r="15" fill="rgba(255,159,10,0.1)" stroke="rgba(255,159,10,0.45)" strokeWidth="1" />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill="#ffd8a0"
                style={{ fontSize: "11px", fontWeight: 600 }}
              >
                {item.symbol}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        In seconds, a star&apos;s entire manufactured inventory is thrown into
        interstellar space — along with new elements made in the blast itself.
      </p>
    </div>
  );
}

/** The two settings where rapid neutron capture is thought to happen. */
const RPROCESS_SITES = [
  {
    site: "Neutron star mergers",
    role: "Major source",
    detail:
      "Two collapsed stellar cores spiral together and tear each other apart, flinging out matter that is almost pure neutrons.",
    elements: ["Au", "Pt", "U"],
    accent: "#bf5af2",
  },
  {
    site: "Rare supernovae",
    role: "Possible contributor",
    detail:
      "Some rapidly rotating, strongly magnetized collapses may reach neutron densities high enough to run the r-process too.",
    elements: ["Eu", "Th", "U"],
    accent: "#ff9f0a",
  },
] as const;

/** Where the heaviest natural elements are thought to be forged. */
export function RProcessSites() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {RPROCESS_SITES.map((site) => (
        <div key={site.site} className="panel-solid rounded-2xl p-5">
          <p
            className="text-[0.65rem] font-semibold uppercase tracking-[0.14em]"
            style={{ color: site.accent }}
          >
            {site.role}
          </p>
          <h3 className="mt-1.5 text-base font-semibold tracking-tight text-foreground">
            {site.site}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted">{site.detail}</p>
          <div className="mt-4 flex gap-2">
            {site.elements.map((symbol) => (
              <span
                key={symbol}
                className="flex h-10 w-10 items-center justify-center rounded-lg border font-semibold"
                style={{
                  color: site.accent,
                  borderColor: `${site.accent}40`,
                  background: `${site.accent}12`,
                }}
              >
                {symbol}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Cosmic ray spallation: a nucleus is hit, and breaks. */
export function SpallationDiagram() {
  return (
    <div className="panel-solid overflow-hidden rounded-2xl p-5 sm:p-7">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-2">
        Cosmic ray spallation · making elements by breaking them
      </p>

      <svg
        viewBox="0 0 420 200"
        className="mt-5 h-auto w-full"
        role="img"
        aria-label="A cosmic ray strikes a carbon or oxygen nucleus, splitting it into lithium, beryllium, and boron."
      >
        {/* Incoming cosmic ray */}
        <line x1="16" y1="100" x2="126" y2="100" stroke="#ff5f7e" strokeWidth="1.5" strokeDasharray="2 5" />
        <path d="M 120 95 L 130 100 L 120 105 Z" fill="#ff5f7e" />
        <text x="16" y="86" fill="#ff5f7e" style={{ fontSize: "10px", fontWeight: 600 }}>
          cosmic ray
        </text>
        <text x="16" y="120" className="fill-muted-2" style={{ fontSize: "9px" }}>
          near light speed
        </text>

        {/* Target nucleus */}
        <circle cx="170" cy="100" r="30" fill="rgba(41,151,255,0.1)" stroke="#2997ff" strokeWidth="1" />
        <text x="170" y="98" textAnchor="middle" fill="#2997ff" style={{ fontSize: "13px", fontWeight: 600 }}>
          C / O
        </text>
        <text x="170" y="112" textAnchor="middle" fill="rgba(41,151,255,0.6)" style={{ fontSize: "8px" }}>
          nucleus
        </text>

        {/* Fragments */}
        {[
          { symbol: "Li", y: 44 },
          { symbol: "Be", y: 100 },
          { symbol: "B", y: 156 },
        ].map((frag) => (
          <g key={frag.symbol}>
            <path
              d={`M 204 100 Q 260 100 300 ${frag.y}`}
              fill="none"
              stroke="rgba(255,255,255,0.16)"
              strokeWidth="1"
            />
            <circle cx="330" cy={frag.y} r="19" fill="rgba(255,95,126,0.1)" stroke="#ff5f7e" strokeWidth="1" />
            <text
              x="330"
              y={frag.y + 5}
              textAnchor="middle"
              fill="#ff5f7e"
              style={{ fontSize: "13px", fontWeight: 600 }}
            >
              {frag.symbol}
            </text>
          </g>
        ))}
        <text x="378" y="104" className="fill-muted" style={{ fontSize: "10px" }}>
          fragments
        </text>
      </svg>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Beryllium and boron are made by destruction, not construction — which is
        why they are so scarce compared to the carbon they come from.
      </p>
    </div>
  );
}

/** Human-made elements: targets, beams, and vanishingly short lives. */
const SYNTHETIC_EXAMPLES = [
  { symbol: "Tc", name: "Technetium", note: "Natural traces only; made in reactors" },
  { symbol: "Np", name: "Neptunium", note: "The first element past uranium" },
  { symbol: "Pu", name: "Plutonium", note: "Reactor-made, minute natural traces" },
  { symbol: "Og", name: "Oganesson", note: "A handful of atoms, ever" },
] as const;

/** A beamline: nuclei accelerated into a target, and something new comes out. */
export function AcceleratorDiagram() {
  return (
    <div className="panel-solid overflow-hidden rounded-2xl p-5 sm:p-7">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-2">
        Particle accelerator · building nuclei by hand
      </p>

      <svg
        viewBox="0 0 420 130"
        className="mt-5 h-auto w-full"
        role="img"
        aria-label="Ions are accelerated down a beamline into a heavy target, producing a new, unstable nucleus."
      >
        {/* Beamline */}
        <rect x="16" y="52" width="230" height="26" rx="13" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        {[46, 86, 126, 166, 206].map((x) => (
          <circle key={x} cx={x} cy="65" r="3.5" fill="#64d2ff" opacity="0.75" />
        ))}
        <text x="16" y="42" className="fill-muted-2" style={{ fontSize: "9px" }}>
          accelerated ions
        </text>

        {/* Target */}
        <rect x="258" y="34" width="14" height="62" rx="3" fill="rgba(255,159,10,0.16)" stroke="#ff9f0a" strokeWidth="1" />
        <text x="265" y="112" textAnchor="middle" fill="#ff9f0a" style={{ fontSize: "9px" }}>
          target
        </text>

        {/* Product */}
        <circle cx="356" cy="65" r="26" fill="rgba(152,152,157,0.1)" stroke="#98989d" strokeWidth="1" />
        <text x="356" y="63" textAnchor="middle" fill="#d2d2d7" style={{ fontSize: "12px", fontWeight: 600 }}>
          new
        </text>
        <text x="356" y="76" textAnchor="middle" fill="#98989d" style={{ fontSize: "9px" }}>
          nucleus
        </text>
        <path d="M 280 65 L 322 65" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
        <path d="M 318 61 L 326 65 L 318 69 Z" fill="rgba(255,255,255,0.45)" />
      </svg>

      <dl className="mt-5 grid grid-cols-2 gap-2">
        {SYNTHETIC_EXAMPLES.map((item) => (
          <div
            key={item.symbol}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5"
          >
            <dt className="flex items-baseline gap-2">
              <span className="font-mono text-base font-semibold text-secondary">
                {item.symbol}
              </span>
              <span className="truncate text-xs text-foreground">{item.name}</span>
            </dt>
            <dd className="mt-1 text-[0.7rem] leading-relaxed text-muted">
              {item.note}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
