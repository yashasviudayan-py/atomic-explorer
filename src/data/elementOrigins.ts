import type {
  CosmicEpoch,
  ElementOriginCategory,
  ElementOriginEntry,
  ElementOriginSource,
} from "@/types/elementOrigin";

/**
 * A simplified educational map of where the elements come from.
 *
 * Every element heavier than helium has more than one production channel, and
 * the relative contributions are still measured, modelled, and argued over. The
 * `primarySource` below is the channel usually described as dominant for that
 * element's abundance in the Solar System; `secondarySources` names other
 * channels that matter. Entries marked `simplified` are genuine mixtures where
 * no single channel deserves the credit — the color is a label, not a result.
 *
 * Two flattenings are worth naming explicitly:
 *
 * 1. "Stellar fusion" here also carries the slow neutron capture process
 *    (s-process) that happens in dying low- and intermediate-mass stars. That
 *    is neutron capture, not fusion, but both are quiet stellar production and
 *    splitting them would add a category the story does not need.
 * 2. Elements from 84–91 (polonium through protactinium) exist on Earth only as
 *    short-lived decay products of uranium and thorium. They inherit the origin
 *    of their parents, which is the r-process.
 */

export const ORIGIN_CATEGORIES: ElementOriginCategory[] = [
  {
    id: "big-bang",
    label: "Big Bang nucleosynthesis",
    shortLabel: "Big Bang",
    description:
      "Formed in the first minutes of the universe: mostly hydrogen and helium, with a trace of lithium.",
    accentClass: "origin-src-big-bang",
  },
  {
    id: "cosmic-ray-spallation",
    label: "Cosmic ray spallation",
    shortLabel: "Cosmic rays",
    description:
      "Formed when high-energy cosmic rays shatter heavier nuclei in interstellar space.",
    accentClass: "origin-src-cosmic-ray-spallation",
  },
  {
    id: "stellar-fusion",
    label: "Stellar fusion and dying stars",
    shortLabel: "Stars",
    description:
      "Built inside stars — by fusion, and by slow neutron capture in dying low-mass stars.",
    accentClass: "origin-src-stellar-fusion",
  },
  {
    id: "supernova",
    label: "Supernovae",
    shortLabel: "Supernovae",
    description:
      "Made and scattered by exploding stars, both collapsing massive stars and thermonuclear supernovae.",
    accentClass: "origin-src-supernova",
  },
  {
    id: "neutron-star-merger",
    label: "Neutron star mergers",
    shortLabel: "Mergers",
    description:
      "Associated with rapid neutron capture (the r-process) in extremely neutron-rich collisions.",
    accentClass: "origin-src-neutron-star-merger",
  },
  {
    id: "human-synthesis",
    label: "Human synthesis",
    shortLabel: "Human-made",
    description:
      "Produced in reactors and particle accelerators. Most are unstable and decay quickly.",
    accentClass: "origin-src-human-synthesis",
  },
  {
    id: "multiple",
    label: "Several comparable sources",
    shortLabel: "Mixed",
    description:
      "No single channel dominates — these elements arrive from two or more pathways in comparable amounts.",
    accentClass: "origin-src-multiple",
  },
];

export const ORIGIN_CATEGORY_BY_ID: Record<
  ElementOriginSource,
  ElementOriginCategory
> = Object.fromEntries(
  ORIGIN_CATEGORIES.map((category) => [category.id, category]),
) as Record<ElementOriginSource, ElementOriginCategory>;

/** Shared copy for the many post-iron elements with genuinely mixed origins. */
const MIXED_HEAVY =
  "Both slow neutron capture in dying stars and rapid capture in explosive events contribute meaningfully.";

/** Shared copy for decay-chain-only elements between polonium and protactinium. */
const DECAY_PRODUCT =
  "Occurs on Earth only as a fleeting decay product of uranium and thorium, so it inherits their r-process origin.";

export const ELEMENT_ORIGINS: ElementOriginEntry[] = [
  {
    symbol: "H",
    primarySource: "big-bang",
    explanation:
      "Its nuclei are single protons left over from the first minutes of the universe. Still the most abundant element.",
    confidence: "high",
  },
  {
    symbol: "He",
    primarySource: "big-bang",
    secondarySources: ["stellar-fusion"],
    explanation:
      "Mostly primordial, formed alongside hydrogen. Stars have been adding more to the total ever since.",
    confidence: "high",
  },
  {
    symbol: "Li",
    primarySource: "multiple",
    secondarySources: ["big-bang", "cosmic-ray-spallation", "stellar-fusion"],
    explanation:
      "A trace was made in the Big Bang. The rest is linked to cosmic ray spallation and to some dying stars and novae.",
    confidence: "simplified",
  },
  {
    symbol: "Be",
    primarySource: "cosmic-ray-spallation",
    explanation:
      "Skipped over by ordinary stellar fusion. Formed almost entirely when cosmic rays break apart heavier nuclei.",
    confidence: "high",
  },
  {
    symbol: "B",
    primarySource: "cosmic-ray-spallation",
    explanation:
      "Like beryllium, chiefly a fragment: cosmic rays striking carbon and oxygen nuclei chip it loose.",
    confidence: "high",
  },
  {
    symbol: "C",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation:
      "Assembled from three helium nuclei by the triple-alpha process, then released by stellar winds and explosions.",
    confidence: "high",
  },
  {
    symbol: "N",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation:
      "Cycled out of the CNO fusion cycle and shed by dying low- and intermediate-mass stars.",
    confidence: "medium",
  },
  {
    symbol: "O",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation:
      "Made when carbon captures a helium nucleus inside massive stars, then scattered when those stars explode.",
    confidence: "high",
  },
  {
    symbol: "F",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation:
      "Fragile and easily destroyed. Several stellar pathways contribute, in proportions still being worked out.",
    confidence: "simplified",
  },
  {
    symbol: "Ne",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation:
      "A product of carbon burning deep in massive stars, ejected when the star finally explodes.",
    confidence: "medium",
  },
  {
    symbol: "Na",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation: "Produced during carbon burning in the interiors of massive stars.",
    confidence: "medium",
  },
  {
    symbol: "Mg",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation: "Built by carbon and neon burning in the shells of massive stars.",
    confidence: "high",
  },
  {
    symbol: "Al",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation:
      "Formed in the carbon- and neon-burning layers of massive stars and released by their explosions.",
    confidence: "medium",
  },
  {
    symbol: "Si",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation:
      "Made by oxygen burning in massive stars, with more created in the explosive burning of a supernova.",
    confidence: "high",
  },
  {
    symbol: "P",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation: "A minor product of neon and oxygen burning inside massive stars.",
    confidence: "medium",
  },
  {
    symbol: "S",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation: "Produced by oxygen burning and by explosive burning during supernovae.",
    confidence: "high",
  },
  {
    symbol: "Cl",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation: "A product of oxygen burning in massive stars, dispersed when they explode.",
    confidence: "medium",
  },
  {
    symbol: "Ar",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation: "Forged in oxygen and silicon burning, and in the explosive burning of supernovae.",
    confidence: "medium",
  },
  {
    symbol: "K",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation: "A modest product of oxygen burning in massive stars and of explosive burning.",
    confidence: "medium",
  },
  {
    symbol: "Ca",
    primarySource: "stellar-fusion",
    secondarySources: ["supernova"],
    explanation:
      "Made by silicon and oxygen burning in massive stars. The calcium in your bones passed through one.",
    confidence: "high",
  },
  {
    symbol: "Sc",
    primarySource: "supernova",
    secondarySources: ["stellar-fusion"],
    explanation:
      "A rare, awkward element that current models underproduce. Explosive burning appears to be the main source.",
    confidence: "simplified",
  },
  {
    symbol: "Ti",
    primarySource: "supernova",
    secondarySources: ["stellar-fusion"],
    explanation: "Chiefly a product of explosive silicon burning during supernovae.",
    confidence: "medium",
  },
  {
    symbol: "V",
    primarySource: "supernova",
    explanation: "Produced in the explosive burning layers of supernovae.",
    confidence: "medium",
  },
  {
    symbol: "Cr",
    primarySource: "supernova",
    explanation:
      "Made by explosive silicon burning, with large contributions from thermonuclear (Type Ia) supernovae.",
    confidence: "medium",
  },
  {
    symbol: "Mn",
    primarySource: "supernova",
    explanation:
      "Largely produced by thermonuclear (Type Ia) supernovae — the detonation of white dwarf stars.",
    confidence: "medium",
  },
  {
    symbol: "Fe",
    primarySource: "supernova",
    secondarySources: ["stellar-fusion"],
    explanation:
      "Fusion builds it in massive-star cores, but supernovae — especially Type Ia — release most of the iron in the galaxy.",
    confidence: "high",
  },
  {
    symbol: "Co",
    primarySource: "supernova",
    explanation: "Formed in explosive burning near the iron peak and released by supernovae.",
    confidence: "medium",
  },
  {
    symbol: "Ni",
    primarySource: "supernova",
    explanation:
      "Supernovae eject enormous quantities of radioactive nickel-56, whose decay lights the fading explosion.",
    confidence: "high",
  },
  {
    symbol: "Cu",
    primarySource: "supernova",
    secondarySources: ["stellar-fusion"],
    explanation:
      "Sits just past the iron peak, where explosive burning and neutron capture in massive stars both contribute.",
    confidence: "simplified",
  },
  {
    symbol: "Zn",
    primarySource: "supernova",
    secondarySources: ["stellar-fusion"],
    explanation:
      "Produced in the neutrino-driven winds and explosive layers of supernovae, with a stellar contribution too.",
    confidence: "simplified",
  },
  {
    symbol: "Ga",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "supernova"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Ge",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "supernova"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "As",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Se",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Br",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Kr",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Rb",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Sr",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation:
      "Mostly slow neutron capture in dying low-mass stars, which pile neutrons onto iron seeds one at a time.",
    confidence: "medium",
  },
  {
    symbol: "Y",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation: "An important source is slow neutron capture in dying low-mass stars.",
    confidence: "medium",
  },
  {
    symbol: "Zr",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation: "Chiefly built by slow neutron capture in the interiors of dying low-mass stars.",
    confidence: "medium",
  },
  {
    symbol: "Nb",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Mo",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Tc",
    primarySource: "human-synthesis",
    explanation:
      "Has no stable isotope. Natural traces exist in uranium ores, but essentially all of it in use is made artificially.",
    confidence: "medium",
  },
  {
    symbol: "Ru",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Rh",
    primarySource: "neutron-star-merger",
    secondarySources: ["supernova"],
    explanation: "Dominated by rapid neutron capture, so it is associated with violent, neutron-rich events.",
    confidence: "simplified",
  },
  {
    symbol: "Pd",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Ag",
    primarySource: "neutron-star-merger",
    secondarySources: ["supernova"],
    explanation: "Mostly an r-process element: silver is a product of rapid neutron capture.",
    confidence: "simplified",
  },
  {
    symbol: "Cd",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "In",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Sn",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation:
      "Its many stable isotopes make it a favoured landing spot for slow neutron capture in dying stars.",
    confidence: "simplified",
  },
  {
    symbol: "Sb",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Te",
    primarySource: "neutron-star-merger",
    secondarySources: ["supernova"],
    explanation: "Largely an r-process element, built by rapid neutron capture in neutron-rich environments.",
    confidence: "simplified",
  },
  {
    symbol: "I",
    primarySource: "neutron-star-merger",
    secondarySources: ["supernova"],
    explanation: "Chiefly a product of rapid neutron capture rather than quiet stellar production.",
    confidence: "simplified",
  },
  {
    symbol: "Xe",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Cs",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Ba",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation:
      "A classic slow-neutron-capture element, so abundant in dying low-mass stars that they are named for it.",
    confidence: "medium",
  },
  {
    symbol: "La",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation: "An important source is slow neutron capture in dying low-mass stars.",
    confidence: "medium",
  },
  {
    symbol: "Ce",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation: "Mostly built by slow neutron capture in the shells of dying low-mass stars.",
    confidence: "medium",
  },
  {
    symbol: "Pr",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation: "An important source is slow neutron capture in dying low-mass stars.",
    confidence: "simplified",
  },
  {
    symbol: "Nd",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation: "Mostly slow neutron capture, with a real r-process contribution as well.",
    confidence: "simplified",
  },
  {
    symbol: "Pm",
    primarySource: "human-synthesis",
    explanation:
      "Has no stable isotope. Only vanishing natural traces survive, so usable promethium comes from reactors.",
    confidence: "medium",
  },
  {
    symbol: "Sm",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Eu",
    primarySource: "neutron-star-merger",
    secondarySources: ["supernova"],
    explanation:
      "Astronomers treat europium as the fingerprint of the r-process when reading the chemistry of old stars.",
    confidence: "medium",
  },
  {
    symbol: "Gd",
    primarySource: "neutron-star-merger",
    secondarySources: ["stellar-fusion"],
    explanation: "Dominated by rapid neutron capture in extremely neutron-rich environments.",
    confidence: "simplified",
  },
  {
    symbol: "Tb",
    primarySource: "neutron-star-merger",
    explanation: "An r-process element: built by rapid neutron capture, not by ordinary stellar burning.",
    confidence: "simplified",
  },
  {
    symbol: "Dy",
    primarySource: "neutron-star-merger",
    secondarySources: ["stellar-fusion"],
    explanation: "Mostly a product of rapid neutron capture in violent, neutron-rich events.",
    confidence: "simplified",
  },
  {
    symbol: "Ho",
    primarySource: "neutron-star-merger",
    explanation: "An r-process element, associated with neutron star mergers and related extreme environments.",
    confidence: "simplified",
  },
  {
    symbol: "Er",
    primarySource: "neutron-star-merger",
    secondarySources: ["stellar-fusion"],
    explanation: "Chiefly built by rapid neutron capture rather than by slow capture in quiet stars.",
    confidence: "simplified",
  },
  {
    symbol: "Tm",
    primarySource: "neutron-star-merger",
    explanation: "An r-process element, produced where free neutrons are briefly, spectacularly abundant.",
    confidence: "simplified",
  },
  {
    symbol: "Yb",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Lu",
    primarySource: "neutron-star-merger",
    secondarySources: ["stellar-fusion"],
    explanation: "Mostly an r-process element, with a smaller contribution from slow neutron capture.",
    confidence: "simplified",
  },
  {
    symbol: "Hf",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation: "An important source is slow neutron capture in dying low-mass stars.",
    confidence: "simplified",
  },
  {
    symbol: "Ta",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "W",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Re",
    primarySource: "neutron-star-merger",
    explanation: "Chiefly an r-process element, forged where nuclei are flooded with neutrons.",
    confidence: "simplified",
  },
  {
    symbol: "Os",
    primarySource: "neutron-star-merger",
    secondarySources: ["stellar-fusion"],
    explanation: "Dominated by rapid neutron capture in neutron-rich cosmic collisions.",
    confidence: "simplified",
  },
  {
    symbol: "Ir",
    primarySource: "neutron-star-merger",
    secondarySources: ["supernova"],
    explanation:
      "An r-process metal. The iridium layer marking the dinosaur extinction is asteroid material — itself stellar debris.",
    confidence: "medium",
  },
  {
    symbol: "Pt",
    primarySource: "neutron-star-merger",
    secondarySources: ["supernova"],
    explanation:
      "Neutron star mergers are considered a major source. Some supernova environments may contribute as well.",
    confidence: "high",
  },
  {
    symbol: "Au",
    primarySource: "neutron-star-merger",
    secondarySources: ["supernova"],
    explanation:
      "Neutron star mergers are a major source of gold. Rare supernova environments may also contribute.",
    confidence: "high",
  },
  {
    symbol: "Hg",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Tl",
    primarySource: "multiple",
    secondarySources: ["stellar-fusion", "neutron-star-merger"],
    explanation: MIXED_HEAVY,
    confidence: "simplified",
  },
  {
    symbol: "Pb",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation:
      "The endpoint of slow neutron capture. More lead keeps arriving as uranium and thorium decay.",
    confidence: "medium",
  },
  {
    symbol: "Bi",
    primarySource: "stellar-fusion",
    secondarySources: ["neutron-star-merger"],
    explanation:
      "The heaviest element with a near-stable isotope, reached by both slow and rapid neutron capture.",
    confidence: "simplified",
  },
  { symbol: "Po", primarySource: "neutron-star-merger", explanation: DECAY_PRODUCT, confidence: "simplified" },
  { symbol: "At", primarySource: "neutron-star-merger", explanation: DECAY_PRODUCT, confidence: "simplified" },
  { symbol: "Rn", primarySource: "neutron-star-merger", explanation: DECAY_PRODUCT, confidence: "simplified" },
  { symbol: "Fr", primarySource: "neutron-star-merger", explanation: DECAY_PRODUCT, confidence: "simplified" },
  { symbol: "Ra", primarySource: "neutron-star-merger", explanation: DECAY_PRODUCT, confidence: "simplified" },
  { symbol: "Ac", primarySource: "neutron-star-merger", explanation: DECAY_PRODUCT, confidence: "simplified" },
  {
    symbol: "Th",
    primarySource: "neutron-star-merger",
    secondarySources: ["supernova"],
    explanation:
      "An r-process element with a half-life comparable to the age of the universe, which is why any survives at all.",
    confidence: "high",
  },
  { symbol: "Pa", primarySource: "neutron-star-merger", explanation: DECAY_PRODUCT, confidence: "simplified" },
  {
    symbol: "U",
    primarySource: "neutron-star-merger",
    secondarySources: ["supernova"],
    explanation:
      "Requires rapid neutron capture. The uranium warming Earth's interior predates the Sun that Earth orbits.",
    confidence: "high",
  },
  {
    symbol: "Np",
    primarySource: "human-synthesis",
    explanation:
      "The first transuranium element. Trace amounts occur in uranium ores; useful quantities come from reactors.",
    confidence: "medium",
  },
  {
    symbol: "Pu",
    primarySource: "human-synthesis",
    explanation:
      "Minute natural traces exist in uranium ores, but effectively all plutonium on Earth was made in reactors.",
    confidence: "medium",
  },
  {
    symbol: "Am",
    primarySource: "human-synthesis",
    explanation:
      "Made in reactors by loading plutonium with neutrons. A speck of it sits in many smoke detectors.",
    confidence: "high",
  },
  {
    symbol: "Cm",
    primarySource: "human-synthesis",
    explanation: "Produced in reactors and accelerators by bombarding lighter actinides.",
    confidence: "high",
  },
  {
    symbol: "Bk",
    primarySource: "human-synthesis",
    explanation: "Synthetic, made in high-flux reactors. Only fractions of a gram have ever been produced.",
    confidence: "high",
  },
  {
    symbol: "Cf",
    primarySource: "human-synthesis",
    explanation: "Synthetic and intensely radioactive; reactor-made, and used as a portable neutron source.",
    confidence: "high",
  },
  {
    symbol: "Es",
    primarySource: "human-synthesis",
    explanation: "First identified in the debris of a 1952 thermonuclear test. Now made in reactors.",
    confidence: "high",
  },
  {
    symbol: "Fm",
    primarySource: "human-synthesis",
    explanation:
      "Also first found in thermonuclear test debris. The heaviest element reachable by neutron capture alone.",
    confidence: "high",
  },
  {
    symbol: "Md",
    primarySource: "human-synthesis",
    explanation: "Synthetic. Beyond fermium, elements must be assembled by firing nuclei at each other.",
    confidence: "high",
  },
  {
    symbol: "No",
    primarySource: "human-synthesis",
    explanation: "Synthetic, produced an atom at a time by bombarding actinide targets with ions.",
    confidence: "high",
  },
  {
    symbol: "Lr",
    primarySource: "human-synthesis",
    explanation: "Synthetic and short-lived, made by fusing light ions with californium.",
    confidence: "high",
  },
  {
    symbol: "Rf",
    primarySource: "human-synthesis",
    explanation: "The first transactinide: synthetic, and studied only a few atoms at a time.",
    confidence: "high",
  },
  {
    symbol: "Db",
    primarySource: "human-synthesis",
    explanation: "Synthetic, created in accelerators by fusing heavy nuclei together.",
    confidence: "high",
  },
  {
    symbol: "Sg",
    primarySource: "human-synthesis",
    explanation: "Synthetic and fleeting, yet stable enough for its chemistry to be probed atom by atom.",
    confidence: "high",
  },
  {
    symbol: "Bh",
    primarySource: "human-synthesis",
    explanation: "Synthetic. Its most stable isotopes survive for only seconds.",
    confidence: "high",
  },
  {
    symbol: "Hs",
    primarySource: "human-synthesis",
    explanation: "Synthetic, made by cold fusion of lead and iron nuclei in an accelerator.",
    confidence: "high",
  },
  {
    symbol: "Mt",
    primarySource: "human-synthesis",
    explanation: "Synthetic and so short-lived that its bulk properties have never been measured.",
    confidence: "high",
  },
  {
    symbol: "Ds",
    primarySource: "human-synthesis",
    explanation: "Synthetic, first made by firing nickel nuclei at a lead target.",
    confidence: "high",
  },
  {
    symbol: "Rg",
    primarySource: "human-synthesis",
    explanation: "Synthetic, assembled in an accelerator and detected through its decay chain.",
    confidence: "high",
  },
  {
    symbol: "Cn",
    primarySource: "human-synthesis",
    explanation: "Synthetic. Predicted to be a volatile metal, possibly a gas at room temperature.",
    confidence: "high",
  },
  {
    symbol: "Nh",
    primarySource: "human-synthesis",
    explanation: "Synthetic, and the first element discovered in Japan.",
    confidence: "high",
  },
  {
    symbol: "Fl",
    primarySource: "human-synthesis",
    explanation: "Synthetic, and a candidate for the theorised island of relative nuclear stability.",
    confidence: "high",
  },
  {
    symbol: "Mc",
    primarySource: "human-synthesis",
    explanation: "Synthetic, made by fusing calcium ions with an americium target.",
    confidence: "high",
  },
  {
    symbol: "Lv",
    primarySource: "human-synthesis",
    explanation: "Synthetic. Its atoms exist for milliseconds before decaying.",
    confidence: "high",
  },
  {
    symbol: "Ts",
    primarySource: "human-synthesis",
    explanation: "Synthetic, requiring a berkelium target that itself had to be made in a reactor.",
    confidence: "high",
  },
  {
    symbol: "Og",
    primarySource: "human-synthesis",
    explanation: "The heaviest element yet made. Only a handful of atoms have ever existed.",
    confidence: "high",
  },
];

/** Map of uppercase symbol → origin entry, for fast lookups from the map grid. */
export const ORIGIN_BY_SYMBOL: Record<string, ElementOriginEntry> =
  Object.fromEntries(ELEMENT_ORIGINS.map((entry) => [entry.symbol.toUpperCase(), entry]));

/** Look up an element's origin entry by symbol, case-insensitively. */
export function getOriginBySymbol(symbol: string): ElementOriginEntry | undefined {
  return ORIGIN_BY_SYMBOL[symbol.toUpperCase()];
}

/**
 * The chemical history of the universe, in eight moments. Times are approximate
 * and, from "First stars ignite" onward, the processes overlap rather than
 * succeed one another — stars are still fusing while mergers are still merging.
 */
export const COSMIC_EPOCHS: CosmicEpoch[] = [
  {
    id: "big-bang",
    time: "t = 0",
    title: "The Big Bang",
    description:
      "The universe begins hot, dense, and expanding. There are no atoms yet — only a plasma of fundamental particles.",
    source: "big-bang",
  },
  {
    id: "first-nuclei",
    time: "First 3 minutes",
    title: "The first nuclei",
    description:
      "Protons and neutrons bind into light nuclei. The universe ends up mostly hydrogen and helium, with a trace of lithium.",
    source: "big-bang",
  },
  {
    id: "first-stars",
    time: "~100–200 million years",
    title: "The first stars ignite",
    description:
      "Gravity gathers primordial gas into clouds. The densest regions collapse until fusion begins, and the dark ages end.",
    source: "stellar-fusion",
  },
  {
    id: "stellar-fusion",
    time: "Ever since",
    title: "Stars build the light elements",
    description:
      "Hydrogen fuses to helium, then to carbon and oxygen. In massive stars, fusion continues in layers all the way to iron.",
    source: "stellar-fusion",
  },
  {
    id: "supernovae",
    time: "Ever since",
    title: "Massive stars explode",
    description:
      "Supernovae forge additional elements and scatter a star's entire inventory into space, seeding the next generation.",
    source: "supernova",
  },
  {
    id: "mergers",
    time: "Ever since",
    title: "Neutron stars collide",
    description:
      "In the most neutron-rich places in the universe, rapid neutron capture builds the heaviest natural elements.",
    source: "neutron-star-merger",
  },
  {
    id: "solar-system",
    time: "~4.6 billion years ago",
    title: "Our Solar System forms",
    description:
      "A cloud already enriched by earlier stars collapses. Earth inherits its carbon, iron, gold, and uranium ready-made.",
    source: "multiple",
  },
  {
    id: "human-synthesis",
    time: "Since 1937",
    title: "We start making our own",
    description:
      "Reactors and accelerators extend the periodic table past uranium, into elements the universe does not keep in stock.",
    source: "human-synthesis",
  },
];
