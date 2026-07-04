import Link from "next/link";
import { APP_TAGLINE } from "@/lib/constants";
import { AtomPreview } from "@/components/home/AtomPreview";
import { ChevronRight } from "@/components/ui/Icon";

/**
 * Landing hero: headline, supporting copy, primary/secondary CTAs, and the
 * animated atom preview alongside. Two-column on large screens, stacked on
 * mobile.
 */
export function HeroSection() {
  return (
    <section className="page-shell relative grid items-center gap-12 pt-16 pb-20 lg:grid-cols-2 lg:gap-8 lg:pt-24 lg:pb-28">
      <div className="text-center lg:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-cyan">
          Interactive science simulation
        </span>

        <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {APP_TAGLINE}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-secondary sm:text-lg lg:mx-0">
          Click any element to inspect its atomic structure in vivid detail.
          Explore the dance of protons, neutrons, and electrons across their
          shells — and understand the building blocks of everything.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <Link
            href="/elements"
            className="group inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2b95ff] sm:w-auto"
          >
            Explore Elements
            <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/learn"
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-white/25 hover:bg-white/10 sm:w-auto"
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
