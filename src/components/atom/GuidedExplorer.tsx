"use client";

import { useState } from "react";
import type { Element } from "@/types/element";
import type {
  AtomicModelMode,
  AtomVisualMode,
  SelectedParticle,
} from "./atomTypes";

/** State a guided step can push into the viewer when "applied". */
export interface StepFocus {
  modelMode?: AtomicModelMode;
  visualMode?: AtomVisualMode;
  selected?: SelectedParticle;
  showLabels?: boolean;
}

interface GuidedStep {
  title: string;
  body: (element: Element) => string;
  /** Label for the apply button (defaults to "Apply step focus"). */
  applyLabel?: string;
  focus: StepFocus;
}

const STEPS: GuidedStep[] = [
  {
    title: "Start at the nucleus",
    body: (el) =>
      `At the centre sits the nucleus — ${el.atomicNumber} proton${
        el.atomicNumber === 1 ? "" : "s"
      } plus neutrons packed together. Protons are positive; neutrons are neutral and add mass.`,
    applyLabel: "Focus the nucleus",
    focus: {
      modelMode: "bohr",
      visualMode: "particle-focus",
      selected: "proton",
      showLabels: true,
    },
  },
  {
    title: "Understand the element identity",
    body: (el) =>
      `The number of protons — the atomic number — is what makes this ${el.name}. Change the proton count and you change the element entirely.`,
    applyLabel: "Highlight protons",
    focus: {
      modelMode: "bohr",
      visualMode: "particle-focus",
      selected: "proton",
      showLabels: true,
    },
  },
  {
    title: "Explore the electrons",
    body: () =>
      "In the Bohr model, electrons sit in shells (energy levels) around the nucleus. The outermost shell drives how the atom bonds and reacts.",
    applyLabel: "Focus the shells",
    focus: {
      modelMode: "bohr",
      visualMode: "shell-focus",
      selected: "shell",
      showLabels: true,
    },
  },
  {
    title: "Switch to the quantum view",
    body: () =>
      "Electrons don't really orbit like planets. A more realistic picture shows probability orbitals — clouds where electrons are likely to be found. Switch over to compare.",
    applyLabel: "Switch to Quantum Cloud",
    focus: {
      modelMode: "quantum",
      visualMode: "orbital-focus",
      selected: "orbital",
      showLabels: true,
    },
  },
  {
    title: "Compare isotopes",
    body: (el) =>
      `Use the isotope selector above to change ${el.name}'s neutron count. Isotopes share the same protons (so the same chemistry) but differ in neutrons and mass.`,
    applyLabel: "Reset to a clear view",
    focus: {
      modelMode: "bohr",
      visualMode: "balanced",
      selected: null,
      showLabels: true,
    },
  },
];

interface GuidedExplorerProps {
  element: Element;
  accent: string;
  /** Push the current step's focus into the viewer state. */
  onApply: (focus: StepFocus) => void;
}

/**
 * A compact, step-by-step educational tour of the atom. Each step explains one
 * idea and can "apply" a focus — switching model/visual mode, selecting a
 * particle, and turning labels on — so the 3D scene follows along. Step state
 * lives here; the viewer just receives the focus to apply.
 */
export function GuidedExplorer({ element, accent, onApply }: GuidedExplorerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;

  const goNext = () => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  const goPrev = () => setStepIndex((i) => Math.max(0, i - 1));

  return (
    <div className="glass-panel flex flex-col gap-3 rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: accent }}
        >
          Guided tour
        </span>
        <span className="font-mono text-[0.7rem] text-muted">
          Step {stepIndex + 1} / {STEPS.length}
        </span>
      </div>

      {/* Progress indicator */}
      <div className="flex gap-1.5">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              background:
                i <= stepIndex ? accent : "rgba(255,255,255,0.12)",
              boxShadow: i === stepIndex ? `0 0 10px -2px ${accent}` : "none",
            }}
          />
        ))}
      </div>

      <div>
        <h4 className="text-base font-semibold text-foreground">{step.title}</h4>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          {step.body(element)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onApply(step.focus)}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all"
        style={{
          borderColor: accent,
          color: accent,
          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
        }}
      >
        <span aria-hidden="true">✦</span>
        {step.applyLabel ?? "Apply step focus"}
      </button>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={isFirst}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-foreground transition-colors enabled:hover:border-white/25 enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span aria-hidden="true">←</span> Previous
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={isLast}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-foreground transition-colors enabled:hover:border-white/25 enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
