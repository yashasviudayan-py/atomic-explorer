"use client";

import type { LessonStep } from "@/types/lesson";
import { Check, Close } from "@/components/ui/Icon";

interface LessonCheckpointProps {
  checkpoint: NonNullable<LessonStep["checkpoint"]>;
  /** Currently selected option id, or null when unanswered. */
  selectedOptionId: string | null;
  /** Called when the user picks an option (once picked, the answer locks). */
  onSelect: (optionId: string) => void;
}

/**
 * Multiple-choice checkpoint inside a lesson step.
 *
 * State lives in the stepper (keyed by step id) so answers survive moving
 * back/forward between steps but never leak into other checkpoints. Once an
 * option is picked the answer locks, feedback colors the options, and the
 * selected option's explanation appears — the stepper's Next button remains
 * the only way to advance.
 */
export function LessonCheckpoint({
  checkpoint,
  selectedOptionId,
  onSelect,
}: LessonCheckpointProps) {
  const answered = selectedOptionId !== null;
  const selected = checkpoint.options.find(
    (option) => option.id === selectedOptionId,
  );

  return (
    <div className="mt-5">
      <p className="text-base font-semibold text-foreground">
        {checkpoint.question}
      </p>

      <div className="mt-4 space-y-2.5" role="radiogroup" aria-label={checkpoint.question}>
        {checkpoint.options.map((option) => {
          const isSelected = option.id === selectedOptionId;
          // After answering: highlight the pick, and softly reveal the correct
          // answer if the pick was wrong.
          let stateClasses =
            "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]";
          if (answered) {
            if (isSelected && option.isCorrect) {
              stateClasses = "border-emerald-400/50 bg-emerald-400/10";
            } else if (isSelected && !option.isCorrect) {
              stateClasses = "border-rose-400/50 bg-rose-400/10";
            } else if (option.isCorrect) {
              stateClasses = "border-emerald-400/30 bg-emerald-400/5";
            } else {
              stateClasses = "border-white/5 bg-white/[0.01] opacity-60";
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={answered}
              onClick={() => onSelect(option.id)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm text-foreground transition-all disabled:cursor-default ${stateClasses}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-semibold uppercase ${
                  answered && option.isCorrect
                    ? "border-emerald-400/60 text-emerald-300"
                    : answered && isSelected
                      ? "border-rose-400/60 text-rose-300"
                      : "border-white/20 text-muted"
                }`}
              >
                {answered && option.isCorrect ? (
                  <Check className="h-3.5 w-3.5" />
                ) : answered && isSelected ? (
                  <Close className="h-3.5 w-3.5" />
                ) : (
                  option.id.toUpperCase()
                )}
              </span>
              {option.text}
            </button>
          );
        })}
      </div>

      {/* Explanation for the selected option */}
      {selected && (
        <div
          className={`glass-panel mt-4 rounded-xl border p-4 ${
            selected.isCorrect ? "border-emerald-400/30" : "border-amber-400/30"
          }`}
        >
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              selected.isCorrect ? "text-emerald-300" : "text-amber-300"
            }`}
          >
            {selected.isCorrect ? "Correct" : "Not quite"}
          </span>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
            {selected.explanation}
          </p>
        </div>
      )}

      {!answered && (
        <p className="mt-3 text-xs text-muted">
          Pick an answer to see the explanation, then continue.
        </p>
      )}
    </div>
  );
}
