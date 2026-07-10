import Link from "next/link";
import { ORIGINS_CTA_LABEL } from "@/lib/constants";
import { ChevronRight } from "@/components/ui/Icon";

interface OriginsCtaProps {
  /** `band` is a full-width promo; `inline` is a quiet link for dense pages. */
  variant?: "band" | "inline";
  /** Override the supporting line for the page it sits on. */
  description?: string;
}

const DEFAULT_DESCRIPTION =
  "The universe began with hydrogen and helium. Follow the story of how stars, supernovae, and neutron star collisions forged everything else.";

/** Entry point into the /origins story, reused from the home, learn, and element pages. */
export function OriginsCta({
  variant = "band",
  description = DEFAULT_DESCRIPTION,
}: OriginsCtaProps) {
  if (variant === "inline") {
    return (
      <Link
        href="/origins"
        className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-cyan"
      >
        {ORIGINS_CTA_LABEL}
        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
      </Link>
    );
  }

  return (
    <Link
      href="/origins"
      className="elevate panel-solid group relative flex flex-col gap-5 overflow-hidden rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(30rem 14rem at 12% 0%, rgba(41,151,255,0.12), transparent 70%)",
        }}
      />
      <div className="relative min-w-0">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-cyan">
          The Cosmic Origin of Elements
        </span>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Every atom has a cosmic memory
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-secondary">
          {description}
        </p>
      </div>

      <span className="relative inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition-colors group-hover:border-white/30 group-hover:bg-white/10">
        {ORIGINS_CTA_LABEL}
        <ChevronRight className="h-4 w-4 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
