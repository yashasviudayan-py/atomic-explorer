import { FEATURE_CARDS, type FeatureCard } from "@/lib/constants";

/**
 * Three premium glassmorphism feature cards summarizing the app's pillars.
 * Each card carries an accent-tinted glow that intensifies on hover.
 */
export function FeatureCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_CARDS.map((card) => (
          <Card key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}

function Card({ card }: { card: FeatureCard }) {
  return (
    <article
      className="glass-panel group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/15"
      style={{ ["--card-accent" as string]: card.accent }}
    >
      {/* Accent glow that blooms on hover */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
        style={{ background: "var(--card-accent)" }}
      />

      <div
        className="relative flex h-12 w-12 items-center justify-center rounded-xl border text-2xl"
        style={{
          color: "var(--card-accent)",
          borderColor: "color-mix(in srgb, var(--card-accent) 40%, transparent)",
          background: "color-mix(in srgb, var(--card-accent) 12%, transparent)",
        }}
      >
        {card.glyph}
      </div>

      <h3 className="relative mt-5 text-lg font-semibold text-foreground">
        {card.title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted">
        {card.description}
      </p>
    </article>
  );
}
