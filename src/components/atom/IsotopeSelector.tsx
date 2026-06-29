"use client";

import type { Element } from "@/types/element";
import type { Isotope } from "@/types/isotope";

interface IsotopeSelectorProps {
  element: Element;
  /** Currently selected isotope. */
  selectedIsotope: Isotope;
  /** All isotopes available for this element. */
  isotopes: Isotope[];
  onChange: (isotope: Isotope) => void;
  accent: string;
}

/**
 * Premium segmented selector for choosing an isotope of the current element.
 * The compact pills switch the active isotope; a detail strip below summarises
 * the selection (stable/unstable status, neutron count, and an approximate-model
 * badge for generated fallback isotopes). Pure DOM, so it lives outside the
 * Canvas and uses the app's glass theme.
 */
export function IsotopeSelector({
  element,
  selectedIsotope,
  isotopes,
  onChange,
  accent,
}: IsotopeSelectorProps) {
  const single = isotopes.length === 1;

  return (
    <div className="glass-panel flex flex-col gap-3 rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Isotope
        </h3>
        <span className="text-[0.7rem] text-muted/70">
          {single
            ? "Single common form"
            : `${isotopes.length} forms of ${element.name}`}
        </span>
      </div>

      {/* Segmented pills */}
      <div className="flex flex-wrap gap-1.5">
        {isotopes.map((isotope) => {
          const active = isotope.symbol === selectedIsotope.symbol;
          return (
            <button
              key={isotope.symbol}
              type="button"
              onClick={() => onChange(isotope)}
              aria-pressed={active}
              title={isotope.label}
              className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200"
              style={{
                borderColor: active
                  ? `color-mix(in srgb, ${accent} 55%, transparent)`
                  : "rgba(255,255,255,0.1)",
                background: active
                  ? `color-mix(in srgb, ${accent} 16%, transparent)`
                  : "rgba(255,255,255,0.02)",
                color: active ? accent : "var(--color-muted)",
                boxShadow: active ? `0 0 18px -6px ${accent}` : "none",
              }}
            >
              <span className="font-mono">{isotope.symbol}</span>
            </button>
          );
        })}
      </div>

      {/* Selected isotope detail strip */}
      <div className="flex flex-wrap items-center gap-2 border-t border-white/8 pt-3">
        <span className="text-sm font-semibold text-foreground">
          {selectedIsotope.label}
        </span>

        <StatusBadge isStable={selectedIsotope.isStable} />

        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[0.7rem] text-muted">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "#5fc8ff", boxShadow: "0 0 8px #5fc8ff" }}
          />
          {selectedIsotope.neutrons} neutron
          {selectedIsotope.neutrons === 1 ? "" : "s"}
        </span>

        {selectedIsotope.abundance && (
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[0.7rem] text-muted">
            {selectedIsotope.abundance} natural
          </span>
        )}

        {selectedIsotope.isApproximate && (
          <span
            className="rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium"
            style={{
              borderColor: "rgba(148,163,184,0.4)",
              color: "#cbd5e1",
              background: "rgba(148,163,184,0.1)",
            }}
          >
            Approximate model
          </span>
        )}
      </div>
    </div>
  );
}

/** Restrained stable / radioactive badge. */
function StatusBadge({ isStable }: { isStable: boolean }) {
  if (isStable) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium"
        style={{
          borderColor: "rgba(52,211,153,0.4)",
          color: "#6ee7b7",
          background: "rgba(52,211,153,0.1)",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: "#34d399", boxShadow: "0 0 8px #34d399" }}
        />
        Stable
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium"
      style={{
        borderColor: "rgba(251,146,60,0.45)",
        color: "#fdba74",
        background: "rgba(251,146,60,0.1)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "#fb923c", boxShadow: "0 0 8px #fb923c" }}
      />
      Radioactive
    </span>
  );
}
