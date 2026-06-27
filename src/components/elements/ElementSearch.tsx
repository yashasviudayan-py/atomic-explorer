"use client";

interface ElementSearchProps {
  value: string;
  onChange: (value: string) => void;
  /** Number of elements currently matching, shown as a subtle hint. */
  resultCount: number;
}

/**
 * Elegant dark search field for filtering the periodic table by name, symbol,
 * or atomic number.
 */
export function ElementSearch({
  value,
  onChange,
  resultCount,
}: ElementSearchProps) {
  return (
    <div className="relative w-full">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
      >
        ⌕
      </span>
      <input
        type="search"
        inputMode="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name, symbol, or atomic number…"
        aria-label="Search elements"
        className="glass-panel w-full rounded-xl border-white/10 py-3 pl-11 pr-24 text-sm text-foreground placeholder:text-muted/70 outline-none transition-all focus:border-accent/50 focus:shadow-[0_0_24px_-6px_var(--color-accent)]"
      />
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs tabular-nums text-muted">
        {resultCount} {resultCount === 1 ? "match" : "matches"}
      </span>
    </div>
  );
}
