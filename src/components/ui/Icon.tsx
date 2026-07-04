import type { SVGProps } from "react";

/**
 * A small, in-house icon family standing in for SF Symbols: one optical size,
 * one stroke weight, `currentColor` throughout, so icons stay consistent with
 * each other and inherit text color the way Apple's system icons do.
 *
 * Sized via className (default 1em) so an icon tracks the font-size of the text
 * it sits beside. Purely decorative unless given a label by the caller.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Base({ children, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "h-[1em] w-[1em]"}
      {...props}
    >
      {children}
    </svg>
  );
}

/** Forward-navigation chevron (replaces the → glyph). */
export function ChevronRight(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 6l6 6-6 6" />
    </Base>
  );
}

/** Back-navigation chevron (replaces the ← glyph). */
export function ChevronLeft(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Base>
  );
}

/** Disclosure chevron for menus and selects (replaces the ▾ glyph). */
export function ChevronDown(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 9l6 6 6-6" />
    </Base>
  );
}

/** Confirmation check (replaces the ✓ glyph). */
export function Check(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </Base>
  );
}

/** Dismiss / incorrect mark (replaces the ✕ glyph). */
export function Close(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Base>
  );
}

/** Navigation menu toggle (replaces the ☰ glyph). */
export function Menu(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

/** Search magnifier (replaces the ⌕ glyph). */
export function Search(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </Base>
  );
}

/** Periodic-table grid — feature icon. */
export function GridIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </Base>
  );
}

/** Atom / orbital — feature icon. */
export function AtomIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(-60 12 12)" />
    </Base>
  );
}

/** Nucleus particles — feature icon. */
export function ParticlesIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="9" cy="9" r="3" />
      <circle cx="15.5" cy="10.5" r="3" />
      <circle cx="11.5" cy="15.5" r="3" />
    </Base>
  );
}
