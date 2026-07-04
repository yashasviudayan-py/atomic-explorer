/**
 * App-wide constants: identity, navigation, and static landing-page content.
 * Centralized here so copy and structure stay consistent across components.
 */

export const APP_NAME = "Atomic Explorer";

export const APP_TAGLINE =
  "Explore Matter from the Periodic Table to the Atomic Core";

export const APP_DESCRIPTION =
  "A premium interactive playground for exploring the periodic table, " +
  "inspecting atomic structure, and visualizing protons, neutrons, " +
  "electrons, and shells.";

export interface NavLink {
  label: string;
  href: string;
}

/** Primary navigation rendered in the global header. */
export const NAV_LINKS: NavLink[] = [
  { label: "Elements", href: "/elements" },
  { label: "Learn", href: "/learn" },
  { label: "Compare", href: "/compare" },
];

export interface FeatureCard {
  title: string;
  description: string;
  /** Icon id resolved to an SVG in FeatureCards. */
  icon: "grid" | "atom" | "particles";
}

export const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Interactive Periodic Table",
    description:
      "Navigate all 118 elements in a fluid, color-coded grid. Filter by " +
      "category, hover for instant insight, and dive into any element.",
    icon: "grid",
  },
  {
    title: "3D Atomic Visualization",
    description:
      "Watch atoms come to life with orbiting electrons and layered shells, " +
      "rendered in real time for an immersive, hands-on view of structure.",
    icon: "atom",
  },
  {
    title: "Proton, Neutron & Electron Explorer",
    description:
      "Break each atom down to its core. Inspect particle counts, shell " +
      "configurations, and the forces that hold matter together.",
    icon: "particles",
  },
];
