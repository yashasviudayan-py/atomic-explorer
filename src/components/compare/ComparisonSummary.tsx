"use client";

import type { ElementComparison } from "./compareUtils";
import { ComparisonMetricCard } from "./ComparisonMetricCard";

interface ComparisonSummaryProps {
  comparison: ElementComparison;
  leftAccent: string;
  rightAccent: string;
}

/**
 * Premium at-a-glance summary: elegant metric cards for the core numeric
 * properties, plus a compact attribute table for the categorical ones.
 *
 * Scientific honesty: electron counts are labelled as neutral-atom values and
 * neutron counts carry an "≈ approx." flag when derived from the standard-mass
 * fallback rather than curated isotope data.
 */
export function ComparisonSummary({
  comparison,
  leftAccent,
  rightAccent,
}: ComparisonSummaryProps) {
  const { left, right, atomicNumber, mass, particles, shells, category } =
    comparison;

  // Number-of-shells metric, derived on the fly from the shell distributions.
  const shellsMetric = {
    label: "Electron shells",
    leftValue: left.shells.length,
    rightValue: right.shells.length,
    difference: Math.abs(left.shells.length - right.shells.length),
    greater:
      left.shells.length === right.shells.length
        ? ("equal" as const)
        : left.shells.length > right.shells.length
          ? ("left" as const)
          : ("right" as const),
  };

  const attributeRows: { label: string; left: string; right: string; same: boolean }[] = [
    {
      label: "Electron configuration",
      left: left.electronConfiguration,
      right: right.electronConfiguration,
      same: left.electronConfiguration === right.electronConfiguration,
    },
    {
      label: "Category",
      left: category.leftCategoryLabel,
      right: category.rightCategoryLabel,
      same: category.sameCategory,
    },
    {
      label: "Block",
      left: `${left.block}-block`,
      right: `${right.block}-block`,
      same: category.sameBlock,
    },
    {
      label: "Period",
      left: String(left.period),
      right: String(right.period),
      same: category.samePeriod,
    },
    {
      label: "Group",
      left: left.group === null ? "—" : String(left.group),
      right: right.group === null ? "—" : String(right.group),
      same: !category.groupUndefined && category.sameGroup,
    },
  ];

  return (
    <section>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ComparisonMetricCard
          metric={atomicNumber}
          leftAccent={leftAccent}
          rightAccent={rightAccent}
        />
        <ComparisonMetricCard
          metric={mass}
          leftAccent={leftAccent}
          rightAccent={rightAccent}
          format={(n) => (Number.isInteger(n) ? String(n) : n.toFixed(3))}
        />
        <ComparisonMetricCard
          metric={particles.protons}
          leftAccent={leftAccent}
          rightAccent={rightAccent}
        />
        <ComparisonMetricCard
          metric={particles.electrons}
          leftAccent={leftAccent}
          rightAccent={rightAccent}
        />
        <ComparisonMetricCard
          metric={particles.neutrons}
          leftAccent={leftAccent}
          rightAccent={rightAccent}
        />
        <ComparisonMetricCard
          metric={shellsMetric}
          leftAccent={leftAccent}
          rightAccent={rightAccent}
        />
      </div>

      <p className="mt-2 px-1 text-[0.7rem] leading-relaxed text-muted/80">
        Electron counts are for a <span className="text-muted">neutral atom</span>{" "}
        (equal to the proton count). Neutron counts marked{" "}
        <span className="text-muted">≈ approx.</span> are estimated from the
        standard atomic mass where curated isotope data isn&apos;t available.
      </p>

      {/* Categorical attributes table */}
      <div className="glass-panel mt-4 overflow-hidden rounded-2xl">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-white/10 px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
          <span style={{ color: leftAccent }}>{left.symbol}</span>
          <span className="text-center">Property</span>
          <span className="text-right" style={{ color: rightAccent }}>
            {right.symbol}
          </span>
        </div>
        <ul>
          {attributeRows.map((row) => (
            <li
              key={row.label}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-white/5 px-4 py-3 last:border-b-0"
            >
              <span className="min-w-0 truncate font-mono text-sm text-foreground">
                {row.left}
              </span>
              <span className="flex flex-col items-center gap-1 px-2">
                <span className="whitespace-nowrap text-[0.7rem] uppercase tracking-wide text-muted">
                  {row.label}
                </span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[0.55rem] font-medium ${
                    row.same
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-white/5 text-muted"
                  }`}
                >
                  {row.same ? "same" : "differs"}
                </span>
              </span>
              <span className="min-w-0 truncate text-right font-mono text-sm text-foreground">
                {row.right}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
