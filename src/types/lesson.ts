/**
 * Lesson domain types for Atomic Explorer's Learn Mode.
 *
 * Lessons are fully local, typed content: an ordered set of steps a user walks
 * through one at a time. Steps can carry a visual companion (rendered by
 * `LessonVisualPanel`) and optional multiple-choice checkpoints. All content is
 * written as an *educational model* — simplified on purpose and honest about it.
 */

/** Coarse difficulty tier shown as a badge on lesson cards and pages. */
export type LessonDifficulty = "beginner" | "intermediate" | "advanced";

/** What role a step plays inside a lesson's flow. */
export type LessonStepType =
  | "concept"
  | "visual"
  | "comparison"
  | "checkpoint"
  | "summary";

/**
 * Which lightweight visual companion a step requests. Each hint maps to a
 * cheap CSS/SVG visual in `LessonVisualPanel` — never a full 3D viewer.
 */
export type LessonVisualHint =
  | "atom-overview"
  | "particle-diagram"
  | "periodic-tile"
  | "shell-distribution"
  | "isotope-comparison"
  | "bohr-vs-quantum";

/** One selectable answer in a checkpoint question. */
export type LessonQuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  /** Shown after the user picks this option — teaches even on wrong answers. */
  explanation: string;
};

/** A single screen in the lesson stepper. */
export type LessonStep = {
  id: string;
  type: LessonStepType;
  title: string;
  /** Body copy; blank lines (\n\n) split into paragraphs. */
  body: string;
  /** Requests a visual companion panel for this step. */
  visualHint?: LessonVisualHint;
  /** Element symbols the visual (and examples) should focus on. */
  relatedElementSymbols?: string[];
  /** Present only on `checkpoint` steps. */
  checkpoint?: {
    question: string;
    options: LessonQuizOption[];
  };
};

/** A complete lesson: metadata plus its ordered steps. */
export type Lesson = {
  slug: string;
  title: string;
  description: string;
  difficulty: LessonDifficulty;
  estimatedMinutes: number;
  /** 1-based position in the learning path. */
  order: number;
  tags: string[];
  /** Elements featured across the lesson, linked from the lesson page. */
  relatedElementSymbols: string[];
  steps: LessonStep[];
};
