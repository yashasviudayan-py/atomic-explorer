"use client";

import Link from "next/link";
import type { Lesson } from "@/types/lesson";
import { DIFFICULTY_META } from "./learnTheme";

interface LessonCardProps {
  lesson: Lesson;
  /** Whether the user has completed this lesson (from localStorage). */
  isComplete: boolean;
  /** True when this is the suggested next lesson in the path. */
  isRecommended: boolean;
}

/**
 * One lesson in the course map: order number, title, description, difficulty
 * and time badges, tags, related element symbols, and completion state. The
 * whole card links to the lesson page.
 */
export function LessonCard({ lesson, isComplete, isRecommended }: LessonCardProps) {
  const difficulty = DIFFICULTY_META[lesson.difficulty];

  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className={`glass-panel group relative block overflow-hidden rounded-2xl p-5 transition-all hover:-translate-y-0.5 sm:p-6 ${
        isRecommended
          ? "border-accent/40 shadow-[0_0_32px_-10px_var(--color-accent)]"
          : "hover:border-white/20"
      }`}
      style={{ borderColor: isComplete ? "rgba(52,211,153,0.3)" : undefined }}
    >
      {/* Hover glow tinted by difficulty */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-25"
        style={{ background: difficulty.accent }}
      />

      <div className="relative flex items-start gap-4">
        {/* Order node */}
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-semibold ${
            isComplete
              ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
              : isRecommended
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-white/15 bg-white/[0.04] text-muted"
          }`}
        >
          {isComplete ? "✓" : lesson.order}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-accent sm:text-lg">
              {lesson.title}
            </h3>
            {isRecommended && !isComplete && (
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-accent">
                Up next
              </span>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            {lesson.description}
          </p>

          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium ${difficulty.border} ${difficulty.bg} ${difficulty.text}`}
            >
              {difficulty.label}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[0.65rem] text-muted">
              ~{lesson.estimatedMinutes} min
            </span>
            {lesson.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-muted/80"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Related elements + CTA */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {lesson.relatedElementSymbols.map((symbol) => (
                <span
                  key={symbol}
                  className="flex h-7 min-w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] px-1 font-mono text-[0.65rem] font-semibold text-foreground/80"
                >
                  {symbol}
                </span>
              ))}
            </div>
            <span
              className={`shrink-0 text-sm font-semibold transition-transform group-hover:translate-x-0.5 ${
                isComplete ? "text-emerald-300" : "text-accent"
              }`}
            >
              {isComplete ? "Review →" : isRecommended ? "Continue →" : "Start lesson →"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
