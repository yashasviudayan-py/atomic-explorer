import Link from "next/link";
import type { Element } from "@/types/element";
import { getElementBySymbol } from "@/data/elements";
import { CATEGORY_META } from "@/lib/elementCategories";
import { ChevronRight } from "@/components/ui/Icon";

interface RelatedElementsProps {
  symbols: string[];
  /** Optional heading override (defaults to "Related elements"). */
  title?: string;
}

/**
 * Linked strip of the elements a lesson features: symbol, name, atomic number,
 * and category badge, each linking to its detail page. Unknown symbols are
 * silently skipped so lesson data can never break the page.
 */
export function RelatedElements({ symbols, title = "Related elements" }: RelatedElementsProps) {
  const elements = symbols
    .map((symbol) => getElementBySymbol(symbol))
    .filter((element): element is Element => Boolean(element));
  if (elements.length === 0) return null;

  return (
    <section className="glass-panel rounded-2xl p-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
        {title}
      </h2>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {elements.map((element) => {
          const meta = CATEGORY_META[element.category];
          return (
            <li key={element.symbol}>
              <Link
                href={`/elements/${element.symbol.toLowerCase()}`}
                className={`group flex items-center gap-3 rounded-xl border p-3 transition-all ${meta.border} ${meta.tileBg} ${meta.glow}`}
              >
                <span
                  className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-white/10 bg-black/30 ${meta.text}`}
                >
                  <span className="text-[0.55rem] text-foreground/50">
                    {element.atomicNumber}
                  </span>
                  <span className="text-base font-bold leading-none">
                    {element.symbol}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {element.name}
                  </span>
                  <span
                    className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[0.6rem] font-medium"
                    style={{
                      color: meta.accent,
                      background: `color-mix(in srgb, ${meta.accent} 12%, transparent)`,
                    }}
                  >
                    {meta.label}
                  </span>
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted/50 transition-transform duration-300 ease-spring group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
