import type { Element } from "@/types/element";
import type { CategorySelection } from "@/components/elements/CategoryFilter";

/** True if the element's name, symbol, or atomic number matches the query. */
export function matchesQuery(element: Element, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return true;
  return (
    element.name.toLowerCase().includes(q) ||
    element.symbol.toLowerCase().includes(q) ||
    String(element.atomicNumber) === q ||
    String(element.atomicNumber).startsWith(q)
  );
}

/** True if the element passes both the category filter and the search query. */
export function matchesFilters(
  element: Element,
  query: string,
  category: CategorySelection,
): boolean {
  const categoryOk = category === "all" || element.category === category;
  return categoryOk && matchesQuery(element, query);
}
