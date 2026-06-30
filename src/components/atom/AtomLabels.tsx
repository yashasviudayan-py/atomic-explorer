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
 * Floating Drei `Html` annotations identifying the key parts of the atom. The
 * label set adapts to the active model: Bohr labels name the proton, neutron,
 * electron and shell; quantum labels name the nucleus, probability cloud and
 * orbital region, plus a short reminder that denser regions are simply more
 * likely electron locations. Dark translucent chips keep them readable on OLED
 * black without cluttering the scene.
 */
export function AtomLabels({ mode, shellCount, orbitalRadius }: AtomLabelsProps) {
  const labels: LabelDef[] =
    mode === "quantum"
      ? [
          { text: "Nucleus", position: [0, 1.5, 0], accent: "#ff9bb4" },
          {
            text: "Probability cloud",
            position: [0, orbitalRadius * 0.62, orbitalRadius * 0.55],
            accent: "#7fe8ff",
          },
          {
            text: "Orbital region",
            position: [orbitalRadius * 0.78, 0.1, 0],
            accent: "#b9a8ff",
          },
          {
            text: "Denser = more likely electron location",
            position: [0, -orbitalRadius * 0.7, 0],
            accent: "#9ec5ff",
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
              whiteSpace: "nowrap",
              padding: "3px 10px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "#e7ecff",
              background: "rgba(5, 6, 15, 0.72)",
              border: `1px solid ${label.accent}66`,
              boxShadow: `0 0 14px -4px ${label.accent}aa`,
              backdropFilter: "blur(6px)",
            }}
          >
            <span style={{ color: label.accent }}>●</span> {label.text}
          </div>
        </Html>
      ))}
    </>
  );
}

/** Bohr-model labels: nucleus, proton, neutron, electron and shell. */
function bohrLabels(shellCount: number): LabelDef[] {
  const outerRadius = getElectronShellRadius(Math.max(0, shellCount - 1));
  return [
    { text: "Nucleus", position: [0, 1.5, 0], accent: "#ff9bb4" },
    { text: "Proton", position: [1.4, -0.2, 0.4], accent: "#ff5d7e" },
    { text: "Neutron", position: [-1.5, 0.2, -0.4], accent: "#5fc8ff" },
    {
      text: "Electron",
      position: [0, outerRadius * 0.55, outerRadius * 0.85],
      accent: "#cdeeff",
    },
    {
      text: "Electron shell",
      position: [outerRadius + 0.4, 0.1, 0],
      accent: "#6fd6ff",
    },
  ];
}
