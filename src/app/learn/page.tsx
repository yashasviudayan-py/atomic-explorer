import type { Metadata } from "next";
import { LearnHub } from "@/components/learn/LearnHub";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Master elements, particles, isotopes, electron shells, and quantum orbitals through guided visual lessons — a step-by-step learning path through atomic structure.",
};

/**
 * Learning hub: a static hero rendered on the server, with the interactive
 * course map (progress-aware) rendered by the client-side LearnHub.
 */
export default function LearnPage() {
  return (
    <div className="relative py-12 lg:py-16">
      {/* Ambient nebula glow anchoring the hub against OLED black */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] opacity-40"
        style={{
          background:
            "radial-gradient(38rem 22rem at 25% -10%, rgba(56,189,248,0.16), transparent 70%)," +
            "radial-gradient(38rem 22rem at 75% -10%, rgba(168,85,247,0.16), transparent 70%)",
        }}
      />

      {/* Hero */}
      <header className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Learn Mode
        </span>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Learn Atomic Structure
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Master elements, particles, isotopes, electron shells, and quantum
          orbitals through guided visual lessons.
        </p>
      </header>

      {/* Progress + course map */}
      <div className="mt-10">
        <LearnHub />
      </div>
    </div>
  );
}
