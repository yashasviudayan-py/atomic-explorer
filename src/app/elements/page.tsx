"use client";

import { useMemo, useState } from "react";
import type { Element } from "@/types/element";
import { ELEMENTS } from "@/data/elements";
import { PeriodicTable } from "@/components/elements/PeriodicTable";
import { ElementSearch } from "@/components/elements/ElementSearch";
import {
  CategoryFilter,
  type CategorySelection,
} from "@/components/elements/CategoryFilter";
import { ElementLegend } from "@/components/elements/ElementLegend";
import { ElementPreviewPanel } from "@/components/elements/ElementPreviewPanel";
import { matchesFilters } from "@/lib/elementFilter";

// Note: metadata can't be exported from a client component; the static title
// for this route is inherited from the layout template.

export default function ElementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategorySelection>("all");
  const [hovered, setHovered] = useState<Element | null>(null);

  const resultCount = useMemo(
    () =>
      ELEMENTS.filter((el) => matchesFilters(el, searchQuery, activeCategory))
        .length,
    [searchQuery, activeCategory],
  );

  // Preview shows the hovered element, falling back to a sensible default so
  // the panel is never empty.
  const previewElement = hovered ?? ELEMENTS[0];

  return (
    <div className="page-shell py-10 lg:py-14">
      {/* Header */}
      <header className="relative">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-cyan">
          Periodic Table
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Interactive Periodic Table
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
          Choose any element to explore its atomic structure, particles, shells,
          and scientific properties.
        </p>
      </header>

      {/* Controls */}
      <div className="mt-8 space-y-4">
        <ElementSearch
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={resultCount}
        />
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Table + preview */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="glass-panel-subtle relative overflow-hidden rounded-2xl p-4 sm:p-5">
          <PeriodicTable
            searchQuery={searchQuery}
            activeCategory={activeCategory}
            onPreview={setHovered}
            activeSymbol={previewElement.symbol}
          />
        </section>

        {/* Preview panel sticks alongside on large screens */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ElementPreviewPanel element={previewElement} />
        </div>
      </div>

      {/* Legend */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted-2">
          Categories
        </h2>
        <ElementLegend />
      </section>
    </div>
  );
}
