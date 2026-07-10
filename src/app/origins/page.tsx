import type { Metadata } from "next";
import { OriginsPage } from "@/components/origins/OriginsPage";

export const metadata: Metadata = {
  // Absolute, so the title reads exactly as specified rather than picking up
  // the root layout's "%s · Atomic Explorer" template.
  title: {
    absolute: "The Cosmic Origin of Elements | Atomic Explorer",
  },
  description:
    "Explore how hydrogen and helium became the elements of the periodic table through stars, supernovae, neutron star mergers, cosmic rays, and human synthesis.",
};

/**
 * "The Cosmic Origin of Elements" — a long-form, static storytelling route.
 * All content and diagrams render on the server; see OriginsPage for structure.
 */
export default function Origins() {
  return <OriginsPage />;
}
