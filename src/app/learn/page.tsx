import type { Metadata } from "next";
import { LearnHub } from "@/components/learn/LearnHub";
import { OriginsCta } from "@/components/origins/OriginsCta";

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
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] opacity-30"
        style={{
          background:
            "radial-gradient(48rem 24rem at 50% -12%, rgba(10,132,255,0.12), transparent 70%)",
        }}
      />

      {/* Hero */}
      <header className="page-shell">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-cyan">
          Learn Mode
        </span>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Learn Atomic Structure
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
          Master elements, particles, isotopes, electron shells, and quantum
          orbitals through guided visual lessons.
        </p>
      </header>

      {/* Progress + course map */}
      <div className="mt-10">
        <LearnHub />
      </div>

      {/* Where the elements themselves came from. */}
      <div className="page-shell mt-12">
        <OriginsCta description="Once you know what atoms are made of, find out where they were made — from the Big Bang to neutron star collisions." />
      </div>
    </div>
  );
}
