"use client";

import type { Lesson } from "@/types/lesson";
import { LessonCard } from "./LessonCard";

interface LearningPathProps {
  /** Lessons already sorted by `order`. */
  lessons: Lesson[];
  completedSlugs: string[];
  /** Slug of the suggested next lesson (first incomplete), if any. */
  recommendedSlug: string | null;
}

/**
 * Course-map layout: lesson cards stacked along a vertical orbital path line.
 * Each node on the line reflects completion; the connecting segment fills in
 * as the user progresses.
 */
export function LearningPath({
  lessons,
  completedSlugs,
  recommendedSlug,
}: LearningPathProps) {
  return (
    <ol className="relative space-y-5">
      {/* Connecting path line */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-[2.1rem] top-8 hidden w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent sm:block"
      />
      {lessons.map((lesson) => (
        <li key={lesson.slug} className="relative">
          <LessonCard
            lesson={lesson}
            isComplete={completedSlugs.includes(lesson.slug)}
            isRecommended={lesson.slug === recommendedSlug}
          />
        </li>
      ))}
    </ol>
  );
}
