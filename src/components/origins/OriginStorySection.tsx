"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface OriginStorySectionProps {
  id: string;
  /** Small colored label naming the chapter, e.g. "Stellar fusion". */
  eyebrow: string;
  /**
   * When this happened, in monospace beside the eyebrow. The chronology is real
   * information, so it earns a slot the way a decorative "01 / 14" would not.
   */
  marker?: string;
  title: string;
  /** Body copy. Prose, not fragments. */
  children: ReactNode;
  /** The diagram. Rendered on the server and passed in, so this file stays thin. */
  visual: ReactNode;
  /** Put the visual on the left. Alternate down the page for rhythm. */
  reversed?: boolean;
}

/**
 * The repeating unit of the origins story: copy on one side, a diagram on the
 * other, alternating as you scroll.
 *
 * This is the only client component wrapping story content. It exists solely to
 * add the scroll reveal, and its `children`/`visual` arrive as already-rendered
 * server output — so making it interactive costs no extra client JavaScript for
 * the diagrams themselves. The reveal is neutralized by CSS below 768px and
 * under prefers-reduced-motion; the observer still fires, but toggles a class
 * that does nothing.
 */
export function OriginStorySection({
  id,
  eyebrow,
  marker,
  title,
  children,
  visual,
  reversed = false,
}: OriginStorySectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={`origin-reveal page-shell scroll-mt-20 py-14 lg:py-20 ${
        visible ? "is-visible" : ""
      }`}
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className={reversed ? "lg:order-2" : undefined}>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-cyan">
              {eyebrow}
            </span>
            {marker && (
              <span className="font-mono text-xs text-muted-2">{marker}</span>
            )}
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>

          <div className="mt-5 space-y-4 text-base leading-relaxed text-secondary sm:text-[1.0625rem]">
            {children}
          </div>
        </div>

        <div className={`min-w-0 ${reversed ? "lg:order-1" : ""}`}>{visual}</div>
      </div>
    </section>
  );
}
