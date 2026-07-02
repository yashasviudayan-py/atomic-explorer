"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lesson } from "@/types/lesson";
import { isLessonComplete } from "@/lib/lessonProgress";
import { DIFFICULTY_META } from "./learnTheme";
import { LessonStepper } from "./LessonStepper";
import { RelatedElements } from "./RelatedElements";

interface LessonPageProps {
  lesson: Lesson;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
}

/**
 * Full lesson experience: breadcrumb, lesson header (difficulty, time, tags),
 * the interactive stepper, related elements, and prev/next lesson navigation.
 * The "Completed" badge reads localStorage after mount only, so server and
 * first client render always match.
 */
export function LessonPage({ lesson, previousLesson, nextLesson }: LessonPageProps) {
  const difficulty = DIFFICULTY_META[lesson.difficulty];
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(isLessonComplete(lesson.slug));
  }, [lesson.slug]);

  return (
    <article className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Ambient difficulty-tinted glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem] opacity-30"
        style={{
          background: `radial-gradient(56rem 26rem at 50% -10%, ${difficulty.accent}22, transparent 70%)`,
        }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted">
        <Link href="/learn" className="transition-colors hover:text-foreground">
          Learn
        </Link>
        <span aria-hidden="true" className="text-muted/50">
          /
        </span>
        <span className="truncate text-foreground">{lesson.title}</span>
      </nav>

      {/* Lesson header */}
      <header className="glass-panel relative mt-5 overflow-hidden rounded-3xl p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-25 blur-3xl"
          style={{ background: difficulty.accent }}
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs text-muted">
              Lesson {lesson.order}
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${difficulty.border} ${difficulty.bg} ${difficulty.text}`}
            >
              {difficulty.label}
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted">
              ~{lesson.estimatedMinutes} min
            </span>
            {completed && (
              <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                ✓ Completed
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {lesson.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {lesson.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[0.65rem] uppercase tracking-wide text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Interactive stepper */}
      <section className="mt-8">
        <LessonStepper lesson={lesson} nextLesson={nextLesson} />
      </section>

      {/* Related elements */}
      <div className="mt-8">
        <RelatedElements symbols={lesson.relatedElementSymbols} />
      </div>

      {/* Lesson-to-lesson navigation */}
      <nav
        aria-label="Lesson navigation"
        className="mt-8 grid gap-3 sm:grid-cols-3"
      >
        {previousLesson ? (
          <Link
            href={`/learn/${previousLesson.slug}`}
            className="glass-panel group rounded-2xl p-4 transition-all hover:border-white/20"
          >
            <span className="text-[0.65rem] uppercase tracking-wide text-muted">
              ← Previous lesson
            </span>
            <span className="mt-1 block truncate text-sm font-semibold text-foreground group-hover:text-accent">
              {previousLesson.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        <Link
          href="/learn"
          className="glass-panel group flex items-center justify-center rounded-2xl p-4 text-sm font-semibold text-muted transition-all hover:border-white/20 hover:text-foreground"
        >
          All lessons
        </Link>
        {nextLesson ? (
          <Link
            href={`/learn/${nextLesson.slug}`}
            className="glass-panel group rounded-2xl p-4 text-right transition-all hover:border-white/20"
          >
            <span className="text-[0.65rem] uppercase tracking-wide text-muted">
              Next lesson →
            </span>
            <span className="mt-1 block truncate text-sm font-semibold text-foreground group-hover:text-accent">
              {nextLesson.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </nav>
    </article>
  );
}
