import Link from "next/link";
import { OriginsHero } from "@/components/origins/OriginsHero";
import { CosmicTimeline, PrimordialLadder } from "@/components/origins/CosmicTimeline";
import { OriginStorySection } from "@/components/origins/OriginStorySection";
import {
  FusionChain,
  StellarFusionDiagram,
} from "@/components/origins/StellarFusionDiagram";
import { OnionStarDiagram } from "@/components/origins/OnionStarDiagram";
import { CosmicRecyclingDiagram } from "@/components/origins/CosmicRecyclingDiagram";
import { ElementOriginMap } from "@/components/origins/ElementOriginMap";
import { OriginCallout } from "@/components/origins/OriginCallout";
import {
  AcceleratorDiagram,
  IronBindingCurve,
  NebulaCloud,
  RProcessSites,
  SpallationDiagram,
  SupernovaBurst,
} from "@/components/origins/OriginVisuals";

/**
 * "The Cosmic Origin of Elements" — a long-form story assembled from static
 * server-rendered sections.
 *
 * The only client-side JavaScript on this route is the scroll reveal that wraps
 * each story section (`OriginStorySection`) and the interactive origin map. Every
 * diagram is a server component: SVG and CSS gradients, no canvas, no animation
 * loop, no particle field.
 */
export function OriginsPage() {
  return (
    <div className="relative z-10 overflow-x-clip">
      <OriginsHero />

      {/* The whole story, before the story. */}
      <section className="page-shell py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-cyan">
              The arc of cosmic chemistry
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Eight moments that built the periodic table
            </h2>
            <p className="mt-5 text-base leading-relaxed text-secondary">
              The universe did not make the elements all at once, and it has not
              stopped. Stars are fusing right now; neutron stars are colliding
              right now. This is the sequence in which each channel opened.
            </p>
          </div>
          <CosmicTimeline />
        </div>
      </section>

      <OriginStorySection
        id="first-three-minutes"
        eyebrow="Big Bang nucleosynthesis"
        marker="t = 0 → 3 min"
        title="The First Three Minutes"
        visual={<PrimordialLadder />}
      >
        <p>
          Shortly after the Big Bang, the universe was hot, dense, and expanding
          furiously. It was too hot for atoms, too hot even for nuclei — matter
          existed as a plasma of free particles.
        </p>
        <p>
          As it cooled, protons and neutrons could finally stick together. In a
          window a few minutes wide, Big Bang nucleosynthesis produced mostly
          hydrogen and helium, along with a trace of lithium.
        </p>
        <p>
          And then it stopped. The universe had thinned out too far for fusion to
          continue. There was no carbon, no oxygen, no iron, no gold — nothing to
          make a planet from, and nothing to make a reader from. For that, the
          universe needed stars.
        </p>
      </OriginStorySection>

      <OriginStorySection
        id="hydrogen"
        eyebrow="The first stars"
        marker="~100–200 Myr"
        title="Hydrogen: The First Fuel"
        reversed
        visual={<NebulaCloud />}
      >
        <p>
          Hydrogen became — and remains — the most abundant element in the
          universe. For a hundred million years or more it simply drifted,
          spread through the dark in vast, cold clouds of hydrogen and helium.
        </p>
        <p>
          Gravity is patient. It gathered those clouds, and gathered them, until
          the densest regions began to collapse under their own weight.
        </p>
        <p>
          Collapse means compression, and compression means heat. When the core of
          a collapsing cloud grew hot and dense enough, hydrogen nuclei began to
          fuse — and the first stars switched on.
        </p>
      </OriginStorySection>

      <OriginStorySection
        id="fusion"
        eyebrow="Stellar fusion"
        marker="Ever since"
        title="Stars Turn Hydrogen Into Helium"
        visual={<StellarFusionDiagram />}
      >
        <p>
          A main-sequence star spends most of its life doing one thing: fusing
          hydrogen into helium in its core.
        </p>
        <p>
          The helium nucleus that results is slightly lighter than the hydrogen
          nuclei that went into it. That difference in mass is released as energy.
          It is why stars shine, and why the sky is not dark.
        </p>
        <p>
          Our Sun is doing this at this moment, and has been for about 4.6 billion
          years. The light warming your skin was paid for in mass.
        </p>
      </OriginStorySection>

      <OriginStorySection
        id="carbon-oxygen"
        eyebrow="Helium burning"
        marker="Late in a star's life"
        title="The Birth of Carbon and Oxygen"
        reversed
        visual={<FusionChain />}
      >
        <p>
          When a star begins to run low on hydrogen in its core, it contracts, it
          heats, and heavier fusion stages can begin.
        </p>
        <p>
          Helium nuclei fuse through the triple-alpha process to make carbon — a
          reaction that requires three nuclei to meet almost simultaneously, and
          which the universe manages only because of a fortunate resonance in the
          carbon nucleus itself.
        </p>
        <p>
          Carbon can then capture another helium nucleus and become oxygen.
          Between them, these two elements become the foundation of rock, water,
          minerals, atmospheres, and every organic molecule in every living thing.
        </p>
      </OriginStorySection>

      <OriginStorySection
        id="massive-stars"
        eyebrow="Massive stars"
        marker="Final million years"
        title="Massive Stars Build the Periodic Table"
        visual={<OnionStarDiagram />}
      >
        <p>
          A star many times the mass of the Sun can keep going. As each fuel runs
          out in the core, the star contracts, heats further, and ignites the ash
          of the previous stage as the fuel of the next.
        </p>
        <p>
          The result is an onion: nested shells, each burning a heavier element
          than the one outside it. Hydrogen, then helium, then carbon, neon,
          oxygen, and silicon — and at the centre, a growing core of iron.
        </p>
        <p>
          Each stage runs faster than the last. The hydrogen shell burns for
          millions of years. The silicon shell burns for about a day.
        </p>
      </OriginStorySection>

      <OriginStorySection
        id="iron"
        eyebrow="The iron peak"
        marker="The turning point"
        title="Why Iron Is a Cosmic Turning Point"
        reversed
        visual={<IronBindingCurve />}
      >
        <p>
          Fusing light nuclei releases energy, and that energy is what holds a
          star up. Every second, the outward push of fusion balances the inward
          pull of the star&apos;s own gravity.
        </p>
        <p>
          But nuclear binding energy peaks around iron and nickel. Past that peak,
          fusion in an ordinary stellar core no longer produces useful energy — it
          consumes it.
        </p>
        <p>
          So a massive star that has built an iron core has built the one thing it
          cannot burn. The engine stops. Gravity does not. What follows can be a
          supernova.
        </p>
      </OriginStorySection>

      <OriginStorySection
        id="supernovae"
        eyebrow="Supernovae"
        marker="Seconds"
        title="Supernovae: The Universe's Element Forges"
        visual={<SupernovaBurst />}
      >
        <p>
          When the core of a massive star collapses, the star can tear itself
          apart in an explosion that briefly outshines its entire galaxy.
        </p>
        <p>
          Supernovae both create elements — in the extreme heat and density of the
          blast — and distribute them, hurling a star&apos;s manufactured
          inventory across light-years of space. The shock waves compress nearby
          clouds, triggering the formation of the next generation of stars.
        </p>
        <p>
          The calcium in your bones, the iron in your blood, the silicon in the
          rock beneath you, and the oxygen you are breathing were all processed
          inside stars and scattered by their deaths.
        </p>
      </OriginStorySection>

      <OriginStorySection
        id="heavy-elements"
        eyebrow="The r-process"
        marker="Milliseconds"
        title="Gold, Platinum, Uranium: Extreme Origins"
        reversed
        visual={<RProcessSites />}
      >
        <p>
          Fusion cannot make the heaviest elements. Building them requires
          something stranger: an environment so rich in free neutrons that nuclei
          swallow them faster than they can decay.
        </p>
        <p>
          This is rapid neutron capture — the r-process. Neutron star mergers,
          where two collapsed stellar cores collide, are considered a major site
          for it, and are thought to be an important source of elements like gold,
          platinum, and uranium. Some rare supernova environments may contribute
          as well.
        </p>
        <p>
          The gold in a wedding ring is unlikely to have a single tidy origin
          story. But it does have a violent one.
        </p>
      </OriginStorySection>

      <OriginStorySection
        id="spallation"
        eyebrow="Cosmic ray spallation"
        marker="Across deep space"
        title="Lithium, Beryllium, and Boron: Cosmic Ray Children"
        visual={<SpallationDiagram />}
      >
        <p>
          Three light elements do not fit the pattern. Lithium, beryllium, and
          boron are fragile: stars tend to destroy them faster than they build
          them.
        </p>
        <p>
          Instead, they are formed largely by cosmic ray spallation. Atomic nuclei
          travelling at close to the speed of light slam into carbon and oxygen
          nuclei drifting in interstellar space, and shatter them into smaller
          pieces.
        </p>
        <p>
          They are made by breaking things apart rather than building things up —
          which is why they are far rarer than the elements immediately around
          them.
        </p>
      </OriginStorySection>

      <OriginStorySection
        id="human-synthesis"
        eyebrow="Human synthesis"
        marker="Since 1937"
        title="Elements Made by Humans"
        reversed
        visual={<AcceleratorDiagram />}
      >
        <p>
          The periodic table does not end where nature does. Particle accelerators
          and nuclear reactors can assemble nuclei heavier than uranium, an atom
          at a time.
        </p>
        <p>
          These elements are generally unstable. Many exist for seconds, some for
          milliseconds, before decaying into lighter fragments. Only a handful of
          atoms of the heaviest ones have ever existed anywhere we know of.
        </p>
        <p>
          They are not useless curiosities. Each new element tests our
          understanding of how nuclei hold together, and probes the predicted
          &ldquo;island of stability&rdquo; where superheavy nuclei might live
          long enough to study properly.
        </p>
      </OriginStorySection>

      <section className="page-shell pb-4">
        <OriginCallout label="Two careful distinctions">
          <p>
            <span className="font-medium text-foreground">Technetium</span> occurs
            naturally, but only in trace amounts in uranium ores. Essentially all
            of it in use is produced artificially.
          </p>
          <p className="mt-2">
            <span className="font-medium text-foreground">
              Neptunium and plutonium
            </span>{" "}
            are transuranium elements with minute natural traces. Beyond them, the
            elements are synthetic — made, not found.
          </p>
        </OriginCallout>
      </section>

      <OriginStorySection
        id="star-dust"
        eyebrow="Galactic recycling"
        marker="~4.6 Gyr ago"
        title="From Star Dust to Planets"
        visual={<CosmicRecyclingDiagram />}
      >
        <p>
          Exploded stars and stellar winds seeded interstellar space with heavier
          elements. New clouds condensed from that enriched material — no longer
          the pristine hydrogen and helium the universe started with.
        </p>
        <p>
          About 4.6 billion years ago, one such cloud collapsed into our Solar
          System. Earth did not manufacture its carbon, oxygen, silicon, iron,
          gold, or uranium. It inherited them, ready-made, from generations of
          stars that lived and died before the Sun existed.
        </p>
        <p>
          We are not merely observers of this history. We are made of recycled
          cosmic material, and we are the part of it that noticed.
        </p>
      </OriginStorySection>

      {/* The signature: the periodic table, recolored by origin. */}
      <section id="origin-map" className="page-shell scroll-mt-20 py-14 lg:py-20">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-cyan">
            Element origin map
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Where every element came from
          </h2>
          <p className="mt-5 text-base leading-relaxed text-secondary">
            The same periodic table you already know, colored by the process most
            responsible for making each element. Filter by a channel to see its
            territory, or explore any element to read its story.
          </p>
        </div>

        <div className="mt-8">
          <ElementOriginMap />
        </div>

        <div className="mt-8 max-w-3xl">
          <OriginCallout label="This map is simplified">
            <p>
              Many elements are produced through more than one astrophysical
              pathway, often in comparable amounts, and the exact proportions are
              still an active area of research. Each element here is colored by
              its <span className="font-medium text-foreground">major source</span>{" "}
              under current models — not by an exclusive one. Elements marked as
              having several comparable sources are genuinely mixed, and the
              readout panel names the other channels that contribute.
            </p>
          </OriginCallout>
        </div>
      </section>

      {/* Closing */}
      <section className="page-shell pb-20 pt-6 lg:pb-28">
        <OriginCallout label="The story in one line" tone="poetic">
          Hydrogen learned to burn. Stars learned to build. Explosions scattered
          the pieces. Gravity gathered them again. And eventually, atoms became
          worlds, oceans, cells, and us.
        </OriginCallout>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/elements"
            className="cta-primary inline-flex w-full items-center justify-center rounded-xl px-7 py-3.5 text-sm font-semibold text-white sm:w-auto"
          >
            Explore the Periodic Table
          </Link>
          <Link
            href="/compare"
            className="cta-secondary inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-foreground hover:border-white/30 hover:bg-white/10 sm:w-auto"
          >
            Compare Elements
          </Link>
          <Link
            href="/learn"
            className="cta-secondary inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-foreground hover:border-white/30 hover:bg-white/10 sm:w-auto"
          >
            Start Learning
          </Link>
        </div>
      </section>
    </div>
  );
}
