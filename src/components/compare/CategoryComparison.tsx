"use client";

import type { Element } from "@/types/element";
import { CATEGORY_META } from "@/lib/elementCategories";
import { getCategoryComparison } from "./compareUtils";

interface CategoryComparisonProps {
  left: Element;
  right: Element;
}

/**
 * Category badges for both elements plus at-a-glance "same / differs" chips for
 * category, block, period, and group. Group comparison is skipped (shown as
 * "n/a") when either element is f-block and has no group.
 */
export function CategoryComparison({ left, right }: CategoryComparisonProps) {
  const cmp = getCategoryComparison(left, right);
  const leftMeta = CATEGORY_META[left.category];
  const rightMeta = CATEGORY_META[right.category];

  return (
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-foreground">
        Category &amp; placement
      </h3>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <CategoryBadge
          name={left.name}
          label={leftMeta.label}
          accent={leftMeta.accent}
        />
        <span className="text-xs uppercase tracking-wide text-muted">vs</span>
        <CategoryBadge
          name={right.name}
          label={rightMeta.label}
          accent={rightMeta.accent}
          align="right"
        />
      </div>

      <ul className="mt-4 space-y-2">
        <SamenessRow label="Same category" same={cmp.sameCategory} />
        <SamenessRow label="Same block" same={cmp.sameBlock} />
        <SamenessRow label="Same period" same={cmp.samePeriod} />
        <SamenessRow
          label="Same group"
          same={cmp.sameGroup}
          na={cmp.groupUndefined}
          naHint="f-block: no group"
        />
      </ul>
    </div>
  );
}

/** A category swatch + label for one element. */
function CategoryBadge({
  name,
  label,
  accent,
  align = "left",
}: {
  name: string;
  label: string;
  accent: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <span className="block text-[0.65rem] uppercase tracking-wide text-muted">
        {name}
      </span>
      <span
        className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium ${
          align === "right" ? "flex-row-reverse" : ""
        }`}
        style={{
          borderColor: `color-mix(in srgb, ${accent} 45%, transparent)`,
          color: accent,
          background: `color-mix(in srgb, ${accent} 12%, transparent)`,
        }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: accent }}
          aria-hidden="true"
        />
        {label}
      </span>
    </div>
  );
}

/** A labelled same/differs (or n/a) row. */
function SamenessRow({
  label,
  same,
  na = false,
  naHint,
}: {
  label: string;
  same: boolean;
  na?: boolean;
  naHint?: string;
}) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
      <span className="text-sm text-muted">{label}</span>
      {na ? (
        <span
          className="rounded-full bg-white/5 px-2 py-0.5 text-[0.6rem] font-medium text-muted"
          title={naHint}
        >
          n/a
        </span>
      ) : (
        <span
          className={`rounded-full px-2 py-0.5 text-[0.6rem] font-medium ${
            same
              ? "bg-emerald-400/10 text-emerald-300"
              : "bg-rose-400/10 text-rose-300"
          }`}
        >
          {same ? "yes" : "no"}
        </span>
      )}
    </li>
  );
}
