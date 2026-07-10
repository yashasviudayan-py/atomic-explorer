import type { ReactNode } from "react";

interface OriginCalloutProps {
  /** Short label, e.g. "A note on precision". */
  label: string;
  children: ReactNode;
  /** `note` for scientific caveats, `poetic` for the closing line. */
  tone?: "note" | "poetic";
}

/**
 * A framed aside. Used for the caveats that keep this story honest — where the
 * simplification is doing real work and the reader deserves to know.
 */
export function OriginCallout({
  label,
  children,
  tone = "note",
}: OriginCalloutProps) {
  if (tone === "poetic") {
    return (
      <blockquote className="panel-solid relative overflow-hidden rounded-3xl px-6 py-10 sm:px-12 sm:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(36rem 18rem at 50% 0%, rgba(41,151,255,0.1), transparent 70%)",
          }}
        />
        <p className="relative text-balance text-center text-xl font-medium leading-relaxed tracking-tight text-foreground sm:text-3xl sm:leading-[1.35]">
          {children}
        </p>
        <p className="relative mt-6 text-center text-xs font-semibold uppercase tracking-[0.22em] text-accent-cyan">
          {label}
        </p>
      </blockquote>
    );
  }

  // The accent rule is a positioned bar rather than `border-left-color`: the
  // `.panel-solid` border shorthand is declared after Tailwind's utilities in
  // globals.css, so it would win the cascade and swallow the color.
  return (
    <aside className="panel-solid relative overflow-hidden rounded-2xl p-5 pl-6 sm:p-6 sm:pl-7">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[2px] bg-accent/70"
      />
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent-cyan">
        {label}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-secondary">{children}</div>
    </aside>
  );
}
