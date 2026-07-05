"use client";

import type { Element, ElementProperties } from "@/types/element";

interface PropertyComparisonProps {
  left: Element;
  right: Element;
  leftAccent: string;
  rightAccent: string;
}

/** A numeric property to compare, with its label and unit. */
type NumericKey = Exclude<
  keyof ElementProperties,
  "phase" | "yearDiscovered" | "discoveredBy" | "nameOrigin" | "uses"
>;

const NUMERIC_ROWS: { key: NumericKey; label: string; unit: string }[] = [
  { key: "meltingPoint", label: "Melting point", unit: "K" },
  { key: "boilingPoint", label: "Boiling point", unit: "K" },
  { key: "density", label: "Density", unit: "g/cm³" },
  { key: "electronegativity", label: "Electronegativity", unit: "" },
  { key: "atomicRadius", label: "Atomic radius", unit: "pm" },
  { key: "ionizationEnergy", label: "1st ionization", unit: "kJ/mol" },
];

/**
 * Side-by-side physical and atomic properties for two elements. Each numeric
 * row highlights the larger value in that element's accent colour; values with
 * no reliable measurement (chiefly synthetic superheavies) render as "—" and
 * are not scored either way.
 */
export function PropertyComparison({
  left,
  right,
  leftAccent,
  rightAccent,
}: PropertyComparisonProps) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground">
        Physical &amp; atomic properties
      </h3>

      {/* Phase is categorical, shown above the numeric grid. */}
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
        <span className="text-sm font-medium text-foreground">
          {formatPhase(left.properties.phase)}
        </span>
        <span className="text-[0.65rem] uppercase tracking-wide text-muted">
          state
        </span>
        <span className="text-right text-sm font-medium text-foreground">
          {formatPhase(right.properties.phase)}
        </span>
      </div>

      <ul className="mt-2 space-y-1.5">
        {NUMERIC_ROWS.map((row) => {
          const l = left.properties[row.key];
          const r = right.properties[row.key];
          const greater = greaterSide(l, r);
          return (
            <li
              key={row.key}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
            >
              <span
                className="font-mono text-sm tabular-nums"
                style={greater === "left" ? { color: leftAccent } : undefined}
              >
                {formatValue(l, row.unit)}
              </span>
              <span className="whitespace-nowrap text-[0.6rem] uppercase tracking-wide text-muted">
                {row.label}
              </span>
              <span
                className="text-right font-mono text-sm tabular-nums"
                style={greater === "right" ? { color: rightAccent } : undefined}
              >
                {formatValue(r, row.unit)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Which side is numerically larger, or null when either value is unknown. */
function greaterSide(
  left: number | null,
  right: number | null,
): "left" | "right" | null {
  if (left === null || right === null || left === right) return null;
  return left > right ? "left" : "right";
}

/** Numeric value with an optional unit suffix; "—" when unknown. */
function formatValue(value: number | null, unit: string): string {
  if (value === null) return "—";
  return unit ? `${value} ${unit}` : String(value);
}

/** Capitalize the room-temperature phase; "Unknown" for unmeasured elements. */
function formatPhase(phase: string): string {
  if (phase === "unknown") return "Unknown";
  return phase.charAt(0).toUpperCase() + phase.slice(1);
}
