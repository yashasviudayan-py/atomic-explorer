import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LESSONS, getAdjacentLessons, getLessonBySlug } from "@/data/lessons";
import { LessonPage } from "@/components/learn/LessonPage";

interface LessonRouteProps {
  // App Router (Next 15+): dynamic route params are async.
  params: Promise<{ slug: string }>;
}

/** Pre-render a static page for every lesson. */
export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: LessonRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    return { title: "Lesson not found" };
  }
  return {
    title: `${lesson.title} · Learn`,
    description: lesson.description,
  };
}

export default async function LessonRoute({ params }: LessonRouteProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const { previous, next } = getAdjacentLessons(lesson.slug);

  return (
    <LessonPage lesson={lesson} previousLesson={previous} nextLesson={next} />
  );
}
