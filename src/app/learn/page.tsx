import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Guided lessons on atomic structure, the periodic table, and the particles that build matter.",
};

export default function LearnPage() {
  return (
    <PagePlaceholder
      eyebrow="Learn"
      title="Understand the Building Blocks of Matter"
      description="Guided, visual lessons are coming soon — from the anatomy of an atom to how the periodic table is organized, explained the way a high-end simulation should."
      upcoming={[
        "What atoms are made of",
        "How electron shells fill up",
        "Reading the periodic table",
        "Isotopes, ions & beyond",
      ]}
    />
  );
}
