"use client";

import type { Element } from "@/types/element";
import { ParticleType, SelectedParticle } from "./atomUtils";

interface ParticleInfoPanelProps {
  element: Element;
  selected: SelectedParticle;
  protons: number;
  neutrons: number;
  electrons: number;
  shells: number[];
  /** True when the rendered nucleus is a capped, representative cluster. */
  capped: boolean;
  accent: string;
  /** Clear the current selection back to the general overview. */
  onClear: () => void;
}

interface ParticleCopy {
  title: string;
  charge: string;
  accent: string;
  body: string;
}

const PARTICLE_COPY: Record<ParticleType, ParticleCopy> = {
  proton: {
    title: "Proton",
    charge: "Charge +1",
    accent: "#ff5d7e",
    body: "Positively charged particles packed in the nucleus. The number of protons — the atomic number — defines which element this is. Change it and you change the element entirely.",
  },
  neutron: {
    title: "Neutron",
    charge: "Charge 0",
    accent: "#5fc8ff",
    body: "Electrically neutral particles that sit in the nucleus alongside protons. They add mass and help bind the nucleus together. Varying the neutron count produces different isotopes of the same element.",
  },
  electron: {
    title: "Electron",
    charge: "Charge −1",
    accent: "#cdeeff",
    body: "Tiny, negatively charged particles orbiting the nucleus in shells. Their arrangement — especially the outermost shell — governs how atoms bond and react to form everything around us.",
  },
  shell: {
    title: "Electron shell",
    charge: "Energy level",
    accent: "#6fd6ff",
    body: "Each shell is an energy level that electrons occupy, filling inner shells before outer ones. Inner shells sit closest to the nucleus; the outermost (valence) shell drives the atom's chemistry.",
  },
};

/**
 * Side panel that explains whichever particle the user selected in the 3D
 * scene, and always shows this element's composition. Defaults to a general
 * atom overview when nothing is selected.
 */
export function ParticleInfoPanel({
  element,
  selected,
  protons,
  neutrons,
  electrons,
  shells,
  capped,
  accent,
  onClear,
}: ParticleInfoPanelProps) {
  const copy = selected ? PARTICLE_COPY[selected] : null;

  return (
    <div className="glass-panel flex flex-col gap-5 rounded-2xl p-5">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h3
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: copy ? copy.accent : accent }}
          >
            {copy ? copy.title : "Atom overview"}
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
          </>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-muted">
            A {element.name} atom holds {protons} proton
            {protons === 1 ? "" : "s"} and {neutrons} neutron
            {neutrons === 1 ? "" : "s"} in its nucleus, encircled by {electrons}{" "}
            electron{electrons === 1 ? "" : "s"} across {shells.length} shell
            {shells.length === 1 ? "" : "s"}. Tap any particle in the model to
            learn what it does.
          </p>
        )}
      </div>

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
          The nucleus shows a representative cluster for clarity and performance.
          Counts above are the true values for {element.name}.
        </p>
      )}
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
