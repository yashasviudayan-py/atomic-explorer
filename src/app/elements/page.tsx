import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Elements",
  description:
    "Browse the interactive periodic table and dive into any of the 118 elements.",
};

export default function ElementsPage() {
  return (
    <PagePlaceholder
      eyebrow="Periodic Table"
      title="The Interactive Periodic Table"
      description="A fluid, color-coded grid of all 118 elements is on its way. Soon you'll filter by category, hover for instant insight, and click through to a full atomic breakdown."
      upcoming={[
        "Color-coded element categories",
        "Hover and keyboard navigation",
        "Filter by metals, gases & more",
        "One-click jump to atomic detail",
      ]}
    />
  );
}
