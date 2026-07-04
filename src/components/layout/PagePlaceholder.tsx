import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft } from "@/components/ui/Icon";

interface PagePlaceholderProps {
  /** Small label shown above the title (e.g. section/breadcrumb). */
  eyebrow: string;
  title: string;
  description: string;
  /** Optional list of features coming to this page, shown as a checklist. */
  upcoming?: string[];
  /** Optional extra content rendered below the description. */
  children?: ReactNode;
}

/**
 * Consistent placeholder scaffold for routes whose full experience ships in a
 * later phase. Keeps every stub page visually aligned with the landing page.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  description,
  upcoming,
  children,
}: PagePlaceholderProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {eyebrow}
      </span>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {description}
      </p>

      {upcoming && upcoming.length > 0 && (
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {upcoming.map((item) => (
            <li
              key={item}
              className="glass-panel flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm text-foreground"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}

      {children}

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-white/25 hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" /> Back home
        </Link>
        <Link
          href="/elements"
          className="inline-flex items-center rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-semibold text-accent transition-all hover:bg-accent/20"
        >
          Explore Elements
        </Link>
      </div>
    </section>
  );
}
