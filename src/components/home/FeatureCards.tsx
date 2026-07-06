"use client";

import { useEffect, useRef, useState } from "react";
import { FEATURE_CARDS, type FeatureCard } from "@/lib/constants";
import { AtomIcon, GridIcon, ParticlesIcon } from "@/components/ui/Icon";

const CARD_ICON = {
  grid: GridIcon,
  atom: AtomIcon,
  particles: ParticlesIcon,
} as const;

/**
 * Three frosted-glass feature cards summarizing the app's pillars. Each has a
 * gradient hairline border, an inner blue glow that blooms on hover, and an
 * icon tile that lifts and pulses (see `.feature-card` / `.feature-icon` in
 * globals.css). The row rises in on a short stagger as it scrolls into view.
 */
export function FeatureCards() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="page-shell pb-20 lg:pb-28">
      <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_CARDS.map((card, i) => (
          <Card key={card.title} card={card} index={i} visible={visible} />
        ))}
      </div>
    </section>
  );
}

function Card({
  card,
  index,
  visible,
}: {
  card: FeatureCard;
  index: number;
  visible: boolean;
}) {
  const Glyph = CARD_ICON[card.icon];
  return (
    <article
      className={`feature-card reveal-scroll group p-6 ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div className="feature-icon relative flex h-12 w-12 items-center justify-center rounded-xl border border-accent/35 bg-accent/10 text-accent">
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
