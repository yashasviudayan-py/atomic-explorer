/**
 * The layered interior of an evolved massive star, drawn as nested half-shells.
 *
 * Each shell burns a heavier fuel than the one outside it, and each burns faster
 * — the outermost layer lasts millions of years, the silicon layer lasts about a
 * day. The radii below are compressed for legibility: a real star's hydrogen
 * envelope dwarfs everything inside it by orders of magnitude, and drawing it to
 * scale would render the inner shells invisible.
 */
const SHELLS = [
  { r: 148, fuel: "Hydrogen burning", makes: "He", color: "#2997ff", opacity: 0.1 },
  { r: 126, fuel: "Helium burning", makes: "C, O", color: "#64d2ff", opacity: 0.11 },
  { r: 104, fuel: "Carbon burning", makes: "Ne, Na, Mg", color: "#a9c9ff", opacity: 0.12 },
  { r: 84, fuel: "Neon burning", makes: "O, Mg", color: "#c9a9ff", opacity: 0.13 },
  { r: 66, fuel: "Oxygen burning", makes: "Si, S", color: "#bf5af2", opacity: 0.14 },
  { r: 48, fuel: "Silicon burning", makes: "Fe, Ni", color: "#ff9f0a", opacity: 0.16 },
] as const;

const IRON_CORE_RADIUS = 30;

export function OnionStarDiagram() {
  return (
    <div className="panel-solid overflow-hidden rounded-2xl p-5 sm:p-7">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-2">
        Massive star · final days
      </p>

      <div className="mt-5 flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-4">
        <svg
          viewBox="0 0 320 320"
          className="h-auto w-full max-w-[19rem] shrink-0"
          role="img"
          aria-label="Concentric burning shells inside a massive star, from a hydrogen shell on the outside to an inert iron core at the centre."
        >
          {SHELLS.map((shell) => (
            <circle
              key={shell.fuel}
              cx="160"
              cy="160"
              r={shell.r}
              fill={shell.color}
              fillOpacity={shell.opacity}
              stroke={shell.color}
              strokeOpacity="0.3"
              strokeWidth="0.75"
            />
          ))}

          {/* Inert iron core. Nothing it can fuse will pay for the fusion. */}
          <circle
            cx="160"
            cy="160"
            r={IRON_CORE_RADIUS}
            fill="#1a1207"
            stroke="#ff9f0a"
            strokeWidth="1.25"
          />
          <text
            x="160"
            y="158"
            textAnchor="middle"
            fill="#ff9f0a"
            style={{ fontSize: "15px", fontWeight: 600 }}
          >
            Fe
          </text>
          <text
            x="160"
            y="172"
            textAnchor="middle"
            fill="rgba(255,159,10,0.6)"
            style={{ fontSize: "8px" }}
          >
            inert core
          </text>
        </svg>

        {/* Legend. Outermost first, matching the way you'd fall into the star. */}
        <ol className="w-full min-w-0 space-y-1.5">
          {SHELLS.map((shell) => (
            <li
              key={shell.fuel}
              className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2"
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: shell.color }}
              />
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                {shell.fuel}
              </span>
              <span className="shrink-0 font-mono text-[0.65rem] text-muted">
                {shell.makes}
              </span>
            </li>
          ))}
          <li className="flex items-center gap-3 rounded-lg border border-warning/25 bg-warning/[0.06] px-3 py-2">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-sm bg-warning"
            />
            <span className="min-w-0 flex-1 text-xs font-medium text-foreground">
              Iron core
            </span>
            <span className="shrink-0 font-mono text-[0.65rem] text-warning">
              no fuel
            </span>
          </li>
        </ol>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted">
        Shell thicknesses are compressed for legibility. In a real star the
        hydrogen envelope is vastly larger than everything it encloses.
      </p>
    </div>
  );
}
