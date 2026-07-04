import type { Metadata } from "next";
import { getElementBySymbol } from "@/data/elements";
import { ElementComparePage } from "@/components/compare/ElementComparePage";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Place two elements side by side and compare their atomic structure, particles, isotopes, shells, and electron configuration.",
};

/** Default comparison when no (or invalid) symbols are supplied. */
const DEFAULT_LEFT = "C";
const DEFAULT_RIGHT = "O";

interface ComparePageProps {
  // App Router: search params are async in Next 15+.
  searchParams: Promise<{ left?: string; right?: string }>;
}

/** Validate a query symbol against the dataset, falling back when unknown. */
function safeSymbol(symbol: string | undefined, fallback: string): string {
  if (symbol && getElementBySymbol(symbol)) {
    return getElementBySymbol(symbol)!.symbol;
  }
  return fallback;
}

/**
 * Element comparison dashboard. Reads `?left=` / `?right=` symbols from the URL
 * (e.g. `/compare?left=C&right=O`), validates them against the dataset, and
 * hands safe defaults to the interactive client dashboard. Invalid or missing
 * symbols fall back to Carbon vs Oxygen so the page never renders broken.
 */
export default async function ComparePage({ searchParams }: ComparePageProps) {
  const { left, right } = await searchParams;
  const initialLeft = safeSymbol(left, DEFAULT_LEFT);
  const initialRight = safeSymbol(right, DEFAULT_RIGHT);

  return (
    <div className="relative">
      {/* Ambient dual-accent glow anchoring the dashboard against OLED black. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[30rem] opacity-30"
        style={{
          background:
            "radial-gradient(48rem 24rem at 50% -12%, rgba(10,132,255,0.12), transparent 70%)",
        }}
      />
      <ElementComparePage initialLeft={initialLeft} initialRight={initialRight} />
    </div>
  );
}
