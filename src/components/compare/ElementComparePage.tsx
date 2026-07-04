"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import type { Element } from "@/types/element";
import { getElementBySymbol } from "@/data/elements";
import { CATEGORY_META } from "@/lib/elementCategories";
import { ElementSelector } from "./ElementSelector";
import { ComparisonSummary } from "./ComparisonSummary";
import { ShellComparison } from "./ShellComparison";
import { IsotopeComparison } from "./IsotopeComparison";
import { ElectronConfigurationComparison } from "./ElectronConfigurationComparison";
import { CategoryComparison } from "./CategoryComparison";
import { DifferenceHighlights } from "./DifferenceHighlights";
import { getElementComparison } from "./compareUtils";

/** Defaults used when no (or invalid) URL symbols are provided. */
const DEFAULT_LEFT = "C";
const DEFAULT_RIGHT = "O";

/** Client-only mini viewer (WebGL); a placeholder holds layout while it loads. */
const AtomMiniViewer = dynamic(
  () => import("./AtomMiniViewer").then((m) => m.AtomMiniViewer),
  {
    ssr: false,
    loading: () => (
      <div className="glass-panel flex aspect-square w-full items-center justify-center rounded-2xl">
        <span className="animate-pulse text-xs text-muted">Loading atom…</span>
      </div>
    ),
  },
);

interface ElementComparePageProps {
  /** Initial left symbol from the URL (already fall-back-safe upstream). */
  initialLeft: string;
  initialRight: string;
}

/** Resolve a symbol to an element, falling back to a safe default. */
function resolve(symbol: string, fallback: string): Element {
  return (
    getElementBySymbol(symbol) ??
    getElementBySymbol(fallback) ??
    getElementBySymbol(DEFAULT_LEFT)!
  );
}

/**
 * The full comparison dashboard: two searchable selectors, side-by-side atom
 * previews, a metric summary, and structural/category/isotope/configuration
 * breakdowns with generated difference highlights.
 *
 * Selection state lives here (client-side); each change also writes the chosen
 * symbols back to the URL query (`?left=C&right=O`) via a shallow
 * `router.replace`, so any comparison is shareable and reload-safe without a
 * full navigation.
 */
export function ElementComparePage({
  initialLeft,
  initialRight,
}: ElementComparePageProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [left, setLeft] = useState<Element>(() =>
    resolve(initialLeft, DEFAULT_LEFT),
  );
  const [right, setRight] = useState<Element>(() =>
    resolve(initialRight, DEFAULT_RIGHT),
  );

  const leftAccent = CATEGORY_META[left.category].accent;
  const rightAccent = CATEGORY_META[right.category].accent;

  // Push the current selection into the URL without a full navigation.
  const syncUrl = useCallback(
    (nextLeft: Element, nextRight: Element) => {
      const params = new URLSearchParams({
        left: nextLeft.symbol,
        right: nextRight.symbol,
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  const handleLeftChange = useCallback(
    (el: Element) => {
      setLeft(el);
      syncUrl(el, right);
    },
    [right, syncUrl],
  );

  const handleRightChange = useCallback(
    (el: Element) => {
      setRight(el);
      syncUrl(left, el);
    },
    [left, syncUrl],
  );

  const swap = useCallback(() => {
    setLeft(right);
    setRight(left);
    syncUrl(right, left);
  }, [left, right, syncUrl]);

  const comparison = useMemo(
    () => getElementComparison(left, right),
    [left, right],
  );

  return (
    <div className="page-shell py-10 lg:py-14">
      {/* Header */}
      <header className="relative">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-cyan">
          Compare
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Compare Elements
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-secondary">
          Place two elements side by side to compare their atomic structure,
          particles, isotopes, shells, and electron behavior.
        </p>
      </header>

      {/* Selectors */}
      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <ElementSelector
          side="left"
          value={left}
          onChange={handleLeftChange}
          accent={leftAccent}
        />
        <button
          type="button"
          onClick={swap}
          aria-label="Swap left and right elements"
          className="glass-panel mx-auto flex h-11 w-11 items-center justify-center rounded-full border-white/10 text-muted transition-all hover:border-white/25 hover:text-foreground md:mb-1"
          title="Swap elements"
        >
          <span aria-hidden="true">⇄</span>
        </button>
        <ElementSelector
          side="right"
          value={right}
          onChange={handleRightChange}
          accent={rightAccent}
        />
      </div>

      {/* Atom previews */}
      <section className="mt-8">
        <SectionHeading
          title="Atom previews"
          hint="Simplified Bohr-style · not to scale"
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <AtomMiniViewer element={left} accent={leftAccent} />
          <AtomMiniViewer element={right} accent={rightAccent} />
        </div>
      </section>

      {/* Summary metrics */}
      <section className="mt-10">
        <SectionHeading
          title="Comparison summary"
          hint="Neutral atom · educational"
        />
        <div className="mt-4">
          <ComparisonSummary
            comparison={comparison}
            leftAccent={leftAccent}
            rightAccent={rightAccent}
          />
        </div>
      </section>

      {/* Structural breakdowns */}
      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <ShellComparison
          left={left}
          right={right}
          leftAccent={leftAccent}
          rightAccent={rightAccent}
        />
        <ElectronConfigurationComparison
          left={left}
          right={right}
          leftAccent={leftAccent}
          rightAccent={rightAccent}
        />
        <CategoryComparison left={left} right={right} />
        <IsotopeComparison
          left={left}
          right={right}
          leftAccent={leftAccent}
          rightAccent={rightAccent}
        />
      </section>

      {/* Difference highlights */}
      <section className="mt-10">
        <SectionHeading title="What's different" hint="Cautious, general insights" />
        <div className="mt-4">
          <DifferenceHighlights
            left={left}
            right={right}
            leftAccent={leftAccent}
            rightAccent={rightAccent}
          />
        </div>
      </section>

      {/* Honesty footer */}
      <p className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-xs leading-relaxed text-muted">
        This is an educational comparison. Atom previews use a simplified
        Bohr-style model and are not drawn to scale; Bohr rings are a teaching
        abstraction rather than physically exact orbits. Electron counts assume a
        neutral atom, and neutron counts marked “≈ approx.” are estimated from the
        standard atomic mass. Atomic Explorer is not a full chemistry simulator,
        so bonding and reactivity statements are kept general.
      </p>
    </div>
  );
}

/** Compact, consistent section header with an optional right-aligned hint. */
function SectionHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
      <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{title}</h2>
      {hint && (
        <span className="text-[0.65rem] uppercase tracking-wide text-muted-2">
          {hint}
        </span>
      )}
    </div>
  );
}
