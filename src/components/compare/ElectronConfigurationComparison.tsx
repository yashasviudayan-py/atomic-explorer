"use client";

import type { Element, ElementBlock } from "@/types/element";

interface ElectronConfigurationComparisonProps {
  left: Element;
  right: Element;
  leftAccent: string;
  rightAccent: string;
}

const BLOCK_LABEL: Record<ElementBlock, string> = {
  s: "s-block",
  p: "p-block",
  d: "d-block",
  f: "f-block",
};

/**
 * Electron configuration of both elements plus their orbital block, shown
 * compactly. Configurations use noble-gas shorthand from the dataset.
 */
export function ElectronConfigurationComparison({
  left,
  right,
  leftAccent,
  rightAccent,
}: ElectronConfigurationComparisonProps) {
  const sameBlock = left.block === right.block;

  return (
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground">
        Electron configuration
      </h3>
      <p className="mt-1 text-[0.7rem] leading-relaxed text-muted/80">
        Electron configuration describes how electrons are arranged across energy
        levels and orbitals.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ConfigCard element={left} accent={leftAccent} />
        <ConfigCard element={right} accent={rightAccent} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          <BlockPill block={left.block} accent={leftAccent} />
          <span className="text-muted">·</span>
          <BlockPill block={right.block} accent={rightAccent} />
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[0.6rem] font-medium ${
            sameBlock
              ? "bg-emerald-400/10 text-emerald-300"
              : "bg-white/5 text-muted"
          }`}
        >
          {sameBlock ? "same block" : "different blocks"}
        </span>
      </div>
    </div>
  );
}

/** One element's configuration string card. */
function ConfigCard({ element, accent }: { element: Element; accent: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <span className="block text-[0.65rem] uppercase tracking-wide text-muted">
        {element.name}
      </span>
      <span className="mt-1 block font-mono text-base" style={{ color: accent }}>
        {element.electronConfiguration}
      </span>
    </div>
  );
}

/** A small block indicator (s/p/d/f). */
function BlockPill({ block, accent }: { block: ElementBlock; accent: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-medium"
      style={{
        borderColor: `color-mix(in srgb, ${accent} 45%, transparent)`,
        color: accent,
        background: `color-mix(in srgb, ${accent} 12%, transparent)`,
      }}
    >
      {BLOCK_LABEL[block]}
    </span>
  );
}
