import Link from "next/link";
import type { Element } from "@/types/element";
import { CATEGORY_META } from "@/lib/elementCategories";

interface ElementPreviewPanelProps {
  element: Element;
}

/**
 * Detail card for the currently hovered/selected element. Mirrors the data
 * shown on the full detail page and offers a CTA into the (upcoming) atom view.
 */
export function ElementPreviewPanel({ element }: ElementPreviewPanelProps) {
  const meta = CATEGORY_META[element.category];

  return (
    <aside
      className="glass-panel relative overflow-hidden rounded-2xl p-5"
      style={{ ["--accent" as string]: meta.accent }}
    >
      {/* Category glow bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-30 blur-3xl"
        style={{ background: meta.accent }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div
          className={`flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl border ${meta.tileBg} ${meta.border}`}
        >
          <span className="text-[0.6rem] text-foreground/60">
            {element.atomicNumber}
          </span>
          <span className={`text-3xl font-bold ${meta.text}`}>
            {element.symbol}
          </span>
        </div>
        <div className="min-w-0 flex-1 text-right">
          <h2 className="truncate text-xl font-semibold text-foreground">
            {element.name}
          </h2>
          <span
            className="mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-medium"
            style={{
              borderColor: `color-mix(in srgb, ${meta.accent} 45%, transparent)`,
              color: meta.accent,
              background: `color-mix(in srgb, ${meta.accent} 12%, transparent)`,
            }}
          >
            {meta.label}
          </span>
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-muted">
        {element.summary}
      </p>

      <dl className="relative mt-4 grid grid-cols-2 gap-3 text-sm">
        <Stat label="Atomic mass" value={element.atomicMass} />
        <Stat label="Period · Group" value={`${element.period} · ${element.group ?? "—"}`} />
        <Stat label="Block" value={`${element.block}-block`} />
        <Stat label="Shells" value={element.shells.join(" · ")} />
      </dl>

      <div className="relative mt-3">
        <dt className="text-xs uppercase tracking-wide text-muted">
          Electron configuration
        </dt>
        <dd className="mt-1 font-mono text-sm text-foreground">
          {element.electronConfiguration}
        </dd>
      </div>

      <Link
        href={`/elements/${element.symbol.toLowerCase()}`}
        className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all"
        style={{
          borderColor: `color-mix(in srgb, ${meta.accent} 50%, transparent)`,
          color: meta.accent,
          background: `color-mix(in srgb, ${meta.accent} 12%, transparent)`,
        }}
      >
        Explore Atom
        <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-mono text-foreground">{value}</dd>
    </div>
  );
}
