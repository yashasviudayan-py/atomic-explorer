"use client";

import type { Element } from "@/types/element";
import { getShellComparison } from "./compareUtils";

interface ShellComparisonProps {
  left: Element;
  right: Element;
  leftAccent: string;
  rightAccent: string;
}

/**
 * Side-by-side electron-shell distribution as horizontal glowing bars, one row
 * per shell number. Rows where the two elements differ are highlighted. This is
 * the simplified Bohr-style shell distribution used across the app — a readable
 * teaching abstraction, not a quantum-exact picture.
 */
export function ShellComparison({
  left,
  right,
  leftAccent,
  rightAccent,
}: ShellComparisonProps) {
  const { rows, maxCount } = getShellComparison(left, right);

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          Shell distribution
        </h3>
        <span className="text-[0.65rem] uppercase tracking-wide text-muted">
          Bohr-style
        </span>
      </div>

      {/* Compact distribution strings */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
          <span className="block text-[0.65rem] uppercase tracking-wide text-muted">
            {left.name}
          </span>
          <span className="font-mono" style={{ color: leftAccent }}>
            {left.shells.join(" · ")}
          </span>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
          <span className="block text-[0.65rem] uppercase tracking-wide text-muted">
            {right.name}
          </span>
          <span className="font-mono" style={{ color: rightAccent }}>
            {right.shells.join(" · ")}
          </span>
        </div>
      </div>

      {/* Per-shell paired bars */}
      <ul className="mt-4 space-y-2.5">
        {rows.map((row) => (
          <li
            key={row.shellNumber}
            className={`rounded-xl px-3 py-2 transition-colors ${
              row.differs ? "bg-white/[0.04]" : ""
            }`}
          >
            <div className="flex items-center justify-between text-[0.7rem] text-muted">
              <span className="uppercase tracking-wide">
                Shell {row.shellNumber}
              </span>
              {row.differs && (
                <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[0.55rem] font-medium text-amber-300">
                  differs
                </span>
              )}
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-3">
              <ShellBar
                count={row.leftCount}
                maxCount={maxCount}
                accent={leftAccent}
                align="left"
              />
              <ShellBar
                count={row.rightCount}
                maxCount={maxCount}
                accent={rightAccent}
                align="right"
              />
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[0.7rem] leading-relaxed text-muted/80">
        Shell distribution counts electrons per energy level for the simplified
        Bohr-style view used throughout Atomic Explorer. Electrons fill inner
        shells before outer ones; the outermost (valence) shell most affects an
        element&apos;s chemistry.
      </p>
    </div>
  );
}

/** One element's bar for a single shell; empty state when that shell is absent. */
function ShellBar({
  count,
  maxCount,
  accent,
  align,
}: {
  count: number | null;
  maxCount: number;
  accent: string;
  align: "left" | "right";
}) {
  if (count === null) {
    return (
      <div
        className={`flex items-center ${align === "right" ? "justify-end" : ""}`}
      >
        <span className="text-[0.7rem] text-muted/50">no shell</span>
      </div>
    );
  }
  const width = `${Math.max(6, (count / maxCount) * 100)}%`;
  return (
    <div
      className={`flex items-center gap-2 ${
        align === "right" ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`flex h-4 flex-1 overflow-hidden rounded-full bg-white/5 ${
          align === "right" ? "justify-end" : ""
        }`}
      >
        <span
          className="h-full rounded-full transition-all"
          style={{
            width,
            background: accent,
            boxShadow: `0 0 12px -2px ${accent}`,
            opacity: 0.9,
          }}
        />
      </div>
      <span className="w-6 shrink-0 text-center font-mono text-xs text-foreground">
        {count}
      </span>
    </div>
  );
}
