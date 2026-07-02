import type { Lesson } from "@/types/lesson";

/**
 * Local lesson content for Learn Mode.
 *
 * Writing rules applied throughout: every visual is called an "educational
 * model" or "simplified"; electron counts assume a *neutral atom*; quantum
 * orbitals are described as *probability clouds*; nothing claims exact
 * physical scale or exact electron paths.
 */
export const LESSONS: Lesson[] = [
  {
    slug: "what-is-an-atom",
    title: "What Is an Atom?",
    description:
      "Meet the building block of matter: a dense nucleus of protons and neutrons, surrounded by electrons in energy levels.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    order: 1,
    tags: ["basics", "structure", "particles"],
    relatedElementSymbols: ["H", "C", "O"],
    steps: [
      {
        id: "building-blocks",
        type: "concept",
        title: "The building blocks of matter",
        body:
          "Everything you can touch — air, water, rock, your own body — is made of atoms. An atom is the smallest unit of an element that still behaves like that element.\n\nAtoms are astonishingly small: a single drop of water contains more atoms than there are stars in the observable universe.",
      },
      {
        id: "anatomy",
        type: "visual",
        title: "Anatomy of an atom",
        body:
          "An atom has two main regions. At the center sits the nucleus, a tiny, dense core. Around it, electrons occupy energy levels — regions where electrons are found.\n\nThe visual here is a simplified educational model: real atoms are mostly empty space, and the nucleus is far smaller relative to the whole atom than any diagram can honestly show.",
        visualHint: "atom-overview",
        relatedElementSymbols: ["C"],
      },
      {
        id: "inside-the-nucleus",
        type: "concept",
        title: "Inside the nucleus",
        body:
          "The nucleus contains two kinds of particles. Protons carry a positive electric charge. Neutrons carry no charge at all.\n\nTogether they make up nearly all of an atom's mass, packed into a space roughly 100,000 times smaller across than the atom itself.",
        visualHint: "particle-diagram",
      },
      {
        id: "electrons-energy-levels",
        type: "concept",
        title: "Electrons and energy levels",
        body:
          "Electrons are negatively charged particles that occupy energy levels around the nucleus. In a neutral atom, the number of electrons equals the number of protons, so the charges balance.\n\nEnergy levels are often drawn as rings or shells. That is a useful simplification — electrons do not travel on fixed circular tracks.",
      },
      {
        id: "model-not-photograph",
        type: "concept",
        title: "A model, not a photograph",
        body:
          "No diagram of an atom is a photograph. The orbiting-electron picture you'll see across Atomic Explorer is an educational model chosen for clarity.\n\nLater lessons show a more realistic view: electrons as probability clouds rather than dots on rings. Both models are useful — for different questions.",
      },
      {
        id: "check-nucleus",
        type: "checkpoint",
        title: "Checkpoint",
        body: "Quick check before we move on.",
        checkpoint: {
          question: "Which particles are found in the nucleus of an atom?",
          options: [
            {
              id: "a",
              text: "Protons and neutrons",
              isCorrect: true,
              explanation:
                "Correct. The nucleus holds the protons and neutrons, which together account for nearly all of the atom's mass.",
            },
            {
              id: "b",
              text: "Protons and electrons",
              isCorrect: false,
              explanation:
                "Not quite. Electrons occupy energy levels around the nucleus — they are not part of it.",
            },
            {
              id: "c",
              text: "Electrons and neutrons",
              isCorrect: false,
              explanation:
                "Neutrons are in the nucleus, but electrons occupy the energy levels around it.",
            },
            {
              id: "d",
              text: "Only electrons",
              isCorrect: false,
              explanation:
                "Electrons surround the nucleus. The nucleus itself is made of protons and neutrons.",
            },
          ],
        },
      },
      {
        id: "summary",
        type: "summary",
        title: "What you learned",
        body:
          "Atoms are the building blocks of matter. Each has a dense nucleus of protons (positive) and neutrons (neutral), with electrons (negative) occupying energy levels around it.\n\nIn a neutral atom, electrons equal protons. And every atom diagram — including ours — is a simplified educational model, not a literal picture.",
      },
    ],
  },
  {
    slug: "protons-define-elements",
    title: "Protons Define the Element",
    description:
      "The atomic number is a proton count — and changing it changes what the element is.",
    difficulty: "beginner",
    estimatedMinutes: 5,
    order: 2,
    tags: ["atomic number", "protons", "identity"],
    relatedElementSymbols: ["H", "C", "O"],
    steps: [
      {
        id: "atomic-number",
        type: "concept",
        title: "The atomic number",
        body:
          "Every element has an atomic number: the number of protons in its nucleus. Hydrogen's atomic number is 1, carbon's is 6, oxygen's is 8.\n\nThis single number is the element's identity. It is why the periodic table can order all known matter into one chart.",
      },
      {
        id: "proton-count-tiles",
        type: "visual",
        title: "One number, one element",
        body:
          "Look at the three tiles here. The large symbol is the element; the small number above it is the atomic number — the proton count.\n\nHydrogen has exactly 1 proton. Carbon has exactly 6. Oxygen has exactly 8. There is no carbon atom anywhere in the universe with 7 protons — that atom would be nitrogen.",
        visualHint: "periodic-tile",
        relatedElementSymbols: ["H", "C", "O"],
      },
      {
        id: "change-protons",
        type: "concept",
        title: "Change the protons, change the element",
        body:
          "Add a proton to carbon (6) and you get nitrogen (7). Add another and you get oxygen (8). Proton count isn't a property of an element — it is the element.\n\nThis is different from neutrons and electrons, which can vary without changing what the element is. We'll cover both cases in the next lessons.",
      },
      {
        id: "neutral-atoms",
        type: "concept",
        title: "Neutral atoms balance the charge",
        body:
          "A neutral atom has the same number of electrons as protons, so the positive and negative charges cancel out.\n\nOxygen's 8 protons are balanced by 8 electrons. Atomic Explorer's visualizations assume neutral atoms, which is why the electron count always matches the atomic number.",
        visualHint: "particle-diagram",
        relatedElementSymbols: ["O"],
      },
      {
        id: "check-identity",
        type: "checkpoint",
        title: "Checkpoint",
        body: "The core idea of this lesson, as a question.",
        checkpoint: {
          question: "What determines the identity of an element?",
          options: [
            {
              id: "a",
              text: "Number of protons",
              isCorrect: true,
              explanation:
                "Correct. The proton count is the atomic number. Changing the proton count changes the element.",
            },
            {
              id: "b",
              text: "Number of neutrons",
              isCorrect: false,
              explanation:
                "Neutron count can vary within the same element — those variants are called isotopes. Identity comes from protons.",
            },
            {
              id: "c",
              text: "Number of electron shells",
              isCorrect: false,
              explanation:
                "Shell count grows with electron count, but many different elements share the same number of shells.",
            },
            {
              id: "d",
              text: "Atomic mass only",
              isCorrect: false,
              explanation:
                "Mass depends on protons and neutrons together, so two different elements can have similar masses. The proton count alone defines identity.",
            },
          ],
        },
      },
      {
        id: "summary",
        type: "summary",
        title: "What you learned",
        body:
          "The atomic number is the proton count, and it defines the element: hydrogen 1, carbon 6, oxygen 8. Change the protons and you have a different element.\n\nA neutral atom balances its protons with an equal number of electrons.",
      },
    ],
  },
  {
    slug: "neutrons-and-isotopes",
    title: "Neutrons and Isotopes",
    description:
      "Same element, different mass: how neutron count creates isotopes like carbon-12 and carbon-14.",
    difficulty: "beginner",
    estimatedMinutes: 6,
    order: 3,
    tags: ["isotopes", "neutrons", "stability"],
    relatedElementSymbols: ["H", "C", "U"],
    steps: [
      {
        id: "same-element-different-mass",
        type: "concept",
        title: "Same element, different mass",
        body:
          "Protons define the element — but neutrons are more flexible. Two atoms can both be carbon (6 protons each) yet carry different numbers of neutrons.\n\nThese variants are called isotopes: same element, same chemistry, different mass.",
      },
      {
        id: "what-is-an-isotope",
        type: "concept",
        title: "Naming isotopes",
        body:
          "An isotope is named by its mass number: protons plus neutrons. Carbon-12 has 6 protons and 6 neutrons. Carbon-14 has 6 protons and 8 neutrons.\n\nBoth are carbon, because both have 6 protons. The number after the dash only tells you how heavy the nucleus is.",
      },
      {
        id: "c12-vs-c14",
        type: "visual",
        title: "Carbon-12 vs carbon-14",
        body:
          "Compare the two nuclei side by side. The proton count is identical — that's what keeps them both carbon. Only the neutron count differs.\n\nCarbon-12 makes up almost all natural carbon. Carbon-14 is rare and radioactive, which is exactly what makes it useful for dating ancient organic material.",
        visualHint: "isotope-comparison",
        relatedElementSymbols: ["C"],
      },
      {
        id: "stable-vs-unstable",
        type: "concept",
        title: "Stable vs unstable",
        body:
          "Some neutron counts give a nucleus that holds together indefinitely — a stable isotope. Others create an unstable nucleus that eventually decays, releasing radiation.\n\nCarbon-12 is stable. Carbon-14 is unstable, with a half-life of about 5,730 years. Heavy elements like uranium have no stable isotopes at all.",
        relatedElementSymbols: ["U"],
      },
      {
        id: "check-isotopes",
        type: "checkpoint",
        title: "Checkpoint",
        body: "Test the key distinction.",
        checkpoint: {
          question: "Two isotopes of the same element always differ in their…",
          options: [
            {
              id: "a",
              text: "Number of neutrons",
              isCorrect: true,
              explanation:
                "Correct. Isotopes share a proton count (same element) but differ in neutron count, and therefore in mass number.",
            },
            {
              id: "b",
              text: "Number of protons",
              isCorrect: false,
              explanation:
                "If the proton counts differed, they would be different elements — not isotopes of the same one.",
            },
            {
              id: "c",
              text: "Electric charge",
              isCorrect: false,
              explanation:
                "Charge depends on the electron–proton balance. Isotopes are about the nucleus: same protons, different neutrons.",
            },
            {
              id: "d",
              text: "Chemical identity",
              isCorrect: false,
              explanation:
                "Isotopes of an element are chemically almost identical, because chemistry is driven by electrons and protons — not neutrons.",
            },
          ],
        },
      },
      {
        id: "mass-not-identity",
        type: "concept",
        title: "Mass changes, identity doesn't",
        body:
          "Adding neutrons makes an atom heavier and can change its stability — but it never changes which element it is.\n\nThat's why the isotope selector in the 3D Atom Explorer changes only the neutron spheres in the nucleus: the element, its electrons, and its chemistry stay the same.",
      },
      {
        id: "summary",
        type: "summary",
        title: "What you learned",
        body:
          "Isotopes are atoms with the same proton count but different neutron counts — same element, different mass number. Some isotopes are stable; others decay over time.\n\nCarbon-12 and carbon-14 are the classic pair: identical chemistry, very different nuclear stability.",
      },
    ],
  },
  {
    slug: "electrons-and-shells",
    title: "Electrons and Shells",
    description:
      "How electrons fill simplified energy levels, and why the outermost shell decides an element's chemistry.",
    difficulty: "intermediate",
    estimatedMinutes: 7,
    order: 4,
    tags: ["electrons", "shells", "valence"],
    relatedElementSymbols: ["Na", "Cl", "Ne"],
    steps: [
      {
        id: "negative-particle",
        type: "concept",
        title: "The negative particle",
        body:
          "Electrons carry a negative charge and are extraordinarily light — about 1/1836 the mass of a proton. Nearly all of an atom's volume is the region its electrons occupy.\n\nIn a neutral atom, electron count equals proton count, so sodium (11 protons) has 11 electrons.",
      },
      {
        id: "energy-levels-as-shells",
        type: "concept",
        title: "Energy levels as shells",
        body:
          "Electrons occupy distinct energy levels. In the simplified Bohr-style model, each level is drawn as a shell — a ring around the nucleus — with a capacity that grows outward: the first holds up to 2 electrons, the second up to 8.\n\nElectrons fill inner shells before outer ones. Shells are a teaching model: real energy levels don't look like rings, but the filling order they describe is real.",
      },
      {
        id: "sodium-shells",
        type: "visual",
        title: "Sodium's shells: 2 · 8 · 1",
        body:
          "Sodium's 11 electrons arrange as 2 in the first shell, 8 in the second, and a single electron alone in the third.\n\nThat lone outer electron is loosely held — which is exactly why sodium is so eager to react, handing its outer electron away at the slightest provocation.",
        visualHint: "shell-distribution",
        relatedElementSymbols: ["Na"],
      },
      {
        id: "valence-drives-chemistry",
        type: "comparison",
        title: "The outer shell drives chemistry",
        body:
          "Compare three period-3 neighbors. Sodium (2·8·1) wants to lose one electron. Chlorine (2·8·7) wants to gain one. Neon's outer shell is already full (2·8) — so it barely reacts at all.\n\nThe electrons in the outermost shell are called valence electrons, and they dominate how an element bonds.",
        visualHint: "periodic-tile",
        relatedElementSymbols: ["Na", "Cl", "Ne"],
      },
      {
        id: "check-valence",
        type: "checkpoint",
        title: "Checkpoint",
        body: "One question on the key idea.",
        checkpoint: {
          question: "Which electrons most influence how an element bonds?",
          options: [
            {
              id: "a",
              text: "Electrons in the outermost shell",
              isCorrect: true,
              explanation:
                "Correct. Valence electrons — the outermost ones — determine how readily an atom gives, takes, or shares electrons.",
            },
            {
              id: "b",
              text: "Electrons in the innermost shell",
              isCorrect: false,
              explanation:
                "Inner electrons are tightly bound close to the nucleus and rarely participate in bonding.",
            },
            {
              id: "c",
              text: "All electrons equally",
              isCorrect: false,
              explanation:
                "Bonding is dominated by the outermost electrons. Inner shells are effectively spectators in most chemistry.",
            },
            {
              id: "d",
              text: "Electrons don't affect bonding",
              isCorrect: false,
              explanation:
                "Bonding is electron behavior — atoms bond by transferring or sharing their outer electrons.",
            },
          ],
        },
      },
      {
        id: "useful-simplification",
        type: "concept",
        title: "A useful simplification",
        body:
          "The shell picture is an educational model. Real electrons occupy quantum orbitals — probability regions with distinct shapes — and shell capacities emerge from deeper quantum rules.\n\nBut the model earns its keep: shell counts correctly predict the periodic table's structure and most bonding behavior. The next lesson shows what the fuller picture looks like.",
      },
      {
        id: "summary",
        type: "summary",
        title: "What you learned",
        body:
          "Electrons are negative, nearly massless, and occupy energy levels drawn as shells in the simplified model. Inner shells fill first, and the outermost (valence) electrons drive bonding.\n\nSodium's lone outer electron makes it reactive; neon's full shell makes it inert.",
      },
    ],
  },
  {
    slug: "bohr-vs-quantum",
    title: "Bohr Model vs Quantum Cloud",
    description:
      "Rings vs probability clouds: what the Bohr model gets right, and what quantum mechanics actually says.",
    difficulty: "advanced",
    estimatedMinutes: 8,
    order: 5,
    tags: ["quantum", "orbitals", "models"],
    relatedElementSymbols: ["H", "C", "Fe"],
    steps: [
      {
        id: "two-pictures",
        type: "concept",
        title: "Two ways to picture an atom",
        body:
          "The Bohr model draws electrons as dots orbiting on fixed rings, like planets around a star. It's simple, visual, and historically important — and it's a teaching model, not how electrons actually behave.\n\nQuantum mechanics replaces the rings with something stranger: probability.",
      },
      {
        id: "rings-vs-cloud",
        type: "visual",
        title: "Rings vs cloud",
        body:
          "Side by side: the Bohr view with its clean orbits, and the quantum view where the electron is a fuzzy cloud of possible positions.\n\nIn the quantum picture there is no path at all. Before measurement, the electron doesn't have a single location — the cloud's density shows where it is more or less likely to be found.",
        visualHint: "bohr-vs-quantum",
        relatedElementSymbols: ["H"],
      },
      {
        id: "orbitals-probability",
        type: "concept",
        title: "Orbitals are probability regions",
        body:
          "A quantum orbital is a region of space where an electron is likely to be found — a probability cloud, not a track. Denser regions of the cloud mean higher probability.\n\nEach orbital holds at most two electrons, and orbitals group into the energy levels the shell model approximates.",
      },
      {
        id: "orbital-shapes",
        type: "concept",
        title: "The s, p, d, f shapes",
        body:
          "Orbitals come in families with characteristic shapes: s orbitals are spherical, p orbitals form paired lobes, and d and f orbitals grow more intricate.\n\nThe shapes you see in Atomic Explorer's Quantum Cloud mode are simplified visualizations of these probability regions — real orbitals are smooth density gradients without hard edges.",
      },
      {
        id: "check-orbital",
        type: "checkpoint",
        title: "Checkpoint",
        body: "The heart of the quantum picture.",
        checkpoint: {
          question: "In the quantum model, what is an orbital?",
          options: [
            {
              id: "a",
              text: "A region where an electron is likely to be found",
              isCorrect: true,
              explanation:
                "Correct. An orbital is a probability region — a cloud describing where the electron is likely to be, not a path it follows.",
            },
            {
              id: "b",
              text: "The exact circular path an electron follows",
              isCorrect: false,
              explanation:
                "Fixed circular paths belong to the Bohr teaching model. Quantum electrons have no defined trajectory.",
            },
            {
              id: "c",
              text: "The space between two shells",
              isCorrect: false,
              explanation:
                "Orbitals aren't gaps — they're the probability regions electrons occupy, grouped into energy levels.",
            },
            {
              id: "d",
              text: "A particle inside the nucleus",
              isCorrect: false,
              explanation:
                "The nucleus contains protons and neutrons. Orbitals describe the electrons around it.",
            },
          ],
        },
      },
      {
        id: "why-keep-bohr",
        type: "concept",
        title: "Why keep the Bohr model at all?",
        body:
          "Because good models trade accuracy for insight. The Bohr model makes electron counts, shell filling, and reactivity easy to see at a glance — things the full quantum picture buries in mathematics.\n\nAtomic Explorer shows both on every element page: use Bohr mode to count and compare, and Quantum Cloud mode to remember what the atom is really like.",
      },
      {
        id: "summary",
        type: "summary",
        title: "What you learned",
        body:
          "The Bohr model's rings are a deliberate simplification. In quantum mechanics, electrons occupy orbitals — probability clouds with characteristic s, p, d, and f shapes — and have no exact paths.\n\nBoth models are tools: one for clarity, one for truth.",
      },
    ],
  },
  {
    slug: "reading-the-periodic-table",
    title: "Reading the Periodic Table",
    description:
      "Decode any element tile, then read the table's deeper structure: groups, periods, blocks, and categories.",
    difficulty: "intermediate",
    estimatedMinutes: 8,
    order: 6,
    tags: ["periodic table", "groups", "blocks"],
    relatedElementSymbols: ["H", "He", "Fe", "Au", "U"],
    steps: [
      {
        id: "anatomy-of-a-tile",
        type: "concept",
        title: "Anatomy of a tile",
        body:
          "Every tile on the periodic table carries the same four facts: the atomic number (proton count), the chemical symbol, the element's name, and its standard atomic mass.\n\nMass appears in brackets for elements with no stable isotope — a small honesty built into the table itself.",
      },
      {
        id: "tile-examples",
        type: "visual",
        title: "Four tiles, four stories",
        body:
          "Hydrogen (1) is the lightest element. Helium (2) is the first noble gas. Iron (26) sits in the transition-metal heartland. Gold (79) is a heavy, famously unreactive metal.\n\nSame tile format each time — once you can read one, you can read all 118.",
        visualHint: "periodic-tile",
        relatedElementSymbols: ["H", "He", "Fe", "Au"],
      },
      {
        id: "groups-and-periods",
        type: "concept",
        title: "Groups and periods",
        body:
          "Columns are called groups, numbered 1–18. Elements in a group share a similar outer-electron arrangement, which is why they behave alike — all group 18 noble gases are inert, all group 1 alkali metals are violently reactive.\n\nRows are called periods. Moving across a period adds one proton (and one electron) per step, filling the same outer shell.",
      },
      {
        id: "blocks",
        type: "concept",
        title: "The s, p, d, f blocks",
        body:
          "The table splits into blocks named for the orbital type its elements are filling: the s-block on the left, the p-block on the right, the d-block transition metals in the middle, and the f-block lanthanides and actinides below.\n\nBlocks are why the table has its odd shape — it's a map of orbital filling order.",
      },
      {
        id: "categories",
        type: "concept",
        title: "Categories and colors",
        body:
          "Beyond blocks, elements group into chemical families: alkali metals, alkaline earth metals, transition metals, metalloids, reactive nonmetals, noble gases, lanthanides, actinides, and more.\n\nAtomic Explorer color-codes every tile by category — the colors you've seen throughout the app are this classification.",
        relatedElementSymbols: ["U"],
      },
      {
        id: "check-groups",
        type: "checkpoint",
        title: "Checkpoint",
        body: "Reading the table's structure.",
        checkpoint: {
          question: "Elements in the same group (column) tend to…",
          options: [
            {
              id: "a",
              text: "Behave similarly, due to similar outer-electron arrangements",
              isCorrect: true,
              explanation:
                "Correct. A shared outer-electron arrangement gives group members similar chemistry — the periodic table's most powerful pattern.",
            },
            {
              id: "b",
              text: "Have the same atomic mass",
              isCorrect: false,
              explanation:
                "Mass increases steadily down a group. It's the outer-electron arrangement they share, not mass.",
            },
            {
              id: "c",
              text: "Have the same number of protons",
              isCorrect: false,
              explanation:
                "Every element has a unique proton count. Group members share outer-electron structure, not atomic number.",
            },
            {
              id: "d",
              text: "Be the same physical size",
              isCorrect: false,
              explanation:
                "Atoms generally get larger moving down a group as more shells are added.",
            },
          ],
        },
      },
      {
        id: "summary",
        type: "summary",
        title: "What you learned",
        body:
          "A tile gives you atomic number, symbol, name, and mass. Groups (columns) share chemistry; periods (rows) fill shells left to right; blocks map the s, p, d, and f orbitals being filled.\n\nWith those patterns, the whole table becomes readable at a glance.",
      },
    ],
  },
  {
    slug: "comparing-elements",
    title: "Comparing Elements",
    description:
      "Put elements side by side — atomic number, mass, shells, category — and see why small proton differences matter enormously.",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    order: 7,
    tags: ["comparison", "analysis", "trends"],
    relatedElementSymbols: ["C", "O", "Au", "U"],
    steps: [
      {
        id: "why-compare",
        type: "concept",
        title: "Why compare at all?",
        body:
          "An element's numbers mean little in isolation. Is 79 protons a lot? Is a mass of 238 heavy? Comparison gives the numbers scale.\n\nThe most revealing dimensions to compare are atomic number, atomic mass, shell structure, and chemical category — together they sketch an element's whole character.",
      },
      {
        id: "carbon-vs-oxygen",
        type: "visual",
        title: "Carbon vs oxygen",
        body:
          "Carbon (6) and oxygen (8) sit two tiles apart in the same period. Both are reactive nonmetals with two shells — yet carbon builds the skeletons of life's molecules while oxygen burns through them for energy.\n\nTwo protons of difference, and an entirely different chemical personality.",
        visualHint: "periodic-tile",
        relatedElementSymbols: ["C", "O"],
      },
      {
        id: "gold-vs-uranium",
        type: "comparison",
        title: "Gold vs uranium",
        body:
          "Now jump to the heavyweights. Gold (79) is dense, stable, and so unreactive it survives millennia untarnished. Uranium (92) is heavier still — and has no stable isotopes at all: every uranium nucleus eventually decays.\n\nThirteen more protons push the nucleus past the edge of stability. Heavier is not just \"more\" — past a point, it changes what's physically possible.",
        visualHint: "periodic-tile",
        relatedElementSymbols: ["Au", "U"],
      },
      {
        id: "small-changes-matter",
        type: "concept",
        title: "Small changes, big consequences",
        body:
          "Step through carbon → nitrogen → oxygen: one proton at a time, and each step is a different element with different bonding, different states of matter, different roles in chemistry.\n\nThis sensitivity is the deep lesson of the periodic table: matter's diversity comes from tiny integer changes in proton count.",
        visualHint: "shell-distribution",
        relatedElementSymbols: ["C"],
      },
      {
        id: "check-compare",
        type: "checkpoint",
        title: "Checkpoint",
        body: "One comparison question.",
        checkpoint: {
          question:
            "Carbon has 6 protons and oxygen has 8. What does that two-proton difference change?",
          options: [
            {
              id: "a",
              text: "The element's identity and its chemistry",
              isCorrect: true,
              explanation:
                "Correct. Different proton counts mean different elements — and with them, different electron arrangements and completely different chemical behavior.",
            },
            {
              id: "b",
              text: "Only the atom's mass",
              isCorrect: false,
              explanation:
                "Mass does change, but protons also define identity. Only a neutron change would alter mass alone.",
            },
            {
              id: "c",
              text: "Nothing — they're isotopes",
              isCorrect: false,
              explanation:
                "Isotopes share a proton count and differ in neutrons. Carbon and oxygen have different proton counts, so they're different elements.",
            },
            {
              id: "d",
              text: "Only the number of neutrons",
              isCorrect: false,
              explanation:
                "Proton count is independent of neutron count. Two extra protons make it a different element entirely.",
            },
          ],
        },
      },
      {
        id: "summary",
        type: "summary",
        title: "What you learned",
        body:
          "Comparing atomic number, mass, shells, and category reveals an element's character. Carbon vs oxygen shows how two protons reshape chemistry; gold vs uranium shows how extra protons can end nuclear stability itself.\n\nTry it live: the Compare page puts any two elements side by side in full detail.",
      },
    ],
  },
];

/** All lessons sorted by their `order`, the canonical learning-path sequence. */
export function getSortedLessons(): Lesson[] {
  return [...LESSONS].sort((a, b) => a.order - b.order);
}

/** Look up a lesson by slug (exact match), or undefined when unknown. */
export function getLessonBySlug(slug: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.slug === slug);
}

/** The lessons immediately before/after a lesson in the learning path. */
export function getAdjacentLessons(slug: string): {
  previous: Lesson | null;
  next: Lesson | null;
} {
  const sorted = getSortedLessons();
  const index = sorted.findIndex((lesson) => lesson.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: index > 0 ? sorted[index - 1] : null,
    next: index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}
