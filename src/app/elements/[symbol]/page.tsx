import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ELEMENTS, getElementBySymbol } from "@/data/elements";
import { CATEGORY_META } from "@/lib/elementCategories";
import { AtomViewerClient } from "@/components/atom/AtomViewerClient";
import { ChevronLeft } from "@/components/ui/Icon";

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

  return (
    <article className="page-shell relative py-10 lg:py-14">
      {/* Faint category-accent bloom anchoring the page against true black. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[26rem] opacity-20"
        style={{
          background: `radial-gradient(70rem 26rem at 50% -12%, ${meta.accent}1f, transparent 70%)`,
        }}
      />
      <Link
        href="/elements"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Periodic Table
      </Link>

      {/* Hero — quiet product-style header on black, no boxed glass. */}
      <header className="mt-8 flex flex-col-reverse items-start justify-between gap-8 border-b border-white/10 pb-10 sm:flex-row sm:items-center">
        <div className="min-w-0 max-w-2xl">
          <span
            className="text-xs font-semibold uppercase tracking-[0.12em]"
            style={{ color: meta.accent }}
          >
            {meta.label}
          </span>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {element.name}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-secondary sm:text-lg">
            {element.summary}
          </p>

          {/* Metadata row */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Chip label="Atomic #" value={String(element.atomicNumber)} />
            <Chip label="Mass" value={element.atomicMass} />
            <Chip label="Block" value={`${element.block}-block`} />
            <Chip label="Period" value={String(element.period)} />
            <Chip label="Group" value={element.group ? String(element.group) : "—"} />
          </div>
        </div>

        {/* Large symbol display */}
        <div className="flex shrink-0 flex-col items-center sm:items-end">
          <span
            className="text-7xl font-semibold leading-none tracking-tight sm:text-8xl"
            style={{ color: meta.accent }}
          >
            {element.symbol}
          </span>
          <span className="mt-2 font-mono text-sm text-muted">
            {element.atomicNumber} · {element.atomicMass}
          </span>
        </div>
      </header>

      {/* 3D Atom Explorer — viewer carries the isotope selector and the
          isotope-aware particle information panel. */}
      <section className="mt-10">
        <SectionHeading
          eyebrow="3D Atom Explorer"
          title={`Inside the ${element.name} atom`}
          accent={meta.accent}
        />
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Switch between Bohr and Quantum Cloud modes to compare a simple
          teaching model with a more realistic probability-based view, and follow
          the guided tour to explore the {element.name} atom step by step.
        </p>
        <div className="mt-5">
          <AtomViewerClient element={element} />
        </div>
      </section>

      {/* Electron configuration + shell distribution */}
      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Electron configuration */}
        <div className="glass-panel-subtle rounded-2xl p-5">
          <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted-2">
            Electron configuration
          </h2>
          <p className="mt-2 font-mono text-lg text-foreground">
            {element.electronConfiguration}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            A neutral {element.name} atom has {element.atomicNumber} electron
            {element.atomicNumber === 1 ? "" : "s"} (equal to its proton count).
            Choosing a different isotope above changes only the neutron count.
          </p>
        </div>

        {/* Shell distribution */}
        <div className="glass-panel-subtle rounded-2xl p-5">
          <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted-2">
            Shell distribution
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {element.shells.map((count, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-secondary"
              >
                <span className="text-xs uppercase tracking-wide text-muted">
                  Shell {index + 1}
                </span>
                <span className="font-mono font-medium text-foreground">
                  {count} e⁻
                </span>
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Electrons fill inner shells before outer ones; the outermost
            (valence) shell drives the element&apos;s chemistry.
          </p>
        </div>
      </section>

      {/* Summary / properties */}
      <section className="glass-panel-subtle mt-4 rounded-2xl p-5">
        <h2 className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted-2">
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
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-white/25 hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Periodic Table
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
        className="text-xs font-semibold uppercase tracking-[0.12em]"
        style={{ color: accent }}
      >
        {eyebrow}
      </span>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs">
      <span className="uppercase tracking-wide text-muted">{label}</span>
      <span className="font-mono font-medium text-foreground">{value}</span>
    </span>
  );
}

function Property({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <dt className="text-xs uppercase tracking-wide text-muted-2">{label}</dt>
      <dd className="mt-1 font-mono text-base text-foreground">{value}</dd>
    </div>
  );
}
