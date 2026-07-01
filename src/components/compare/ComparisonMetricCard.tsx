"use client";

import type { MetricComparison } from "./compareUtils";

interface ComparisonMetricCardProps {
  metric: MetricComparison;
  /** Left element accent (hex). */
  leftAccent: string;
  /** Right element accent (hex). */
  rightAccent: string;
  /** Optional formatter for the displayed values (defaults to String). */
  format?: (value: number) => string;
}

/**
 * A single metric compared across two elements: the label, both values, and a
 * subtle bar indicating which side is larger. Values are rendered as-is (no
 * unit assumptions) so the card works for atomic number, mass, particle counts,
 * and the educational complexity score alike.
 */
export function ComparisonMetricCard({
  metric,
  leftAccent,
  rightAccent,
  format = String,
}: ComparisonMetricCardProps) {
  const { label, leftValue, rightValue, greater, approximate } = metric;

  const leftShare = shareOf(leftValue, rightValue);

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </h3>
        {approximate && (
          <span
            className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[0.6rem] text-muted"
            title="Uses an approximate isotope estimated from the standard atomic mass"
          >
            ≈ approx.
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <span
          className={`font-mono text-2xl font-bold tabular-nums ${
            greater === "left" ? "" : "text-foreground/70"
          }`}
          style={greater === "left" ? { color: leftAccent } : undefined}
        >
          {format(leftValue)}
        </span>
        <span className="pb-1 text-[0.65rem] uppercase tracking-wide text-muted/70">
          vs
        </span>
        <span
          className={`font-mono text-2xl font-bold tabular-nums ${
            greater === "right" ? "" : "text-foreground/70"
          }`}
          style={greater === "right" ? { color: rightAccent } : undefined}
        >
          {format(rightValue)}
        </span>
      </div>

      {/* Split bar: fill proportion reflects each side's share of the pair. */}
      <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-white/5">
        <span
          className="h-full transition-all"
          style={{ width: `${leftShare}%`, background: leftAccent, opacity: 0.85 }}
        />
        <span
          className="h-full flex-1 transition-all"
          style={{ background: rightAccent, opacity: 0.85 }}
        />
      </div>
    </div>
  );
}

/** Left side's percentage of the pair total, guarded against a zero total. */
function shareOf(leftValue: number, rightValue: number): number {
  const total = Math.abs(leftValue) + Math.abs(rightValue);
  if (total === 0) return 50;
  return Math.round((Math.abs(leftValue) / total) * 100);
}
