"use client";

import type { LessonStep } from "@/types/lesson";
import { STEP_TYPE_LABELS } from "./learnTheme";
import { LessonCheckpoint } from "./LessonCheckpoint";

interface LessonStepCardProps {
  step: LessonStep;
  /** Checkpoint selection for this step (null = unanswered / not a checkpoint). */
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
}

/**
 * The main content card for the current lesson step: type eyebrow, title,
 * paragraph body, and — for checkpoint steps — the embedded quiz.
 */
export function LessonStepCard({
  step,
  selectedOptionId,
  onSelectOption,
}: LessonStepCardProps) {
  const paragraphs = step.body.split("\n\n").filter(Boolean);

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7">
      <span
        className={`text-xs font-semibold uppercase tracking-wider ${
          step.type === "checkpoint"
            ? "text-amber-300"
            : step.type === "summary"
              ? "text-emerald-300"
              : "text-accent"
        }`}
      >
        {STEP_TYPE_LABELS[step.type]}
      </span>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {step.title}
      </h2>

      <div className="mt-4 space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-sm leading-relaxed text-foreground/85 sm:text-base">
            {paragraph}
          </p>
        ))}
      </div>

      {step.type === "checkpoint" && step.checkpoint && (
        <LessonCheckpoint
          checkpoint={step.checkpoint}
          selectedOptionId={selectedOptionId}
          onSelect={onSelectOption}
        />
      )}
    </div>
  );
}
