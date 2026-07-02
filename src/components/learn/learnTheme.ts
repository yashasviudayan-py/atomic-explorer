import type { LessonDifficulty, LessonStepType } from "@/types/lesson";

/**
 * Presentation metadata shared across Learn Mode components.
 *
 * Mirrors the approach of `elementCategories.ts`: low-luminance tints over the
 * OLED backdrop with one saturated accent per difficulty, so cards, badges,
 * and progress UI stay consistent.
 */

export interface DifficultyMeta {
  label: string;
  /** Badge text color. */
  text: string;
  /** Badge border tint. */
  border: string;
  /** Badge background tint. */
  bg: string;
  /** Raw accent hex for inline glows and progress accents. */
  accent: string;
}

export const DIFFICULTY_META: Record<LessonDifficulty, DifficultyMeta> = {
  beginner: {
    label: "Beginner",
    text: "text-cyan-300",
    border: "border-cyan-400/30",
    bg: "bg-cyan-400/10",
    accent: "#22d3ee",
  },
  intermediate: {
    label: "Intermediate",
    text: "text-violet-300",
    border: "border-violet-400/30",
    bg: "bg-violet-400/10",
    accent: "#a78bfa",
  },
  advanced: {
    label: "Advanced",
    text: "text-pink-300",
    border: "border-pink-400/30",
    bg: "bg-pink-400/10",
    accent: "#f472b6",
  },
};

/** Short label shown as an eyebrow on each lesson step card. */
export const STEP_TYPE_LABELS: Record<LessonStepType, string> = {
  concept: "Concept",
  visual: "Visual",
  comparison: "Comparison",
  checkpoint: "Checkpoint",
  summary: "Summary",
};
