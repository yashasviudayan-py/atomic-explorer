import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ELEMENTS, getElementBySymbol } from "@/data/elements";
import { CATEGORY_META } from "@/lib/elementCategories";

interface ElementDetailPageProps {
  // In the Next.js App Router (v15+), dynamic route params are async.
  params: Promise<{ symbol: string }>;
}

/** Pre-render a static page for every known element symbol. */
export function generateStaticParams() {
  return ELEMENTS.map((element) => ({ symbol: element.symbol.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: ElementDetailPageProps): Promise<Metadata> {
  const { symbol } = await params;
  const element = getElementBySymbol(symbol);
  if (!element) {
    return { title: "Element not found" };
  }
  return {
    title: `${element.name} (${element.symbol})`,
    description: `Atomic structure and scientific facts for ${element.name}: ${element.summary}`,
  };
}

export default async function ElementDetailPage({
  params,
}: ElementDetailPageProps) {
  const { symbol } = await params;
  const element = getElementBySymbol(symbol);

  if (!element) {
    notFound();
  }

  const meta = CATEGORY_META[element.category];

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <Link
        href="/elements"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <span aria-hidden="true">←</span> Back to Periodic Table
      </Link>

      {/* Hero */}
      <header
        className="glass-panel relative mt-6 overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{ ["--accent" as string]: meta.accent }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-3xl"
          style={{ background: meta.accent }}
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div
            className={`flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-2xl border ${meta.tileBg} ${meta.border}`}
          >
            <span className="text-xs text-foreground/60">
              {element.atomicNumber}
            </span>
            <span className={`text-5xl font-bold ${meta.text}`}>
              {element.symbol}
            </span>
            <span className="text-xs text-foreground/50">
              {element.atomicMass}
            </span>
          </div>
          <div className="min-w-0">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
              style={{
                borderColor: `color-mix(in srgb, ${meta.accent} 45%, transparent)`,
                color: meta.accent,
                background: `color-mix(in srgb, ${meta.accent} 12%, transparent)`,
              }}
            >
              {meta.label}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {element.name}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              {element.summary}
            </p>
          </div>
        </div>
      </header>

      {/* Property grid */}
      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Property label="Atomic number" value={String(element.atomicNumber)} />
        <Property label="Atomic mass" value={element.atomicMass} />
        <Property label="Category" value={meta.label} />
        <Property
          label="Group · Period"
          value={`${element.group ?? "—"} · ${element.period}`}
        />
        <Property label="Block" value={`${element.block}-block`} />
        <Property label="Shells" value={element.shells.join(" · ")} />
      </dl>

      {/* Electron configuration */}
      <section className="mt-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Electron configuration
        </h2>
        <p className="mt-2 font-mono text-lg text-foreground">
          {element.electronConfiguration}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {element.shells.map((count, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-muted"
            >
              <span className="text-xs uppercase tracking-wide text-muted/70">
                Shell {index + 1}
              </span>
              <span className="font-mono text-foreground">{count} e⁻</span>
            </span>
          ))}
        </div>
      </section>

      {/* Placeholder CTA for the next phase */}
      <section
        className="mt-3 flex flex-col items-start gap-3 rounded-2xl border border-dashed p-6 sm:flex-row sm:items-center sm:justify-between"
        style={{
          borderColor: `color-mix(in srgb, ${meta.accent} 35%, transparent)`,
          background: `color-mix(in srgb, ${meta.accent} 6%, transparent)`,
        }}
      >
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            3D Atom Explorer coming next
          </h2>
          <p className="mt-1 text-sm text-muted">
            Orbiting electrons, layered shells, and a glowing nucleus for{" "}
            {element.name} will live here.
          </p>
        </div>
        <span
          aria-disabled="true"
          className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold opacity-70"
          style={{
            borderColor: `color-mix(in srgb, ${meta.accent} 45%, transparent)`,
            color: meta.accent,
          }}
        >
          Explore Atom
          <span aria-hidden="true">◎</span>
        </span>
      </section>

      <div className="mt-8">
        <Link
          href="/elements"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-white/25 hover:bg-white/10"
        >
          <span aria-hidden="true">←</span> Back to Periodic Table
        </Link>
      </div>
    </article>
  );
}

function Property({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 font-mono text-base text-foreground">{value}</dd>
    </div>
  );
}
