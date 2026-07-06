import Link from "next/link";
import { LivingAtom } from "@/components/home/LivingAtom";
import { ChevronRight } from "@/components/ui/Icon";

/**
 * Landing hero: headline, supporting copy, primary/secondary CTAs, and the
 * animated living atom alongside. Two-column on large screens, stacked on
 * mobile.
 *
 * Content rises in on a short staggered cascade (see `.reveal` + per-element
 * `animationDelay`). The headline text matches APP_TAGLINE verbatim, but is
 * composed inline here so two key phrases can carry the gradient shimmer.
 */
export function HeroSection() {
  return (
    <section className="page-shell relative grid items-center gap-8 pt-14 pb-10 lg:grid-cols-2 lg:gap-10 lg:pt-20 lg:pb-16">
      {/* Soft dark scrim behind the copy so text stays legible over the
          animated field, fading out toward the atom side. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[1] lg:right-1/3"
        style={{
          background:
            "radial-gradient(120% 90% at 20% 40%, rgba(0,0,0,0.72), rgba(0,0,0,0.35) 45%, transparent 75%)",
        }}
      />

      <div className="text-center lg:text-left">
        <span
          className="reveal hero-eyebrow inline-block text-xs font-semibold uppercase"
          style={{ animationDelay: "0.05s" }}
        >
          Interactive science simulation
        </span>

        <h1
          className="reveal hero-headline mt-5 text-4xl sm:text-5xl lg:text-[4.1rem]"
          style={{ animationDelay: "0.15s" }}
        >
          Explore Matter from the{" "}
          <span className="hero-accent">Periodic Table</span> to the{" "}
          <span className="hero-accent">Atomic Core</span>
        </h1>

        <p
          className="reveal mx-auto mt-6 max-w-xl text-base leading-relaxed text-secondary sm:text-lg lg:mx-0"
          style={{ animationDelay: "0.3s" }}
        >
          Click any element to inspect its atomic structure in vivid detail.
          Explore the dance of protons, neutrons, and electrons across their
          shells — and understand the building blocks of everything.
        </p>

        <div
          className="reveal mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          style={{ animationDelay: "0.45s" }}
        >
          <Link
            href="/elements"
            className="cta-primary group inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-7 py-3.5 text-sm font-semibold text-white sm:w-auto"
          >
            Explore Elements
            <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/learn"
            className="cta-secondary inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur hover:border-white/30 hover:bg-white/10 sm:w-auto"
          >
            Start Learning
          </Link>
        </div>
      </div>

      <div
        className="reveal flex justify-center"
        style={{ animationDelay: "0.25s" }}
      >
        <LivingAtom />
      </div>
    </section>
  );
}
