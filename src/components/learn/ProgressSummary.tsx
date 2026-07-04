"use client";

import Link from "next/link";
import type { Lesson } from "@/types/lesson";
import { Check, ChevronRight } from "@/components/ui/Icon";

interface ProgressSummaryProps {
  totalLessons: number;
  completedCount: number;
  /** Suggested next lesson (first incomplete), or null when all are done. */
  nextLesson: Lesson | null;
  /** False until localStorage has been read on the client. */
  loaded: boolean;
}

/**
 * Glass progress card for the learning hub: a conic-gradient progress ring,
 * completed/total counts, the suggested next lesson, and a short motivational
 * line. Renders a neutral zero state until client progress has loaded, so
 * server and client markup match.
 */
export function ProgressSummary({
  totalLessons,
  completedCount,
  nextLesson,
  loaded,
}: ProgressSummaryProps) {
  const pct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const allDone = loaded && completedCount >= totalLessons && totalLessons > 0;

  const motivation = !loaded
    ? "Loading your progress…"
    : allDone
      ? "Path complete. You can read the periodic table like a map now."
      : completedCount === 0
        ? "Seven lessons from “what is an atom” to reading the whole periodic table."
        : `Momentum looks good — ${totalLessons - completedCount} lesson${
            totalLessons - completedCount === 1 ? "" : "s"
          } to go.`;

  return (
    <div className="glass-panel relative overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="relative flex items-center gap-5">
        {/* Progress ring */}
        <div
          className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(var(--color-accent) ${pct * 3.6}deg, rgba(255,255,255,0.07) 0deg)`,
          }}
          role="img"
          aria-label={`${pct}% of lessons complete`}
        >
          <div className="flex h-[4.1rem] w-[4.1rem] flex-col items-center justify-center rounded-full bg-space-950">
            <span className="font-mono text-lg font-bold text-foreground">
              {pct}%
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Your progress
          </h2>
          <p className="mt-1 text-lg font-bold text-foreground">
            {completedCount} of {totalLessons} lessons
            {allDone && (
              <Check className="ml-2 inline h-4 w-4 text-emerald-300 align-[-0.15em]" />
            )}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{motivation}</p>
        </div>
      </div>

      {nextLesson && loaded && !allDone && (
        <Link
          href={`/learn/${nextLesson.slug}`}
          className="group relative mt-4 flex items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent/[0.07] px-4 py-3 transition-all hover:bg-accent/15"
        >
          <span className="min-w-0">
            <span className="block text-[0.65rem] uppercase tracking-wide text-accent">
              {completedCount === 0 ? "Start here" : "Continue with"}
            </span>
            <span className="block truncate text-sm font-semibold text-foreground">
              {nextLesson.title}
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-accent transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
