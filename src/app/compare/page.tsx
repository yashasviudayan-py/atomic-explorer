import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Place elements side by side and compare their atomic structure and properties.",
};

export default function ComparePage() {
  return (
    <PagePlaceholder
      eyebrow="Compare"
      title="Compare Elements Side by Side"
      description="Soon you'll line up two or more elements to contrast their atomic structure, mass, shells, and properties — making periodic trends impossible to miss."
      upcoming={[
        "Side-by-side atom views",
        "Property-by-property diff",
        "Visualize periodic trends",
        "Share comparison links",
      ]}
    />
  );
}
