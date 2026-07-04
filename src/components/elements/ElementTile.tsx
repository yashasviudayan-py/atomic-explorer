"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Element } from "@/types/element";
import { CATEGORY_META } from "@/lib/elementCategories";

interface ElementTileProps {
  element: Element;
  /** When true, the tile is faded because it doesn't match the active filters. */
  dimmed?: boolean;
  /** When true, the tile is highlighted as the current preview target. */
  active?: boolean;
  /** Notifies the parent which element is being previewed (null on leave). */
  onPreview?: (element: Element | null) => void;
  /** "grid" places the tile via x/y; "card" is a free-flowing mobile card. */
  variant?: "grid" | "card";
}

/**
 * A single periodic-table cell: atomic number, symbol, name, and mass, tinted
 * by category. Acts as a link to the element detail page and reports hover/focus
 * so the preview panel can react.
 */
export function ElementTile({
  element,
  dimmed = false,
  active = false,
  onPreview,
  variant = "grid",
}: ElementTileProps) {
  const meta = CATEGORY_META[element.category];

  const gridStyle: CSSProperties =
    variant === "grid"
      ? { gridColumn: element.x, gridRow: element.y }
      : {};

  return (
    <Link
      href={`/elements/${element.symbol.toLowerCase()}`}
      aria-label={`${element.name}, atomic number ${element.atomicNumber}`}
      style={gridStyle}
      onMouseEnter={() => onPreview?.(element)}
      onFocus={() => onPreview?.(element)}
      onMouseLeave={() => onPreview?.(null)}
      className={[
        "group relative flex flex-col justify-between rounded-md border p-1 text-center",
        "outline-none transition-all duration-200 ease-spring",
        variant === "grid"
          ? "aspect-square"
          : "aspect-square min-h-[4.5rem]",
        meta.tileBg,
        meta.border,
        meta.glow,
        "hover:-translate-y-0.5 focus-visible:-translate-y-0.5",
        "focus-visible:ring-2 focus-visible:ring-white/40",
        active ? "ring-2 ring-white/40 -translate-y-0.5" : "",
        dimmed ? "opacity-20 saturate-50" : "opacity-100",
      ].join(" ")}
    >
      <span className="flex items-center justify-between text-[0.5rem] leading-none text-foreground/60 sm:text-[0.55rem]">
        <span>{element.atomicNumber}</span>
      </span>
      <span className="text-sm font-semibold leading-none text-foreground sm:text-base lg:text-lg">
        {element.symbol}
      </span>
      <span className="flex flex-col gap-px leading-none">
        <span className="truncate text-[0.45rem] text-foreground/85 sm:text-[0.5rem]">
          {element.name}
        </span>
        <span className="text-[0.45rem] text-foreground/45 sm:text-[0.5rem]">
          {element.atomicMass}
        </span>
      </span>
    </Link>
  );
}
