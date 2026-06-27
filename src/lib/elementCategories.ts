import type { ElementCategory } from "@/types/element";

/**
 * Presentation metadata for each element category.
 *
 * Colors are tuned for an OLED-first dark theme: low-luminance tinted fills,
 * faint borders, and a single saturated accent used for text, glow, and the
 * legend swatch. Tailwind utility strings are kept readable and composable so
 * tiles, chips, and the legend can share one source of truth.
 */
export interface CategoryMeta {
  label: string;
  description: string;
  /** Tile/chip fill (very low opacity tint over the near-black backdrop). */
  tileBg: string;
  /** Subtle category-tinted border. */
  border: string;
  /** Accent text / symbol color. */
  text: string;
  /** Hover glow ring + shadow. */
  glow: string;
  /** Raw accent hex for inline glows, swatches, and CSS variables. */
  accent: string;
}

export const CATEGORY_META: Record<ElementCategory, CategoryMeta> = {
  "alkali-metal": {
    label: "Alkali metals",
    description: "Soft, highly reactive metals of group 1.",
    tileBg: "bg-amber-400/10",
    border: "border-amber-300/25",
    text: "text-amber-200",
    glow: "hover:border-amber-300/50 hover:shadow-[0_0_24px_-4px] hover:shadow-amber-400/40",
    accent: "#fbbf24",
  },
  "alkaline-earth-metal": {
    label: "Alkaline earth metals",
    description: "Reactive group 2 metals, harder than the alkali metals.",
    tileBg: "bg-yellow-200/10",
    border: "border-yellow-200/25",
    text: "text-yellow-100",
    glow: "hover:border-yellow-200/50 hover:shadow-[0_0_24px_-4px] hover:shadow-yellow-200/40",
    accent: "#fde68a",
  },
  "transition-metal": {
    label: "Transition metals",
    description: "Dense, conductive d-block metals with variable oxidation states.",
    tileBg: "bg-sky-400/10",
    border: "border-sky-400/25",
    text: "text-sky-200",
    glow: "hover:border-sky-400/50 hover:shadow-[0_0_24px_-4px] hover:shadow-sky-400/40",
    accent: "#38bdf8",
  },
  "post-transition-metal": {
    label: "Post-transition metals",
    description: "Softer, lower-melting metals to the right of the transition block.",
    tileBg: "bg-cyan-300/10",
    border: "border-cyan-300/25",
    text: "text-cyan-100",
    glow: "hover:border-cyan-300/50 hover:shadow-[0_0_24px_-4px] hover:shadow-cyan-300/40",
    accent: "#67e8f9",
  },
  metalloid: {
    label: "Metalloids",
    description: "Elements with properties between metals and nonmetals.",
    tileBg: "bg-emerald-400/10",
    border: "border-emerald-400/25",
    text: "text-emerald-200",
    glow: "hover:border-emerald-400/50 hover:shadow-[0_0_24px_-4px] hover:shadow-emerald-400/40",
    accent: "#34d399",
  },
  "reactive-nonmetal": {
    label: "Reactive nonmetals",
    description: "Electronegative nonmetals, including the halogens.",
    tileBg: "bg-fuchsia-400/10",
    border: "border-fuchsia-400/25",
    text: "text-fuchsia-200",
    glow: "hover:border-fuchsia-400/50 hover:shadow-[0_0_24px_-4px] hover:shadow-fuchsia-400/40",
    accent: "#e879f9",
  },
  "noble-gas": {
    label: "Noble gases",
    description: "Inert group 18 gases with full valence shells.",
    tileBg: "bg-indigo-400/10",
    border: "border-indigo-400/25",
    text: "text-indigo-200",
    glow: "hover:border-indigo-400/50 hover:shadow-[0_0_24px_-4px] hover:shadow-indigo-400/40",
    accent: "#818cf8",
  },
  lanthanide: {
    label: "Lanthanides",
    description: "The 4f rare-earth series, lanthanum through lutetium.",
    tileBg: "bg-rose-400/10",
    border: "border-rose-400/25",
    text: "text-rose-200",
    glow: "hover:border-rose-400/50 hover:shadow-[0_0_24px_-4px] hover:shadow-rose-400/40",
    accent: "#fb7185",
  },
  actinide: {
    label: "Actinides",
    description: "The radioactive 5f series, actinium through lawrencium.",
    tileBg: "bg-orange-500/10",
    border: "border-orange-500/25",
    text: "text-orange-200",
    glow: "hover:border-orange-500/50 hover:shadow-[0_0_24px_-4px] hover:shadow-orange-500/40",
    accent: "#fb923c",
  },
  unknown: {
    label: "Unknown",
    description: "Superheavy elements with unconfirmed chemical properties.",
    tileBg: "bg-slate-400/10",
    border: "border-slate-400/20",
    text: "text-slate-300",
    glow: "hover:border-slate-400/40 hover:shadow-[0_0_24px_-4px] hover:shadow-slate-400/30",
    accent: "#94a3b8",
  },
};

/** Stable, display-ordered list of categories for legends and filters. */
export const CATEGORY_ORDER: ElementCategory[] = [
  "alkali-metal",
  "alkaline-earth-metal",
  "transition-metal",
  "post-transition-metal",
  "metalloid",
  "reactive-nonmetal",
  "noble-gas",
  "lanthanide",
  "actinide",
  "unknown",
];
