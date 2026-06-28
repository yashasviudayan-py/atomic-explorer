"use client";

import { Html } from "@react-three/drei";
import { getElectronShellRadius } from "./atomUtils";

interface AtomLabelsProps {
  /** Total number of electron shells, used to place the outer labels. */
  shellCount: number;
}

interface LabelDef {
  text: string;
  position: [number, number, number];
  accent: string;
}

/**
 * Floating Drei `Html` annotations identifying the key parts of the atom.
 * Rendered only when labels are enabled. Dark translucent chips with subtle
 * accent borders keep them readable on OLED black without cluttering the scene.
 */
export function AtomLabels({ shellCount }: AtomLabelsProps) {
  const outerRadius = getElectronShellRadius(Math.max(0, shellCount - 1));

  const labels: LabelDef[] = [
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
