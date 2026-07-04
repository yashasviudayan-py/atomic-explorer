"use client";

import { Html } from "@react-three/drei";
import type { AtomicModelMode } from "./atomTypes";
import { getElectronShellRadius } from "./atomUtils";

interface AtomLabelsProps {
  /** Which model the labels should describe. */
  mode: AtomicModelMode;
  /** Total number of electron shells, used to place the outer Bohr labels. */
  shellCount: number;
  /** Outermost cloud radius, used to place the quantum labels. */
  orbitalRadius: number;
}

interface LabelDef {
  text: string;
  position: [number, number, number];
  accent: string;
}

/**
 * Floating Drei `Html` annotations identifying the key parts of the atom.
 * Deliberately minimal: only the essential labels per model, placed away from
 * the nucleus so they never cover the atom. Small dark-glass capsules with a
 * hairline border and an accent dot keep them quiet on OLED black.
 */
export function AtomLabels({ mode, shellCount, orbitalRadius }: AtomLabelsProps) {
  const labels: LabelDef[] =
    mode === "quantum"
      ? [
          {
            text: "Nucleus",
            position: [0, orbitalRadius * 0.28, 0],
            accent: "#ff8fa8",
          },
          {
            text: "Probability cloud",
            position: [0, orbitalRadius * 0.72, orbitalRadius * 0.5],
            accent: "#9fe0ff",
          },
          {
            text: "Orbital region",
            position: [orbitalRadius * 0.95, -orbitalRadius * 0.2, 0],
            accent: "#a9a6ff",
          },
        ]
      : bohrLabels(shellCount);

  return (
    <>
      {labels.map((label) => (
        <Html
          key={label.text}
          position={label.position}
          center
          distanceFactor={14}
          zIndexRange={[20, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              padding: "3px 10px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.01em",
              color: "#f5f5f7",
              background: "rgba(0, 0, 0, 0.72)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "9999px",
                background: label.accent,
                flexShrink: 0,
              }}
            />
            {label.text}
          </div>
        </Html>
      ))}
    </>
  );
}

/** Bohr-model essentials: nucleus, electron, and shell — placed clear of the
 * nucleus cluster (protons/neutrons are explained on click instead). */
function bohrLabels(shellCount: number): LabelDef[] {
  const outerRadius = getElectronShellRadius(Math.max(0, shellCount - 1));
  return [
    { text: "Nucleus", position: [0, 1.6, 0], accent: "#ff8fa8" },
    {
      text: "Electron",
      position: [0, outerRadius * 0.55, outerRadius * 0.85],
      accent: "#eaf6ff",
    },
    {
      text: "Electron shell",
      position: [outerRadius + 0.5, -0.3, 0],
      accent: "#64d2ff",
    },
  ];
}
