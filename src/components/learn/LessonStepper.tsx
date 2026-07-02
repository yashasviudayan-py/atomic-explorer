"use client";

import { useCallback, useState } from "react";
import type { Lesson } from "@/types/lesson";
import { markLessonComplete } from "@/lib/lessonProgress";
import { LessonStepCard } from "./LessonStepCard";
import { LessonVisualPanel } from "./LessonVisualPanel";
import { LessonCompletionCard } from "./LessonCompletionCard";

interface LessonStepperProps {
  lesson: Lesson;
  nextLesson: Lesson | null;
}

/**
 * Walks the user through a lesson one step at a time.
 *
 * Checkpoint answers are keyed by step id, so navigating back shows the answer
 * already given while other checkpoints stay untouched. Checkpoint steps gate
 * the Next button until an option is picked — feedback shows immediately, but
 * advancing is always an explicit click. Finishing the last step marks the
 * lesson complete in localStorage and swaps in the completion card.
 */
export function LessonStepper({ lesson, nextLesson }: LessonStepperProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);

  const steps = lesson.steps;
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const selectedOptionId = answers[step.id] ?? null;
  const checkpointBlocked = step.type === "checkpoint" && selectedOptionId === null;

  const handleSelectOption = useCallback(
    (optionId: string) => {
      setAnswers((prev) =>
        prev[step.id] ? prev : { ...prev, [step.id]: optionId },
      );
    },
    [step.id],
  );

  const handleNext = () => {
    if (checkpointBlocked) return;
    if (isLast) {
      markLessonComplete(lesson.slug);
      setFinished(true);
      return;
    }
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  };

  const handleReview = () => {
    setFinished(false);
    setStepIndex(0);
    setAnswers({});
  };

  if (finished) {
    return (
      <LessonCompletionCard
        lesson={lesson}
        nextLesson={nextLesson}
        onReview={handleReview}
      />
    );
  }

  const progressPct = ((stepIndex + 1) / steps.length) * 100;
  const hasVisual = Boolean(step.visualHint);

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-4 flex items-center gap-4">
        <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted">
          Step {stepIndex + 1} of {steps.length}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-accent to-accent-violet transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Step content + visual companion, side by side on desktop */}
      <div
        className={`grid gap-4 ${hasVisual ? "lg:grid-cols-[3fr_2fr]" : ""}`}
      >
        <LessonStepCard
          key={step.id}
          step={step}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
        />
        {hasVisual && (
          <LessonVisualPanel
            step={step}
            fallbackSymbols={lesson.relatedElementSymbols}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStepIndex((index) => Math.max(index - 1, 0))}
          disabled={stepIndex === 0}
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-white/25 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/15 disabled:hover:bg-white/5"
        >
          ← Previous
        </button>

        {/* Step dots */}
        <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
          {steps.map((s, index) => (
            <span
              key={s.id}
              className={`h-1.5 rounded-full transition-all ${
                index === stepIndex
                  ? "w-5 bg-accent"
                  : index < stepIndex
                    ? "w-1.5 bg-accent/50"
                    : "w-1.5 bg-white/15"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={checkpointBlocked}
          title={checkpointBlocked ? "Answer the checkpoint to continue" : undefined}
          className="rounded-xl border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent shadow-[0_0_20px_-6px_var(--color-accent)] transition-all hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent/10"
        >
          {isLast ? "Finish lesson ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
}
