/**
 * Simple localStorage-backed lesson progress for Learn Mode.
 *
 * No backend, no auth: completion is a set of lesson slugs stored under one
 * key. Every function is safe to call during SSR (returns empty progress) and
 * safe when localStorage is unavailable or corrupted (fails quietly), so the
 * app never breaks on storage errors. Client components must still read
 * progress inside `useEffect` to avoid hydration mismatches.
 */

const STORAGE_KEY = "atomic-explorer:lesson-progress";

export interface LessonProgress {
  /** Slugs of completed lessons, in the order they were completed. */
  completedSlugs: string[];
}

const EMPTY_PROGRESS: LessonProgress = { completedSlugs: [] };

/** True when we're in a browser with a usable localStorage. */
function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Read and validate stored progress; empty progress on any failure. */
export function getLessonProgress(): LessonProgress {
  if (!canUseStorage()) return EMPTY_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      Array.isArray((parsed as LessonProgress).completedSlugs)
    ) {
      const slugs = (parsed as LessonProgress).completedSlugs.filter(
        (slug): slug is string => typeof slug === "string",
      );
      return { completedSlugs: slugs };
    }
    return EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

/** Persist a lesson as complete (idempotent; quietly no-ops on failure). */
export function markLessonComplete(slug: string): void {
  if (!canUseStorage()) return;
  try {
    const progress = getLessonProgress();
    if (progress.completedSlugs.includes(slug)) return;
    const updated: LessonProgress = {
      completedSlugs: [...progress.completedSlugs, slug],
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage may be full or blocked (e.g. private mode) — progress is a
    // nice-to-have, so the lesson flow continues without it.
  }
}

/** Whether a specific lesson has been completed. */
export function isLessonComplete(slug: string): boolean {
  return getLessonProgress().completedSlugs.includes(slug);
}

/** How many lessons have been completed. */
export function getCompletedLessonCount(): number {
  return getLessonProgress().completedSlugs.length;
}

/** Completion percentage (0–100, rounded) against a total lesson count. */
export function getProgressPercentage(totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  const completed = Math.min(getCompletedLessonCount(), totalLessons);
  return Math.round((completed / totalLessons) * 100);
}
