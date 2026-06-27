"use client";

import type { ElementCategory } from "@/types/element";
import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/elementCategories";

/** "all" shows every category; otherwise a single category is active. */
export type CategorySelection = ElementCategory | "all";

interface CategoryFilterProps {
  active: CategorySelection;
  onChange: (selection: CategorySelection) => void;
}

/**
 * Row of filter chips. The active chip glows in its category accent; "All"
 * resets the filter.
 */
export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <Chip
        label="All"
        accent="#e7ecff"
        isActive={active === "all"}
        onClick={() => onChange("all")}
      />
      {CATEGORY_ORDER.map((category) => (
        <Chip
          key={category}
          label={CATEGORY_META[category].label}
          accent={CATEGORY_META[category].accent}
          isActive={active === category}
          onClick={() => onChange(category)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  accent,
  isActive,
  onClick,
}: {
  label: string;
  accent: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      style={
        isActive
          ? {
              borderColor: `color-mix(in srgb, ${accent} 55%, transparent)`,
              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
              color: accent,
              boxShadow: `0 0 22px -6px ${accent}`,
            }
          : undefined
      }
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
        isActive
          ? ""
          : "border-white/10 bg-white/[0.03] text-muted hover:border-white/20 hover:text-foreground",
      ].join(" ")}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
      />
      {label}
    </button>
  );
}
