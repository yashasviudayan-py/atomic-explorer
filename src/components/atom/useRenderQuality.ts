"use client";

import { useEffect, useState } from "react";

/**
 * Visual fidelity tier for the 3D atom, chosen from viewport width.
 *
 * This tunes only the *visual representation* — canvas DPR, star/point counts,
 * sphere tessellation, rendered-nucleon cap. It never changes the true particle
 * counts shown in the data panels (those always report reality).
 */
export type RenderQuality = "low" | "medium" | "high";

/** Per-tier knobs consumed across the atom scene. */
export interface QualityPreset {
  quality: RenderQuality;
  /** Max devicePixelRatio the Canvas is allowed to render at. */
  dprMax: number;
  /** Rendered-nucleon cap (data panels still show true counts). */
  nucleusCap: number;
  /** Point multiplier for the quantum probability clouds. */
  cloudDensity: number;
  /** Backdrop star count (0 disables the starfield). */
  starCount: number;
  /** Whether decorative objects (starfield) auto-rotate. */
  autoRotate: boolean;
  /** Sphere tessellation (width/height segments) for nucleons/electrons. */
  sphereSegments: number;
}

const PRESETS: Record<RenderQuality, QualityPreset> = {
  low: {
    quality: "low",
    dprMax: 1.25,
    nucleusCap: 48,
    cloudDensity: 0.32,
    starCount: 0,
    autoRotate: false,
    sphereSegments: 10,
  },
  medium: {
    quality: "medium",
    dprMax: 1.5,
    nucleusCap: 80,
    cloudDensity: 0.66,
    starCount: 700,
    autoRotate: true,
    sphereSegments: 14,
  },
  high: {
    quality: "high",
    dprMax: 1.75,
    nucleusCap: 80,
    cloudDensity: 1,
    starCount: 1400,
    autoRotate: true,
    sphereSegments: 16,
  },
};

function qualityForWidth(width: number): RenderQuality {
  if (width < 768) return "low";
  if (width < 1024) return "medium";
  return "high";
}

/**
 * Client-only render-quality preset derived from viewport width. Defaults to
 * `high` on the server / first paint, then corrects on mount, and updates on
 * resize so rotating a phone or resizing a window re-tunes the scene.
 */
export function useRenderQuality(): QualityPreset {
  const [quality, setQuality] = useState<RenderQuality>("high");

  useEffect(() => {
    const update = () => setQuality(qualityForWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return PRESETS[quality];
}
