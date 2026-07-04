"use client";

import type { Isotope } from "@/types/isotope";

interface IsotopeSelectorProps {
  /** Currently selected isotope. */
  selectedIsotope: Isotope;
  /** All isotopes available for this element. */
  isotopes: Isotope[];
  onChange: (isotope: Isotope) => void;
}

/**
 * Compact scientific selector for choosing an isotope of the current element.
 * Renders a segmented control when several isotopes exist, or a quiet
 * single-form note otherwise; a slim detail row summarises the selection
 * (stability, neutron count, natural abundance, approximate-model badge).
 */
export function IsotopeSelector({
  selectedIsotope,
  isotopes,
  onChange,
}: IsotopeSelectorProps) {
  const single = isotopes.length === 1;

  return (
    <div className="glass-panel-subtle flex flex-col gap-2.5 rounded-2xl px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted-2">
          Isotope
        </span>

        {single ? (
          <span className="text-sm font-medium text-foreground">
            {selectedIsotope.label}
            <span className="ml-2 text-xs text-muted">Single common form</span>
          </span>
        ) : (
          <div className="segmented-control">
            {isotopes.map((isotope) => (
              <button
                key={isotope.symbol}
                type="button"
                onClick={() => onChange(isotope)}
                aria-pressed={isotope.symbol === selectedIsotope.symbol}
                data-active={isotope.symbol === selectedIsotope.symbol}
                title={isotope.label}
                className="segment font-mono"
              >
                {isotope.symbol}
              </button>
            ))}
          </div>
        )}

        {/* Selected isotope facts, kept on one quiet line. */}
        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <StatusBadge isStable={selectedIsotope.isStable} />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[0.7rem] text-secondary">
            {selectedIsotope.neutrons} neutron
            {selectedIsotope.neutrons === 1 ? "" : "s"}
          </span>
          {selectedIsotope.abundance && (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[0.7rem] text-secondary">
              {selectedIsotope.abundance} natural
            </span>
          )}
          {selectedIsotope.isApproximate && (
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-0.5 text-[0.7rem] font-medium text-muted">
              Approximate model
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Restrained stable / radioactive badge. */
function StatusBadge({ isStable }: { isStable: boolean }) {
  const color = isStable ? "#30d158" : "#ff9f0a";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium"
      style={{
        borderColor: `${color}4d`,
        color,
        background: `${color}14`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      {isStable ? "Stable" : "Radioactive"}
    </span>
  );
}
