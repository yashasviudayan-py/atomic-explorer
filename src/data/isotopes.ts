import type { Isotope } from "@/types/isotope";

/**
 * Curated, educational isotope data keyed by element symbol.
 *
 * Scientific honesty notes:
 * - Abundances and half-lives are included only where they are well-established
 *   and commonly cited; they are rounded for readability.
 * - This data is simplified for visualization and is not a substitute for an
 *   authoritative nuclear data table.
 * - Elements without an entry here fall back to a single approximate isotope
 *   generated from the standard atomic mass (see getFallbackIsotope), which is
 *   clearly flagged in the UI.
 *
 * Each isotope lists protons (= atomic number), neutrons (= massNumber −
 * atomicNumber), and electrons (= atomic number for a neutral atom). Lists are
 * ordered by mass number ascending.
 */

interface IsotopeSeed {
  massNumber: number;
  isStable: boolean;
  description: string;
  abundance?: string;
  halfLife?: string;
  /** Optional alternative display label (e.g. historical names). */
  label?: string;
}

/** Build a full {@link Isotope} from an element header and a compact seed. */
function iso(
  elementSymbol: string,
  elementName: string,
  protons: number,
  seed: IsotopeSeed,
): Isotope {
  return {
    symbol: `${elementSymbol}-${seed.massNumber}`,
    elementSymbol,
    massNumber: seed.massNumber,
    protons,
    neutrons: seed.massNumber - protons,
    electrons: protons,
    label: seed.label ?? `${elementName}-${seed.massNumber}`,
    abundance: seed.abundance,
    halfLife: seed.halfLife,
    isStable: seed.isStable,
    description: seed.description,
  };
}

/** Convenience: define all isotopes for one element in one place. */
function element(
  symbol: string,
  name: string,
  protons: number,
  seeds: IsotopeSeed[],
): [string, Isotope[]] {
  return [symbol, seeds.map((seed) => iso(symbol, name, protons, seed))];
}

export const ISOTOPE_DATA: Record<string, Isotope[]> = Object.fromEntries([
  element("H", "Hydrogen", 1, [
    {
      massNumber: 1,
      isStable: true,
      abundance: "≈99.98%",
      label: "Hydrogen-1 · Protium",
      description:
        "Protium: a single proton with no neutrons. By far the most common form of hydrogen in the universe.",
    },
    {
      massNumber: 2,
      isStable: true,
      abundance: "≈0.016%",
      label: "Hydrogen-2 · Deuterium",
      description:
        "Deuterium: one proton and one neutron. A stable 'heavy hydrogen' used in heavy water and fusion research.",
    },
    {
      massNumber: 3,
      isStable: false,
      halfLife: "≈12.3 years",
      label: "Hydrogen-3 · Tritium",
      description:
        "Tritium: one proton and two neutrons. Radioactive, decaying by beta emission; used in self-powered lighting.",
    },
  ]),

  element("He", "Helium", 2, [
    {
      massNumber: 3,
      isStable: true,
      abundance: "trace",
      description:
        "A rare, light helium isotope with one neutron. Valued for ultra-low-temperature refrigeration research.",
    },
    {
      massNumber: 4,
      isStable: true,
      abundance: "≈99.9998%",
      description:
        "The dominant form of helium: two protons and two neutrons, an exceptionally stable nucleus (an alpha particle).",
    },
  ]),

  element("C", "Carbon", 6, [
    {
      massNumber: 12,
      isStable: true,
      abundance: "≈98.9%",
      description:
        "The most common carbon isotope and the reference for the atomic mass scale. Six protons, six neutrons.",
    },
    {
      massNumber: 13,
      isStable: true,
      abundance: "≈1.1%",
      description:
        "A stable carbon isotope with one extra neutron, widely used in NMR spectroscopy.",
    },
    {
      massNumber: 14,
      isStable: false,
      halfLife: "≈5,730 years",
      description:
        "Radiocarbon: a trace radioactive isotope formed in the atmosphere and used for radiocarbon dating.",
    },
  ]),

  element("N", "Nitrogen", 7, [
    {
      massNumber: 14,
      isStable: true,
      abundance: "≈99.6%",
      description:
        "The overwhelmingly common form of nitrogen: seven protons and seven neutrons.",
    },
    {
      massNumber: 15,
      isStable: true,
      abundance: "≈0.4%",
      description:
        "A stable nitrogen isotope used as a tracer in biology and chemistry.",
    },
  ]),

  element("O", "Oxygen", 8, [
    {
      massNumber: 16,
      isStable: true,
      abundance: "≈99.76%",
      description:
        "The dominant oxygen isotope: eight protons and eight neutrons.",
    },
    {
      massNumber: 17,
      isStable: true,
      abundance: "≈0.04%",
      description: "A rare stable oxygen isotope used in NMR studies.",
    },
    {
      massNumber: 18,
      isStable: true,
      abundance: "≈0.20%",
      description:
        "A stable heavy oxygen isotope used as a tracer in climate and metabolic research.",
    },
  ]),

  element("Ne", "Neon", 10, [
    {
      massNumber: 20,
      isStable: true,
      abundance: "≈90.5%",
      description: "The most common neon isotope: ten protons, ten neutrons.",
    },
    {
      massNumber: 21,
      isStable: true,
      abundance: "≈0.27%",
      description: "A rare stable neon isotope.",
    },
    {
      massNumber: 22,
      isStable: true,
      abundance: "≈9.25%",
      description: "The second most abundant stable neon isotope.",
    },
  ]),

  element("Na", "Sodium", 11, [
    {
      massNumber: 23,
      isStable: true,
      abundance: "100%",
      description:
        "Sodium's only stable isotope: eleven protons and twelve neutrons. All natural sodium is Na-23.",
    },
  ]),

  element("Mg", "Magnesium", 12, [
    {
      massNumber: 24,
      isStable: true,
      abundance: "≈79.0%",
      description: "The most common magnesium isotope.",
    },
    {
      massNumber: 25,
      isStable: true,
      abundance: "≈10.0%",
      description: "A stable magnesium isotope used in NMR.",
    },
    {
      massNumber: 26,
      isStable: true,
      abundance: "≈11.0%",
      description: "A stable magnesium isotope of interest in isotope geology.",
    },
  ]),

  element("Al", "Aluminium", 13, [
    {
      massNumber: 27,
      isStable: true,
      abundance: "100%",
      description:
        "Aluminium's only stable isotope: thirteen protons and fourteen neutrons.",
    },
  ]),

  element("Si", "Silicon", 14, [
    {
      massNumber: 28,
      isStable: true,
      abundance: "≈92.2%",
      description: "The dominant silicon isotope: fourteen protons and fourteen neutrons.",
    },
    {
      massNumber: 29,
      isStable: true,
      abundance: "≈4.7%",
      description: "A stable silicon isotope used in NMR and metrology.",
    },
    {
      massNumber: 30,
      isStable: true,
      abundance: "≈3.1%",
      description: "A stable silicon isotope used in advanced semiconductor research.",
    },
  ]),

  element("P", "Phosphorus", 15, [
    {
      massNumber: 31,
      isStable: true,
      abundance: "100%",
      description:
        "Phosphorus's only stable isotope: fifteen protons and sixteen neutrons.",
    },
  ]),

  element("S", "Sulfur", 16, [
    {
      massNumber: 32,
      isStable: true,
      abundance: "≈95.0%",
      description: "The most common sulfur isotope.",
    },
    {
      massNumber: 33,
      isStable: true,
      abundance: "≈0.75%",
      description: "A rare stable sulfur isotope.",
    },
    {
      massNumber: 34,
      isStable: true,
      abundance: "≈4.25%",
      description: "The second most abundant stable sulfur isotope.",
    },
    {
      massNumber: 36,
      isStable: true,
      abundance: "≈0.01%",
      description: "A very rare stable sulfur isotope.",
    },
  ]),

  element("Cl", "Chlorine", 17, [
    {
      massNumber: 35,
      isStable: true,
      abundance: "≈75.8%",
      description: "The most common chlorine isotope: seventeen protons, eighteen neutrons.",
    },
    {
      massNumber: 37,
      isStable: true,
      abundance: "≈24.2%",
      description:
        "The heavier stable chlorine isotope; together with Cl-35 it gives chlorine its ≈35.45 average mass.",
    },
  ]),

  element("Ar", "Argon", 18, [
    {
      massNumber: 36,
      isStable: true,
      abundance: "≈0.33%",
      description: "A rare stable argon isotope.",
    },
    {
      massNumber: 38,
      isStable: true,
      abundance: "≈0.06%",
      description: "The rarest stable argon isotope.",
    },
    {
      massNumber: 40,
      isStable: true,
      abundance: "≈99.6%",
      description:
        "The dominant argon isotope on Earth, produced largely by potassium-40 decay.",
    },
  ]),

  element("K", "Potassium", 19, [
    {
      massNumber: 39,
      isStable: true,
      abundance: "≈93.3%",
      description: "The most common potassium isotope.",
    },
    {
      massNumber: 40,
      isStable: false,
      abundance: "≈0.012%",
      halfLife: "≈1.25 billion years",
      description:
        "A long-lived radioactive isotope present in all natural potassium; a notable source of natural radioactivity.",
    },
    {
      massNumber: 41,
      isStable: true,
      abundance: "≈6.7%",
      description: "The heavier stable potassium isotope.",
    },
  ]),

  element("Ca", "Calcium", 20, [
    {
      massNumber: 40,
      isStable: true,
      abundance: "≈96.9%",
      description: "The dominant calcium isotope: twenty protons and twenty neutrons.",
    },
    {
      massNumber: 42,
      isStable: true,
      abundance: "≈0.65%",
      description: "A rare stable calcium isotope.",
    },
    {
      massNumber: 43,
      isStable: true,
      abundance: "≈0.14%",
      description: "A rare stable calcium isotope used in NMR.",
    },
    {
      massNumber: 44,
      isStable: true,
      abundance: "≈2.1%",
      description: "The second most abundant stable calcium isotope.",
    },
    {
      massNumber: 46,
      isStable: true,
      abundance: "≈0.004%",
      description: "An extremely rare stable calcium isotope.",
    },
    {
      massNumber: 48,
      isStable: true,
      abundance: "≈0.19%",
      description:
        "A neutron-rich calcium isotope. Effectively stable on practical timescales and used in rare nuclear-physics studies.",
    },
  ]),

  element("Fe", "Iron", 26, [
    {
      massNumber: 54,
      isStable: true,
      abundance: "≈5.85%",
      description: "A stable iron isotope with twenty-eight neutrons.",
    },
    {
      massNumber: 56,
      isStable: true,
      abundance: "≈91.75%",
      description:
        "The dominant iron isotope and one of the most tightly bound nuclei in nature.",
    },
    {
      massNumber: 57,
      isStable: true,
      abundance: "≈2.12%",
      description: "A stable iron isotope widely used in Mössbauer spectroscopy.",
    },
    {
      massNumber: 58,
      isStable: true,
      abundance: "≈0.28%",
      description: "The rarest stable iron isotope.",
    },
  ]),

  element("Cu", "Copper", 29, [
    {
      massNumber: 63,
      isStable: true,
      abundance: "≈69.2%",
      description: "The most common copper isotope: twenty-nine protons, thirty-four neutrons.",
    },
    {
      massNumber: 65,
      isStable: true,
      abundance: "≈30.8%",
      description: "The heavier stable copper isotope.",
    },
  ]),

  element("Ag", "Silver", 47, [
    {
      massNumber: 107,
      isStable: true,
      abundance: "≈51.8%",
      description: "The slightly more abundant of silver's two stable isotopes.",
    },
    {
      massNumber: 109,
      isStable: true,
      abundance: "≈48.2%",
      description: "The heavier stable silver isotope.",
    },
  ]),

  element("Au", "Gold", 79, [
    {
      massNumber: 197,
      isStable: true,
      abundance: "100%",
      description:
        "Gold's only stable isotope: seventy-nine protons and one hundred eighteen neutrons. All natural gold is Au-197.",
    },
  ]),

  element("Pb", "Lead", 82, [
    {
      massNumber: 204,
      isStable: true,
      abundance: "≈1.4%",
      description: "The rarest stable lead isotope.",
    },
    {
      massNumber: 206,
      isStable: true,
      abundance: "≈24.1%",
      description: "A stable lead isotope and the end product of the uranium-238 decay chain.",
    },
    {
      massNumber: 207,
      isStable: true,
      abundance: "≈22.1%",
      description: "A stable lead isotope and the end product of the uranium-235 decay chain.",
    },
    {
      massNumber: 208,
      isStable: true,
      abundance: "≈52.4%",
      description:
        "The most abundant lead isotope and the heaviest known stable nucleus, ending the thorium-232 decay chain.",
    },
  ]),

  element("U", "Uranium", 92, [
    {
      massNumber: 234,
      isStable: false,
      abundance: "≈0.005%",
      halfLife: "≈245,500 years",
      description:
        "A trace radioactive uranium isotope formed within the uranium-238 decay chain.",
    },
    {
      massNumber: 235,
      isStable: false,
      abundance: "≈0.72%",
      halfLife: "≈704 million years",
      description:
        "The fissile uranium isotope used to sustain chain reactions in reactors and weapons.",
    },
    {
      massNumber: 238,
      isStable: false,
      abundance: "≈99.27%",
      halfLife: "≈4.47 billion years",
      description:
        "The most abundant uranium isotope; not readily fissile but fertile, breeding into plutonium-239.",
    },
  ]),
]);
