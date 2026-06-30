"use client";

import type { Element } from "@/types/element";
import { ORBITAL_INFO, getOrbitalTypesForBlock } from "./atomUtils";

interface OrbitalInfoPanelProps {
  element: Element;
  accent: string;
}

/**
 * Compact, premium explainer for the quantum-cloud view. Names the element's
 * block and the orbital families being approximated, then states plainly what
 * the visualization does and does not represent — keeping the experience
 * scientifically honest without a wall of text.
 */
export function OrbitalInfoPanel({ element, accent }: OrbitalInfoPanelProps) {
  const types = getOrbitalTypesForBlock(element.block);

  return (
    <div className="glass-panel flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2">
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: accent }}
        >
          Orbital view
        </h3>
        <span
          className="inline-flex rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium"
          style={{
            borderColor: `${accent}55`,
            color: accent,
            background: `${accent}14`,
          }}
        >
          {element.block}-block
        </span>
      </div>

      <p className="font-mono text-sm text-foreground">
        {element.electronConfiguration}
      </p>

      {/* Orbital families approximated for this element. */}
      <ul className="flex flex-col gap-1.5">
        {types.map((type) => (
          <li
            key={type}
            className="flex items-start gap-2 text-xs leading-relaxed text-muted"
          >
            <span
              className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded font-mono text-[0.65rem] font-semibold text-foreground"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              {type}
            </span>
            <span>
              <span className="text-foreground/90">{ORBITAL_INFO[type].label}</span>{" "}
              — {ORBITAL_INFO[type].shape}.
            </span>
          </li>
        ))}
      </ul>

      <div className="grid gap-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-emerald-300/80">
            What this means
          </span>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            This cloud shows where electrons are more likely to be found. Denser
            regions mean a higher probability of finding an electron there.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-amber-300/80">
            What this does not mean
          </span>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            It does not show exact electron paths or live electron positions, and
            it is not a full quantum-mechanical calculation — the shapes are
            simplified for learning.
          </p>
        </div>
      </div>
    </div>
  );
}
