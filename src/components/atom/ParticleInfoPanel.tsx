"use client";

import type { Element } from "@/types/element";
import type { Isotope } from "@/types/isotope";
import type { AtomicModelMode } from "./atomTypes";
import { ParticleType, SelectedParticle } from "./atomUtils";

interface ParticleInfoPanelProps {
  element: Element;
  /** The isotope currently driving particle counts. */
  isotope: Isotope;
  selected: SelectedParticle;
  shells: number[];
  /** True when the rendered nucleus is a capped, representative cluster. */
  capped: boolean;
  /** Active model, so the overview copy matches what's on screen. */
  modelMode: AtomicModelMode;
  accent: string;
  /** Clear the current selection back to the general overview. */
  onClear: () => void;
}

interface ParticleCopy {
  title: string;
  charge: string;
  accent: string;
  body: string;
  /** Extra isotope-specific note appended below the general body. */
  isotopeNote: string;
}

const PARTICLE_COPY: Record<ParticleType, ParticleCopy> = {
  proton: {
    title: "Proton",
    charge: "Charge +1",
    accent: "#ff5d7e",
    body: "Positively charged particles packed in the nucleus. The number of protons — the atomic number — defines which element this is.",
    isotopeNote:
      "Proton count defines the element: every isotope shown here has the same number of protons. Change it and you change the element entirely.",
  },
  neutron: {
    title: "Neutron",
    charge: "Charge 0",
    accent: "#5fc8ff",
    body: "Electrically neutral particles that sit in the nucleus alongside protons. They add mass and help bind the nucleus together.",
    isotopeNote:
      "Switching isotopes mostly changes the neutron count. The same element can have several isotopes — same protons, different neutrons — and that is exactly what the isotope selector adjusts.",
  },
  electron: {
    title: "Electron",
    charge: "Charge −1",
    accent: "#cdeeff",
    body: "Tiny, negatively charged particles arranged around the nucleus in shells. Their arrangement — especially the outermost shell — governs how atoms bond and react.",
    isotopeNote:
      "Choosing a different isotope does not change the electron count for a neutral atom: electrons still equal protons, so chemistry stays the same across isotopes.",
  },
  shell: {
    title: "Electron shell",
    charge: "Energy level",
    accent: "#6fd6ff",
    body: "Each shell is an energy level that electrons occupy, filling inner shells before outer ones. The outermost (valence) shell drives the atom's chemistry.",
    isotopeNote:
      "Shell structure depends on electron count, not neutrons, so it stays the same across the neutral isotopes of this element.",
  },
  orbital: {
    title: "Orbital region",
    charge: "Probability cloud",
    accent: "#b9a8ff",
    body: "Orbitals describe regions where electrons are most likely to be found — not fixed paths like planets orbiting a star. s orbitals are spherical, p orbitals are dumbbell-shaped, and d and f orbitals are more complex. Denser parts of the cloud mean a higher probability of finding an electron there.",
    isotopeNote:
      "This cloud is a simplified visualization for learning, not an exact quantum-mechanical calculation. The shapes shown are inspired by real atomic orbitals.",
  },
};

/**
 * Side panel that explains whichever particle the user selected in the 3D
 * scene and always shows the current isotope's composition. Defaults to a
 * general overview keyed to the selected isotope when nothing is selected.
 */
export function ParticleInfoPanel({
  element,
  isotope,
  selected,
  shells,
  capped,
  modelMode,
  accent,
  onClear,
}: ParticleInfoPanelProps) {
  const copy = selected ? PARTICLE_COPY[selected] : null;
  const { protons, neutrons, electrons } = isotope;
  const isQuantum = modelMode === "quantum";

  return (
    <div className="glass-panel flex flex-col gap-5 rounded-2xl p-5">
      {/* Active model + block, so the panel always reflects what's on screen. */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium"
          style={{
            borderColor: `${accent}55`,
            color: accent,
            background: `${accent}14`,
          }}
        >
          {isQuantum ? "Quantum Cloud model" : "Bohr-style model"}
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[0.7rem] text-muted">
          {element.block}-block
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <h3
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: copy ? copy.accent : accent }}
          >
            {copy ? copy.title : isotope.label}
          </h3>
          {copy && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-muted transition-colors hover:text-foreground"
            >
              Clear ✕
            </button>
          )}
        </div>

        {copy ? (
          <>
            <span
              className="mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium"
              style={{
                borderColor: `${copy.accent}55`,
                color: copy.accent,
                background: `${copy.accent}14`,
              }}
            >
              {copy.charge}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-muted">{copy.body}</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              {copy.isotopeNote}
            </p>
          </>
        ) : (
          <>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[0.7rem] text-muted">
                Mass number {isotope.massNumber}
              </span>
              <StatusPill isStable={isotope.isStable} />
              {isotope.isApproximate && (
                <span
                  className="rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium"
                  style={{
                    borderColor: "rgba(148,163,184,0.4)",
                    color: "#cbd5e1",
                    background: "rgba(148,163,184,0.1)",
                  }}
                >
                  Approximate
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {isotope.description}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {isQuantum ? (
                <>
                  This is a simplified probability-cloud view inspired by atomic
                  orbitals: the cloud shows where the {electrons} electron
                  {electrons === 1 ? "" : "s"} of a neutral {element.name} atom
                  are likely to be — not exact paths. Click the cloud to learn
                  more.
                </>
              ) : (
                <>
                  This is an educational Bohr-style model: a neutral{" "}
                  {element.name} atom carries equal protons and electrons (
                  {electrons}). Tap any particle to learn what it does.
                </>
              )}
            </p>
          </>
        )}
      </div>

      {/* Electron configuration */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Electron configuration
        </h4>
        <p className="mt-1.5 font-mono text-sm text-foreground">
          {element.electronConfiguration}
        </p>
      </div>

      {/* Isotope facts */}
      {(isotope.abundance || isotope.halfLife) && (
        <div className="grid grid-cols-2 gap-2">
          {isotope.abundance && (
            <FactCell label="Natural abundance" value={isotope.abundance} />
          )}
          {isotope.halfLife && (
            <FactCell label="Half-life" value={isotope.halfLife} />
          )}
        </div>
      )}

      {/* Composition counts */}
      <div className="grid grid-cols-3 gap-2">
        <CountStat label="Protons" value={protons} dot="#ff5d7e" />
        <CountStat label="Neutrons" value={neutrons} dot="#5fc8ff" />
        <CountStat label="Electrons" value={electrons} dot="#cdeeff" />
      </div>

      {/* Shell distribution */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Shell distribution
        </h4>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {shells.map((count, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs"
            >
              <span className="text-muted/70">{index + 1}</span>
              <span className="font-mono text-foreground">{count}e⁻</span>
            </span>
          ))}
        </div>
      </div>

      {capped && (
        <p className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[0.7rem] leading-relaxed text-muted">
          Large nuclei are visually condensed for performance — the cluster is a
          representative sample. The counts above are the true values for{" "}
          {isotope.label}.
        </p>
      )}
    </div>
  );
}

function StatusPill({ isStable }: { isStable: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-medium"
      style={
        isStable
          ? {
              borderColor: "rgba(52,211,153,0.4)",
              color: "#6ee7b7",
              background: "rgba(52,211,153,0.1)",
            }
          : {
              borderColor: "rgba(251,146,60,0.45)",
              color: "#fdba74",
              background: "rgba(251,146,60,0.1)",
            }
      }
    >
      {isStable ? "Stable" : "Radioactive"}
    </span>
  );
}

function FactCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
      <span className="block text-[0.65rem] uppercase tracking-wide text-muted">
        {label}
      </span>
      <span className="mt-0.5 block font-mono text-sm text-foreground">
        {value}
      </span>
    </div>
  );
}

function CountStat({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-center">
      <span
        className="mx-auto mb-1 block h-2 w-2 rounded-full"
        style={{ background: dot, boxShadow: `0 0 10px ${dot}` }}
      />
      <span className="block font-mono text-lg font-semibold text-foreground">
        {value}
      </span>
      <span className="block text-[0.65rem] uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
  );
}
