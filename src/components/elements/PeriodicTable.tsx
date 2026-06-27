"use client";

import { useMemo } from "react";
import type { Element } from "@/types/element";
import { ELEMENTS } from "@/data/elements";
import { matchesFilters } from "@/lib/elementFilter";
import type { CategorySelection } from "./CategoryFilter";
import { ElementTile } from "./ElementTile";

interface PeriodicTableProps {
  searchQuery: string;
  activeCategory: CategorySelection;
  onPreview: (element: Element | null) => void;
  /** Symbol of the element currently shown in the preview panel, if any. */
  activeSymbol?: string;
}

/** Series-marker cells sit in the main grid where the f-block is pulled out. */
const SERIES_MARKERS = [
  { label: "57–71", x: 3, y: 6 },
  { label: "89–103", x: 3, y: 7 },
] as const;

/**
 * The periodic table itself. On medium+ screens it renders the canonical
 * 18-column layout (horizontally scrollable on narrow viewports) with
 * non-matching elements dimmed in place. On small screens it collapses to a
 * filtered card grid sorted by atomic number.
 */
export function PeriodicTable({
  searchQuery,
  activeCategory,
  onPreview,
  activeSymbol,
}: PeriodicTableProps) {
  const matchSet = useMemo(() => {
    const set = new Set<number>();
    for (const el of ELEMENTS) {
      if (matchesFilters(el, searchQuery, activeCategory)) {
        set.add(el.atomicNumber);
      }
    }
    return set;
  }, [searchQuery, activeCategory]);

  const mobileMatches = useMemo(
    () => ELEMENTS.filter((el) => matchSet.has(el.atomicNumber)),
    [matchSet],
  );

  return (
    <>
      {/* Desktop / tablet: true periodic layout */}
      <div className="hidden overflow-x-auto pb-2 md:block">
        <div
          className="grid min-w-[58rem] gap-1"
          style={{
            gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
          }}
        >
          {ELEMENTS.map((element) => (
            <ElementTile
              key={element.atomicNumber}
              element={element}
              dimmed={!matchSet.has(element.atomicNumber)}
              active={element.symbol.toLowerCase() === activeSymbol?.toLowerCase()}
              onPreview={onPreview}
            />
          ))}

          {SERIES_MARKERS.map((marker) => (
            <div
              key={marker.label}
              aria-hidden="true"
              style={{ gridColumn: marker.x, gridRow: marker.y }}
              className="flex aspect-square items-center justify-center rounded-md border border-dashed border-white/10 text-[0.55rem] text-muted"
            >
              {marker.label}
            </div>
          ))}

          {/* Visual gap between the main table and the f-block rows */}
          <div
            aria-hidden="true"
            className="h-3"
            style={{ gridColumn: "1 / -1", gridRow: 8 }}
          />
        </div>
      </div>

      {/* Mobile: filtered card grid */}
      <div className="md:hidden">
        {mobileMatches.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-muted">
            No elements match your search.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {mobileMatches.map((element) => (
              <ElementTile
                key={element.atomicNumber}
                element={element}
                variant="card"
                active={
                  element.symbol.toLowerCase() === activeSymbol?.toLowerCase()
                }
                onPreview={onPreview}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
