import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ELEMENTS, getElementBySymbol } from "@/data/elements";
import { CATEGORY_META } from "@/lib/elementCategories";
import { AtomViewerClient } from "@/components/atom/AtomViewerClient";
import { getNeutronCount } from "@/components/atom/atomUtils";

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
    description: `Interactive 3D atom, structure, and scientific facts for ${element.name}: ${element.summary}`,
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
  const protons = element.atomicNumber;
  const electrons = element.atomicNumber;
  const neutrons = getNeutronCount(element.atomicNumber, element.atomicMass);

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
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

            {/* Metadata chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip label="Atomic #" value={String(element.atomicNumber)} />
              <Chip label="Block" value={`${element.block}-block`} />
              <Chip label="Period" value={String(element.period)} />
              <Chip label="Group" value={element.group ? String(element.group) : "—"} />
            </div>
          </div>
        </div>
      </header>

      {/* 3D Atom Explorer */}
      <section className="mt-8">
        <SectionHeading
          eyebrow="3D Atom Explorer"
          title={`Inside the ${element.name} atom`}
          accent={meta.accent}
        />
        <div className="mt-4">
          <AtomViewerClient element={element} />
        </div>
      </section>

      {/* Composition + configuration */}
      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Composition */}
        <div className="glass-panel rounded-2xl p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Atomic composition
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <CompositionStat label="Protons" value={protons} dot="#ff5d7e" />
            <CompositionStat label="Neutrons" value={neutrons} dot="#5fc8ff" />
            <CompositionStat label="Electrons" value={electrons} dot="#cdeeff" />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Neutral atom: electrons equal protons. Neutron count is approximated
            from the standard atomic mass ({element.atomicMass}) — isotope
            selection arrives in a later phase.
          </p>
        </div>

        {/* Electron configuration */}
        <div className="glass-panel rounded-2xl p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Electron configuration
          </h2>
          <p className="mt-2 font-mono text-lg text-foreground">
            {element.electronConfiguration}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
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
        </div>
      </section>

      {/* Summary / properties */}
      <section className="mt-4 glass-panel rounded-2xl p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Summary
        </h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

function SectionHeading({
  eyebrow,
  title,
  accent,
}: {
  eyebrow: string;
  title: string;
  accent: string;
}) {
  return (
    <div>
      <span
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: accent }}
      >
        {eyebrow}
      </span>
      <h2 className="mt-1 text-xl font-bold text-foreground sm:text-2xl">
        {title}
      </h2>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs">
      <span className="uppercase tracking-wide text-muted/70">{label}</span>
      <span className="font-mono text-foreground">{value}</span>
    </span>
  );
}

function CompositionStat({
  label,
  value,
  dot,
}: {
  label: string;
  value: number;
  dot: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3 text-center">
      <span
        className="mx-auto mb-1.5 block h-2.5 w-2.5 rounded-full"
        style={{ background: dot, boxShadow: `0 0 12px ${dot}` }}
      />
      <span className="block font-mono text-2xl font-semibold text-foreground">
        {value}
      </span>
      <span className="block text-[0.65rem] uppercase tracking-wide text-muted">
        {label}
      </span>
    </div>
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
