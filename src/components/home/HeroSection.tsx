import Link from "next/link";
import { APP_TAGLINE } from "@/lib/constants";
import { AtomPreview } from "@/components/home/AtomPreview";

/**
 * Landing hero: headline, supporting copy, primary/secondary CTAs, and the
 * animated atom preview alongside. Two-column on large screens, stacked on
 * mobile.
 */
export function HeroSection() {
  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="text-center lg:text-left">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Interactive science simulation
        </span>

        <h1 className="mt-6 bg-gradient-to-br from-white via-white to-accent/70 bg-clip-text text-4xl font-bold leading-[1.1] tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          {APP_TAGLINE}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg lg:mx-0">
          Click any element to inspect its atomic structure in vivid detail.
          Explore the dance of protons, neutrons, and electrons across their
          shells — and understand the building blocks of everything.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <Link
            href="/elements"
            className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-space-950 shadow-[0_0_30px_-8px_var(--color-accent)] transition-all hover:shadow-[0_0_40px_-4px_var(--color-accent)] sm:w-auto"
          >
            Explore Elements
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <Link
            href="/learn"
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-all hover:border-white/25 hover:bg-white/10 sm:w-auto"
          >
            Start Learning
          </Link>
        </div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <AtomPreview />
      </div>
    </section>
  );
}
