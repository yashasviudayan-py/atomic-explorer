"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Element } from "@/types/element";
import { ELEMENTS } from "@/data/elements";
import { CATEGORY_META } from "@/lib/elementCategories";
import { matchesQuery } from "@/lib/elementFilter";

interface ElementSelectorProps {
  /** Which side this selector controls (drives labelling only). */
  side: "left" | "right";
  /** Currently selected element. */
  value: Element;
  onChange: (element: Element) => void;
  /** Category accent for the trigger/focus glow. */
  accent: string;
}

/**
 * A premium, custom searchable combobox for choosing one of the 118 elements.
 *
 * Search matches name, symbol, or atomic number (via the shared
 * {@link matchesQuery}). It's keyboard-friendly — Arrow keys move the active
 * option, Enter selects, Escape closes — and closes on outside click. Clearing
 * the search never breaks state: the previously chosen element stays selected
 * and the full list is shown again.
 */
export function ElementSelector({
  side,
  value,
  onChange,
  accent,
}: ElementSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const results = useMemo(
    () => ELEMENTS.filter((el) => matchesQuery(el, query)),
    [query],
  );

  // Keep the active option valid whenever the result set changes.
  useEffect(() => {
    setActiveIndex((i) => (results.length === 0 ? 0 : Math.min(i, results.length - 1)));
  }, [results.length]);

  // Close on outside click / focus loss.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // When opening, focus the search field and reset the query to the full list.
  useEffect(() => {
    if (open) {
      setQuery("");
      // Focus after the panel paints.
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const node = listRef.current.children[activeIndex] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const commit = (element: Element) => {
    onChange(element);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      if (open && results[activeIndex]) {
        event.preventDefault();
        commit(results[activeIndex]);
      }
    } else if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
    }
  };

  const meta = CATEGORY_META[value.category];

  return (
    <div
      ref={rootRef}
      className="relative"
      style={{ ["--accent" as string]: accent }}
    >
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
        {side === "left" ? "Left element" : "Right element"}
      </span>

      {/* Trigger — shows the currently selected element. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className="glass-panel flex w-full items-center gap-4 rounded-2xl border-white/10 px-4 py-3 text-left transition-all hover:border-white/20 focus:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] focus:shadow-[0_0_28px_-8px_var(--accent)] focus:outline-none"
      >
        <span
          className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border ${meta.tileBg} ${meta.border}`}
        >
          <span className="text-[0.6rem] text-foreground/50">
            {value.atomicNumber}
          </span>
          <span className={`text-2xl font-bold leading-none ${meta.text}`}>
            {value.symbol}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-lg font-semibold text-foreground">
            {value.name}
          </span>
          <span
            className="mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-medium"
            style={{
              borderColor: `color-mix(in srgb, ${accent} 45%, transparent)`,
              color: accent,
              background: `color-mix(in srgb, ${accent} 12%, transparent)`,
            }}
          >
            {meta.label}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="glass-panel absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border-white/10 shadow-2xl shadow-black/60">
          <div className="relative border-b border-white/10 p-2">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            >
              ⌕
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search name, symbol, or number…"
              aria-label="Search elements"
              aria-controls={listboxId}
              aria-activedescendant={
                results[activeIndex]
                  ? `${listboxId}-opt-${results[activeIndex].atomicNumber}`
                  : undefined
              }
              className="w-full rounded-xl bg-white/[0.03] py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted/70 outline-none focus:bg-white/[0.05]"
            />
          </div>

          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted">
              No elements match “{query}”.
            </div>
          ) : (
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-label={`${side} element`}
              className="max-h-72 overflow-y-auto overscroll-contain py-1"
            >
              {results.map((el, index) => {
                const optMeta = CATEGORY_META[el.category];
                const isActive = index === activeIndex;
                const isSelected = el.atomicNumber === value.atomicNumber;
                return (
                  <li
                    key={el.atomicNumber}
                    id={`${listboxId}-opt-${el.atomicNumber}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => commit(el)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors ${
                      isActive ? "bg-white/[0.07]" : ""
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-bold ${optMeta.tileBg} ${optMeta.border} ${optMeta.text}`}
                    >
                      {el.symbol}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">
                        {el.name}
                      </span>
                      <span className="text-[0.7rem] text-muted">
                        #{el.atomicNumber} · {optMeta.label}
                      </span>
                    </span>
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: optMeta.accent }}
                      aria-hidden="true"
                    />
                    {isSelected && (
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-xs"
                        style={{ color: accent }}
                      >
                        ✓
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
