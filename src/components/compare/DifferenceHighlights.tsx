"use client";

import { useMemo } from "react";
import type { Element } from "@/types/element";
import { CATEGORY_META } from "@/lib/elementCategories";
import {
  getCategoryComparison,
  getComplexityScore,
  getRepresentativeIsotope,
  usesApproximateIsotope,
} from "./compareUtils";

interface DifferenceHighlightsProps {
  left: Element;
  right: Element;
  leftAccent: string;
  rightAccent: string;
}

interface Highlight {
  id: string;
  text: string;
  /** Accent for the leading marker, defaults to neutral. */
  accent?: string;
}

/**
 * Generate 4–6 careful, human-readable insights comparing the two elements.
 *
 * Wording is intentionally cautious: it sticks to structural facts (protons,
 * shells, block, period, complexity) and avoids specific chemical/bonding
 * claims, since those depend on context this app doesn't model.
 */
function buildHighlights(
  left: Element,
  right: Element,
  leftAccent: string,
  rightAccent: string,
): Highlight[] {
  if (left.atomicNumber === right.atomicNumber) {
    return [
      {
        id: "same",
        text: `You're comparing ${left.name} with itself. Pick a different element on either side to see how their atomic structure contrasts.`,
      },
    ];
  }

  const highlights: Highlight[] = [];
  const cmp = getCategoryComparison(left, right);

  // Order the pair by atomic number so the wording reads naturally.
  const [lower, higher] =
    left.atomicNumber < right.atomicNumber ? [left, right] : [right, left];
  const higherAccent =
    higher.atomicNumber === left.atomicNumber ? leftAccent : rightAccent;
  const protonDiff = higher.atomicNumber - lower.atomicNumber;

  // 1. Proton / atomic-number difference (also = electrons in a neutral atom).
  highlights.push({
    id: "protons",
    accent: higherAccent,
    text: `${higher.name} has ${protonDiff} more proton${
      protonDiff === 1 ? "" : "s"
    } than ${lower.name}, so it is a different element with atomic number ${
      higher.atomicNumber
    }. In a neutral atom it also has ${protonDiff} more electron${
      protonDiff === 1 ? "" : "s"
    }.`,
  });

  // 2. Block relationship.
  if (cmp.sameBlock) {
    highlights.push({
      id: "block",
      text: `Both ${left.name} and ${right.name} are ${left.block}-block elements, so their outer electrons fill the same type of orbital.`,
    });
  } else {
    highlights.push({
      id: "block",
      text: `${left.name} is a ${left.block}-block element while ${right.name} is a ${right.block}-block element, meaning their outermost electrons occupy different orbital types.`,
    });
  }

  // 3. Shell count / period.
  if (left.shells.length === right.shells.length) {
    highlights.push({
      id: "shells",
      text: `Both atoms use ${left.shells.length} electron shell${
        left.shells.length === 1 ? "" : "s"
      } in this Bohr-style view, placing them in period ${left.period}.`,
    });
  } else {
    const [fewer, more] =
      left.shells.length < right.shells.length ? [left, right] : [right, left];
    highlights.push({
      id: "shells",
      text: `${more.name} spreads its electrons across ${more.shells.length} shells versus ${fewer.shells.length} for ${fewer.name}, so its electron cloud extends over more energy levels.`,
    });
  }

  // 4. Valence (outer-shell) electrons — general, cautious bonding note.
  const leftValence = left.shells[left.shells.length - 1];
  const rightValence = right.shells[right.shells.length - 1];
  if (leftValence !== rightValence) {
    const [moreVal, lessVal, moreName, lessName] =
      leftValence > rightValence
        ? [leftValence, rightValence, left.name, right.name]
        : [rightValence, leftValence, right.name, left.name];
    highlights.push({
      id: "valence",
      text: `${moreName} shows ${moreVal} electrons in its outer shell versus ${lessVal} for ${lessName}. Outer-shell electrons strongly influence how an element bonds, though this app keeps bonding explanations simplified.`,
    });
  } else {
    highlights.push({
      id: "valence",
      text: `Both elements show ${leftValence} electron${
        leftValence === 1 ? "" : "s"
      } in their outer shell here. Outer-shell electrons play a large role in chemistry, though this app keeps bonding explanations simplified.`,
    });
  }

  // 5. Category relationship.
  if (cmp.sameCategory) {
    highlights.push({
      id: "category",
      text: `${left.name} and ${right.name} both belong to the ${CATEGORY_META[left.category].label.toLowerCase()} category.`,
    });
  } else {
    highlights.push({
      id: "category",
      text: `${left.name} is classified as ${CATEGORY_META[left.category].label.toLowerCase()}, while ${right.name} is ${CATEGORY_META[right.category].label.toLowerCase()} — different families with different typical behaviour.`,
    });
  }

  // 6. Simplified complexity score (educational).
  const leftScore = getComplexityScore(left);
  const rightScore = getComplexityScore(right);
  if (Math.round(leftScore) !== Math.round(rightScore)) {
    const higherComplex = leftScore > rightScore ? left : right;
    highlights.push({
      id: "complexity",
      text: `On this app's simplified structural-complexity score, ${higherComplex.name} rates higher — it has more protons, shells, and neutrons to account for. Treat this as an educational indicator, not a physical constant.`,
    });
  }

  // 7. Approximate-data caveat, if relevant.
  if (usesApproximateIsotope(left) || usesApproximateIsotope(right)) {
    const approxName = usesApproximateIsotope(left) ? left.name : right.name;
    const approxIso = getRepresentativeIsotope(
      usesApproximateIsotope(left) ? left : right,
    );
    highlights.push({
      id: "approx",
      text: `Neutron counts for ${approxName} use an approximate model (${approxIso.label}) estimated from its standard atomic mass, since curated isotope data isn't available for it yet.`,
    });
  }

  // Keep the list within a comfortable 4–6 items.
  return highlights.slice(0, 6);
}

/**
 * Card listing the generated difference highlights. Insights are memoised on
 * the element pair so they only recompute when a selection changes.
 */
export function DifferenceHighlights({
  left,
  right,
  leftAccent,
  rightAccent,
}: DifferenceHighlightsProps) {
  const highlights = useMemo(
    () => buildHighlights(left, right, leftAccent, rightAccent),
    [left, right, leftAccent, rightAccent],
  );

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          Difference highlights
        </h3>
        <span className="text-[0.65rem] uppercase tracking-wide text-muted">
          educational
        </span>
      </div>

      <ul className="mt-3 space-y-2.5">
        {highlights.map((h) => (
          <li
            key={h.id}
            className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
          >
            <span
              aria-hidden="true"
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{
                background: h.accent ?? "var(--color-muted)",
                boxShadow: h.accent ? `0 0 10px -1px ${h.accent}` : undefined,
              }}
            />
            <p className="text-sm leading-relaxed text-foreground/90">{h.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
