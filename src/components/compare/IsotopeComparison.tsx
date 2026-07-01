"use client";

import { useMemo } from "react";
import type { Element } from "@/types/element";
import type { Isotope } from "@/types/isotope";
import { getIsotopesForElement } from "@/components/atom/atomUtils";

interface IsotopeComparisonProps {
  left: Element;
  right: Element;
  leftAccent: string;
  rightAccent: string;
}

/**
 * Curated isotope options for both elements, side by side. When only the
 * standard-mass fallback exists, the single "approximate model" isotope is
 * shown and clearly badged so it's never mistaken for exact data.
 */
export function IsotopeComparison({
  left,
  right,
  leftAccent,
  rightAccent,
}: IsotopeComparisonProps) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground">Isotopes</h3>
      <p className="mt-1 text-[0.7rem] leading-relaxed text-muted/80">
        Isotopes of an element share the same proton count but differ in
        neutrons, changing the mass number. For a neutral atom the electron count
        stays the same too.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <IsotopeColumn element={left} accent={leftAccent} />
        <IsotopeColumn element={right} accent={rightAccent} />
      </div>
    </div>
  );
}

/** One element's isotope list. */
function IsotopeColumn({ element, accent }: { element: Element; accent: string }) {
  const isotopes = useMemo(() => getIsotopesForElement(element), [element]);
  const approximateOnly = isotopes.length === 1 && isotopes[0].isApproximate;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold" style={{ color: accent }}>
          {element.name}
        </span>
        <span className="text-[0.65rem] text-muted">
          {approximateOnly
            ? "approximate model"
            : `${isotopes.length} curated`}
        </span>
      </div>

      <ul className="mt-2 space-y-2">
        {isotopes.map((iso) => (
          <IsotopeRow key={iso.symbol} isotope={iso} accent={accent} />
        ))}
      </ul>
    </div>
  );
}

/** A single isotope: label, mass number, neutrons, and a stability badge. */
function IsotopeRow({ isotope, accent }: { isotope: Isotope; accent: string }) {
  return (
    <li
      className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2"
      style={{ ["--accent" as string]: accent }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm text-foreground">{isotope.label}</span>
        <div className="flex items-center gap-1.5">
          {isotope.isApproximate && (
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-1.5 py-0.5 text-[0.55rem] text-muted">
              ≈ approx.
            </span>
          )}
          <span
            className={`rounded-full px-1.5 py-0.5 text-[0.55rem] font-medium ${
              isotope.isStable
                ? "bg-emerald-400/10 text-emerald-300"
                : "bg-rose-400/10 text-rose-300"
            }`}
          >
            {isotope.isStable ? "stable" : "unstable"}
          </span>
        </div>
      </div>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[0.7rem] text-muted">
        <span>
          Mass <span className="font-mono text-foreground">{isotope.massNumber}</span>
        </span>
        <span>
          Neutrons{" "}
          <span className="font-mono text-foreground">{isotope.neutrons}</span>
        </span>
        {isotope.abundance && <span>Abundance {isotope.abundance}</span>}
        {isotope.halfLife && <span>Half-life {isotope.halfLife}</span>}
      </div>
    </li>
  );
}
