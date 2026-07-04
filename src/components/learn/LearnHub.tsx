"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getSortedLessons } from "@/data/lessons";
import { getLessonProgress } from "@/lib/lessonProgress";
import { ChevronRight } from "@/components/ui/Icon";
import { LearningPath } from "./LearningPath";
import { ProgressSummary } from "./ProgressSummary";

/**
 * The interactive learning hub body: progress summary, course-map learning
 * path, and cross-links into the rest of the app.
 *
 * Progress is read from localStorage in an effect (never during render), so
 * the server-rendered markup and the first client render always agree; the
 * completion badges appear right after mount.
 */
export function LearnHub() {
  const lessons = useMemo(() => getSortedLessons(), []);
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  // localStorage is client-only, so we read progress after mount. The extra
  // render is intentional and keeps server/first-client markup in agreement.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompletedSlugs(getLessonProgress().completedSlugs);
    setLoaded(true);
  }, []);

  const nextLesson =
    lessons.find((lesson) => !completedSlugs.includes(lesson.slug)) ?? null;

  return (
    <div className="page-shell grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      {/* Course map */}
      <section aria-label="Learning path">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Learning path
          </h2>
          <span className="text-xs uppercase tracking-wide text-muted">
            {lessons.length} lessons
          </span>
        </div>
        <LearningPath
          lessons={lessons}
          completedSlugs={completedSlugs}
          recommendedSlug={loaded ? (nextLesson?.slug ?? null) : null}
        />
      </section>

      {/* Sidebar: progress + explore links */}
      <aside className="space-y-4 lg:sticky lg:top-24">
        <ProgressSummary
          totalLessons={lessons.length}
          completedCount={completedSlugs.length}
          nextLesson={nextLesson}
          loaded={loaded}
        />

        <div className="glass-panel rounded-2xl p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Keep exploring
          </h2>
          <div className="mt-3 space-y-2.5">
            <Link
              href="/elements"
              className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all hover:border-accent/40 hover:bg-accent/[0.07]"
            >
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Periodic table
                </span>
                <span className="block text-xs text-muted">
                  All 118 elements, interactive
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted transition-all duration-300 ease-spring group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>
            <Link
              href="/compare"
              className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all hover:border-accent/40 hover:bg-accent/[0.07]"
            >
              <span>
                <span className="block text-sm font-semibold text-foreground">
                  Compare elements
                </span>
                <span className="block text-xs text-muted">
                  Side-by-side atomic structure
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted transition-all duration-300 ease-spring group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
