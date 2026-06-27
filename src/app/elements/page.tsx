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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      {/* Header */}
      <header className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-muted backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Periodic Table
        </span>
        <h1 className="mt-5 bg-gradient-to-br from-white to-accent/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
          Interactive Periodic Table
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
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
        <section className="glass-panel relative overflow-hidden rounded-2xl p-4 sm:p-5">
          {/* Soft radial glow behind the grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(40rem 30rem at 30% -10%, rgba(56,189,248,0.10), transparent 60%), radial-gradient(35rem 30rem at 100% 120%, rgba(168,85,247,0.10), transparent 60%)",
            }}
          />
          <div className="relative">
            <PeriodicTable
              searchQuery={searchQuery}
              activeCategory={activeCategory}
              onPreview={setHovered}
              activeSymbol={previewElement.symbol}
            />
          </div>
        </section>

        {/* Preview panel sticks alongside on large screens */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ElementPreviewPanel element={previewElement} />
        </div>
      </div>

      {/* Legend */}
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Categories
        </h2>
        <ElementLegend />
      </section>
    </div>
  );
}
