import { FEATURE_CARDS, type FeatureCard } from "@/lib/constants";
import { AtomIcon, GridIcon, ParticlesIcon } from "@/components/ui/Icon";

const CARD_ICON = {
  grid: GridIcon,
  atom: AtomIcon,
  particles: ParticlesIcon,
} as const;

/**
 * Three glass feature cards summarizing the app's pillars. Content differs;
 * chrome does not — every card shares the single blue accent and lifts on a
 * neutral shadow, so nothing reads as a decorative glow.
 */
export function FeatureCards() {
  return (
    <section className="page-shell pb-20 lg:pb-28">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_CARDS.map((card) => (
          <Card key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}

function Card({ card }: { card: FeatureCard }) {
  const Glyph = CARD_ICON[card.icon];
  return (
    <article className="glass-panel-subtle elevate group relative overflow-hidden rounded-2xl p-6 hover:-translate-y-1 hover:border-white/20">
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-accent/35 bg-accent/10 text-accent">
        <Glyph className="h-6 w-6" />
      </div>

      <h3 className="relative mt-5 text-lg font-semibold text-foreground">
        {card.title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-secondary">
        {card.description}
      </p>
    </article>
  );
}
