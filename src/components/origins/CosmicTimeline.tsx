import { COSMIC_EPOCHS, ORIGIN_CATEGORY_BY_ID } from "@/data/elementOrigins";

/**
 * The chemical history of the universe as a vertical rail.
 *
 * Each epoch is a node on a hairline spine, tinted with the accent of the
 * channel it opened. From "the first stars ignite" onward the epochs overlap
 * rather than replace one another, which the closing note says out loud.
 */
export function CosmicTimeline() {
  return (
    <div className="relative">
      {/* Spine. Sits behind the nodes, fading out at both ends. */}
      <div
        aria-hidden="true"
        className="absolute bottom-2 left-[7px] top-2 w-px sm:left-[9px]"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(255,255,255,0.16) 8%, rgba(255,255,255,0.16) 92%, transparent)",
        }}
      />

      <ol className="space-y-8 sm:space-y-10">
        {COSMIC_EPOCHS.map((epoch) => {
          const category = ORIGIN_CATEGORY_BY_ID[epoch.source];
          return (
            <li
              key={epoch.id}
              className={`${category.accentClass} relative pl-8 sm:pl-11`}
            >
              {/* Node: a colored ring drawn as a filled dot with a black core,
                  so the spine reads as passing behind it. */}
              <span
                aria-hidden="true"
                className="origin-swatch absolute left-0 top-[6px] h-[15px] w-[15px] rounded-full sm:h-[19px] sm:w-[19px]"
              />
              <span
                aria-hidden="true"
                className="absolute left-[4px] top-[10px] h-[7px] w-[7px] rounded-full bg-black sm:left-[6px] sm:top-[12px]"
              />

              <p className="font-mono text-xs tracking-tight text-muted-2">
                {epoch.time}
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                {epoch.title}
              </h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-secondary">
                {epoch.description}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** The five products of the first three minutes, in the order they appeared. */
const PRIMORDIAL_STEPS = [
  {
    stage: "Energy",
    detail: "A hot, dense, expanding universe",
    symbol: "γ",
    tone: "#64d2ff",
  },
  {
    stage: "Protons & neutrons",
    detail: "Condense out of the primordial soup",
    symbol: "p n",
    tone: "#64d2ff",
  },
  {
    stage: "Hydrogen",
    detail: "A lone proton, and by far the most common outcome",
    symbol: "H",
    tone: "#f5f5f7",
  },
  {
    stage: "Helium",
    detail: "About a quarter of ordinary matter by mass",
    symbol: "He",
    tone: "#f5f5f7",
  },
  {
    stage: "Lithium",
    detail: "A trace, and then the reactions stop",
    symbol: "Li",
    tone: "#8e8e93",
  },
] as const;

/**
 * What the Big Bang actually produced — a short ladder that ends abruptly,
 * because the real process did. The gap after lithium is the point of the
 * diagram, so it is drawn as a gap.
 */
export function PrimordialLadder() {
  return (
    <div className="panel-solid rounded-2xl p-5 sm:p-7">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-2">
        Big Bang nucleosynthesis · first 3 minutes
      </p>

      <ol className="mt-5 space-y-2.5">
        {PRIMORDIAL_STEPS.map((step, index) => (
          <li
            key={step.stage}
            className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-semibold"
              style={{
                color: step.tone,
                borderColor: `${step.tone}33`,
                background: `${step.tone}0f`,
              }}
            >
              {step.symbol}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground">
                {step.stage}
              </span>
              <span className="block text-xs leading-relaxed text-muted">
                {step.detail}
              </span>
            </span>
            <span className="ml-auto font-mono text-[0.65rem] text-muted-2">
              {index + 1}
            </span>
          </li>
        ))}
      </ol>

      {/* The universe stops here. Everything heavier waits ~200 million years. */}
      <div className="mt-4 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-px flex-1"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.22) 0 6px, transparent 6px 12px)",
          }}
        />
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-2">
          No carbon · no oxygen · no iron · no gold
        </span>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        The universe expanded and cooled faster than fusion could keep building.
        Everything heavier had to wait for stars.
      </p>
    </div>
  );
}
