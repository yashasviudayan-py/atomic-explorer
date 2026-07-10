"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ELEMENTS } from "@/data/elements";
import {
  ORIGIN_BY_SYMBOL,
  ORIGIN_CATEGORY_BY_ID,
} from "@/data/elementOrigins";
import type {
  ElementOriginConfidence,
  ElementOriginSource,
} from "@/types/elementOrigin";
import { OriginCategoryLegend } from "@/components/origins/OriginCategoryLegend";
import { ChevronRight } from "@/components/ui/Icon";

/** What the `confidence` field means, in the reader's language. */
const CONFIDENCE_COPY: Record<ElementOriginConfidence, string> = {
  high: "Well established",
  medium: "Dominant, but model-dependent",
  simplified: "Genuinely mixed — color is a simplification",
};

/** Markers standing in for the f-block, which is pulled out below the grid. */
const SERIES_MARKERS = [
  { label: "57–71", x: 3, y: 6 },
  { label: "89–103", x: 3, y: 7 },
] as const;

/** Gold: the element whose origin story surprises people the most. */
const DEFAULT_SYMBOL = "Au";

/**
 * The periodic table, recolored by where each element comes from.
 *
 * The real table geometry is kept (`x`/`y` from the element dataset) so the
 * shape people already know does the explaining: the Big Bang owns two corners,
 * stellar fusion owns the top-left slope, the r-process owns the bottom, and
 * human synthesis owns the tail. Hovering or focusing a chip reads out its
 * story; clicking navigates to the element.
 *
 * All 118 chips share one CSS rule and inherit their accent from a category
 * class, so the grid is 118 nodes and one paint, not 118 style objects.
 */
export function ElementOriginMap() {
  const [filter, setFilter] = useState<ElementOriginSource | null>(null);
  const [selected, setSelected] = useState(DEFAULT_SYMBOL);

  const active = useMemo(() => {
    const element = ELEMENTS.find((el) => el.symbol === selected);
    const origin = ORIGIN_BY_SYMBOL[selected.toUpperCase()];
    if (!element || !origin) return null;
    return { element, origin, category: ORIGIN_CATEGORY_BY_ID[origin.primarySource] };
  }, [selected]);

  return (
    <div>
      <OriginCategoryLegend active={filter} onChange={setFilter} />

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-6">
        {/* The grid. Scrolls horizontally on narrow screens rather than
            reflowing — the table's shape carries meaning here. */}
        <div className="-mx-1 overflow-x-auto px-1 pb-2">
          <div
            className="grid min-w-[44rem] gap-[3px] sm:min-w-[52rem]"
            style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
          >
            {ELEMENTS.map((element) => {
              const origin = ORIGIN_BY_SYMBOL[element.symbol.toUpperCase()];
              if (!origin) return null;
              const category = ORIGIN_CATEGORY_BY_ID[origin.primarySource];
              const dimmed = filter !== null && origin.primarySource !== filter;

              return (
                <Link
                  key={element.atomicNumber}
                  href={`/elements/${element.symbol.toLowerCase()}`}
                  className={`${category.accentClass} origin-chip text-[0.55rem] sm:text-[0.7rem]`}
                  style={{ gridColumn: element.x, gridRow: element.y }}
                  data-dimmed={dimmed || undefined}
                  data-active={element.symbol === selected || undefined}
                  onMouseEnter={() => setSelected(element.symbol)}
                  onFocus={() => setSelected(element.symbol)}
                >
                  <span aria-hidden="true">{element.symbol}</span>
                  <span className="sr-only">
                    {element.name} — {category.label}
                  </span>
                </Link>
              );
            })}

            {SERIES_MARKERS.map((marker) => (
              <div
                key={marker.label}
                aria-hidden="true"
                style={{ gridColumn: marker.x, gridRow: marker.y }}
                className="flex aspect-square items-center justify-center rounded-[5px] border border-dashed border-white/10 text-[0.45rem] text-muted-2 sm:text-[0.55rem]"
              >
                {marker.label}
              </div>
            ))}
          </div>
        </div>

        {/* Readout. Follows hover and focus; never empties, so the panel doesn't
            collapse and reflow the page as the pointer moves across the grid.
            Deliberately not a live region: each chip already carries an sr-only
            label, so announcing the panel too would say everything twice. */}
        {active && (
          <aside
            className={`${active.category.accentClass} panel-solid rounded-2xl p-5`}
          >
            <div className="flex items-start gap-4">
              <span className="origin-badge h-14 w-14 shrink-0 text-xl">
                {active.element.symbol}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {active.element.name}
                </h3>
                <p className="font-mono text-xs text-muted-2">
                  #{active.element.atomicNumber} · {active.element.atomicMass}
                </p>
              </div>
            </div>

            <p className="origin-accent-text mt-5 text-xs font-semibold uppercase tracking-[0.12em]">
              {active.category.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              {active.origin.explanation}
            </p>

            {active.origin.secondarySources &&
              active.origin.secondarySources.length > 0 && (
                <div className="mt-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-2">
                    Also contributes
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {active.origin.secondarySources.map((source) => {
                      const category = ORIGIN_CATEGORY_BY_ID[source];
                      return (
                        <li
                          key={source}
                          className={`${category.accentClass} flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[0.7rem] text-secondary`}
                        >
                          <span
                            aria-hidden="true"
                            className="origin-swatch h-2 w-2 rounded-sm"
                          />
                          {category.shortLabel}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

            <p className="mt-4 border-t border-white/10 pt-3 text-[0.7rem] leading-relaxed text-muted">
              {CONFIDENCE_COPY[active.origin.confidence]}
            </p>

            <Link
              href={`/elements/${active.element.symbol.toLowerCase()}`}
              className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent-cyan"
            >
              Open {active.element.name}
              <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 ease-spring group-hover:translate-x-0.5" />
            </Link>
          </aside>
        )}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted">
        Hover, tap, or tab through the grid to read an element&apos;s story.
        Selecting a chip opens that element&apos;s full page.
      </p>
    </div>
  );
}
