/** The loop matter runs, from one generation of stars to the next. */
const CYCLE = [
  {
    title: "A star lives",
    detail: "Fusion builds elements in its core over millions or billions of years.",
    color: "#2997ff",
  },
  {
    title: "It dies",
    detail: "Winds and explosions throw that material back into interstellar space.",
    color: "#ff9f0a",
  },
  {
    title: "A cloud is enriched",
    detail: "The gas is no longer pristine. It now carries carbon, oxygen, iron, gold.",
    color: "#bf5af2",
  },
  {
    title: "A system forms",
    detail: "That enriched cloud collapses into a new star, with planets from the leftovers.",
    color: "#a9c9ff",
  },
  {
    title: "Worlds, and us",
    detail: "Rock, ocean, air, and cells — assembled from elements older than the Sun.",
    color: "#f5f5f7",
  },
] as const;

/**
 * Cosmic recycling, drawn as a closed loop rather than a line.
 *
 * The loop is the whole point: the material in the last step is the feedstock
 * for the first step of the next cycle, which the closing return arm states.
 * Numbering is warranted here — these steps happen in this order.
 */
export function CosmicRecyclingDiagram() {
  return (
    <div className="panel-solid overflow-hidden rounded-2xl p-5 sm:p-7">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-2">
        Galactic chemical evolution · the loop
      </p>

      <ol className="mt-5 space-y-2.5">
        {CYCLE.map((step, index) => (
          <li key={step.title} className="relative">
            <div className="flex items-start gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5">
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[0.7rem] font-semibold"
                style={{
                  color: step.color,
                  borderColor: `${step.color}40`,
                  background: `${step.color}12`,
                }}
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">
                  {step.detail}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* The return arm: what makes this a cycle and not a list. */}
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-white/12 px-4 py-3">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 text-accent-cyan">
          <path
            d="M4 12a8 8 0 1 1 2.3 5.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path d="M3 13.5 L6.4 17.9 L10.4 15" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-xs leading-relaxed text-secondary">
          When those stars die, their atoms rejoin the cloud. Every generation
          starts richer than the last.
        </p>
      </div>
    </div>
  );
}
