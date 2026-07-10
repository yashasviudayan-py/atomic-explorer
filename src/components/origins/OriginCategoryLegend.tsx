"use client";

import { ORIGIN_CATEGORIES } from "@/data/elementOrigins";
import type { ElementOriginSource } from "@/types/elementOrigin";

interface OriginCategoryLegendProps {
  /** The channel currently isolated in the map, or null for "show everything". */
  active: ElementOriginSource | null;
  onChange: (source: ElementOriginSource | null) => void;
}

/**
 * Legend and filter for the origin map, in one control.
 *
 * Each pill both explains a color and isolates it: pressing one dims every
 * element that channel didn't make. Pressing it again clears the filter, as does
 * the "All sources" pill.
 */
export function OriginCategoryLegend({
  active,
  onChange,
}: OriginCategoryLegendProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={active === null}
        onClick={() => onChange(null)}
        className="origin-pill origin-src-multiple flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium text-secondary transition-colors hover:text-foreground"
      >
        All sources
      </button>

      {ORIGIN_CATEGORIES.map((category) => {
        const pressed = active === category.id;
        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(pressed ? null : category.id)}
            title={category.description}
            className={`${category.accentClass} origin-pill flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium transition-colors ${
              pressed ? "text-foreground" : "text-secondary hover:text-foreground"
            }`}
          >
            <span
              aria-hidden="true"
              className="origin-swatch h-2.5 w-2.5 shrink-0 rounded-sm"
            />
            <span className="hidden sm:inline">{category.label}</span>
            <span className="sm:hidden">{category.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
