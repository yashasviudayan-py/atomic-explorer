"use client";

import Link from "next/link";
import type { Lesson } from "@/types/lesson";
import { getElementBySymbol } from "@/data/elements";

interface LessonCompletionCardProps {
  lesson: Lesson;
  /** The next lesson in the path, if any. */
  nextLesson: Lesson | null;
  /** Jump back to the first step to review the lesson. */
  onReview: () => void;
}

/**
 * Shown after the final step: confirms completion, recaps what the lesson
 * covered (its concept/comparison step titles), and routes the user onward —
 * next lesson, a related element, or back to the hub.
 */
export function LessonCompletionCard({
  lesson,
  nextLesson,
  onReview,
}: LessonCompletionCardProps) {
  const covered = lesson.steps
    .filter((step) => step.type === "concept" || step.type === "comparison")
    .map((step) => step.title);
  const featured = getElementBySymbol(lesson.relatedElementSymbols[0] ?? "");

  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl p-6 sm:p-8">
      {/* Celebration glow, kept restrained */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-25 blur-3xl"
        style={{ background: "#34d399" }}
      />

      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
        <span aria-hidden="true">✓</span> Lesson complete
      </span>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {lesson.title} — done.
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
        Your progress is saved on this device. Here&apos;s what you covered:
      </p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {covered.map((title) => (
          <li
            key={title}
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-sm text-foreground/85"
          >
            <span aria-hidden="true" className="text-emerald-300">
              ✓
            </span>
            {title}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        {nextLesson ? (
          <Link
            href={`/learn/${nextLesson.slug}`}
            className="rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-semibold text-accent shadow-[0_0_20px_-6px_var(--color-accent)] transition-all hover:bg-accent/20"
          >
            Next lesson: {nextLesson.title} →
          </Link>
        ) : (
          <Link
            href="/compare"
            className="rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-semibold text-accent shadow-[0_0_20px_-6px_var(--color-accent)] transition-all hover:bg-accent/20"
          >
            You finished the path — open the Compare lab →
          </Link>
        )}
        {featured && (
          <Link
            href={`/elements/${featured.symbol.toLowerCase()}`}
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-white/25 hover:bg-white/10"
          >
            Explore {featured.name} in 3D
          </Link>
        )}
        <Link
          href="/learn"
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-white/25 hover:bg-white/10"
        >
          Back to learning hub
        </Link>
        <button
          type="button"
          onClick={onReview}
          className="rounded-xl px-5 py-3 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          Review this lesson
        </button>
      </div>
    </div>
  );
}
