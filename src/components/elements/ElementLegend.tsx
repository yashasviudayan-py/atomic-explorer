import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/elementCategories";

/**
 * Compact legend mapping each category to its accent swatch. Purely
 * informational, so it renders as a server component.
 */
export function ElementLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2">
      {CATEGORY_ORDER.map((category) => {
        const meta = CATEGORY_META[category];
        return (
          <li
            key={category}
            className="flex items-center gap-2 text-xs text-muted"
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-sm"
              style={{
                background: `color-mix(in srgb, ${meta.accent} 70%, transparent)`,
                boxShadow: `0 0 8px ${meta.accent}`,
              }}
            />
            {meta.label}
          </li>
        );
      })}
    </ul>
  );
}
