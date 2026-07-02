import Link from "next/link";
import type { Element } from "@/types/element";
import type { Isotope } from "@/types/isotope";
import type { LessonStep, LessonVisualHint } from "@/types/lesson";
import { getElementBySymbol } from "@/data/elements";
import { CATEGORY_META } from "@/lib/elementCategories";
import { PARTICLE_COLORS, getIsotopesForElement } from "@/components/atom/atomUtils";

interface LessonVisualPanelProps {
  step: LessonStep;
  /** Lesson-level related symbols, used when the step doesn't specify its own. */
  fallbackSymbols: string[];
}

/** Most electrons drawn per ring — enough to read, cheap to render. */
const MAX_DOTS_PER_RING = 12;

/**
 * Lightweight visual companion for a lesson step.
 *
 * Every visual here is pure CSS/SVG — deliberately no WebGL canvas, so lessons
 * stay instant even on modest devices. Which visual renders is driven by the
 * step's `visualHint`; elements come from the step's related symbols.
 */
export function LessonVisualPanel({ step, fallbackSymbols }: LessonVisualPanelProps) {
  const hint = step.visualHint;
  if (!hint) return null;

  const symbols = step.relatedElementSymbols?.length
    ? step.relatedElementSymbols
    : fallbackSymbols;
  const elements = symbols
    .map((symbol) => getElementBySymbol(symbol))
    .filter((element): element is Element => Boolean(element));
  const primary = elements[0];

  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          Visual companion
        </span>
        <span className="text-[0.65rem] uppercase tracking-wide text-muted/60">
          Educational model
        </span>
      </div>
      <div className="p-5">
        <VisualBody hint={hint} elements={elements} primary={primary} />
      </div>
      <p className="border-t border-white/5 px-5 py-3 text-[0.7rem] leading-relaxed text-muted/70">
        Simplified educational visualization — not drawn to physical scale, and
        electron positions are illustrative, not exact paths.
      </p>
    </div>
  );
}

/** Route the hint to the matching visual (falls back to the atom overview). */
function VisualBody({
  hint,
  elements,
  primary,
}: {
  hint: LessonVisualHint;
  elements: Element[];
  primary: Element | undefined;
}) {
  switch (hint) {
    case "particle-diagram":
      return <ParticleDiagram element={primary} />;
    case "periodic-tile":
      return <PeriodicTilePreview elements={elements} />;
    case "shell-distribution":
      return primary ? <ShellDistribution element={primary} /> : null;
    case "isotope-comparison":
      return primary ? <IsotopeComparisonVisual element={primary} /> : null;
    case "bohr-vs-quantum":
      return <BohrVsQuantumVisual />;
    case "atom-overview":
    default:
      return primary ? <MiniAtomVisual element={primary} labeled /> : null;
  }
}

/* ------------------------------------------------------------------ */
/* Mini atom: nucleus glow + rotating rings with electron dots         */
/* ------------------------------------------------------------------ */

function MiniAtomVisual({
  element,
  labeled = false,
}: {
  element: Element;
  labeled?: boolean;
}) {
  const shellCount = element.shells.length;

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[16rem]">
        {/* Nucleus */}
        <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400/80 shadow-[0_0_24px_6px] shadow-rose-400/30" />
        {/* Shells */}
        {element.shells.map((count, index) => (
          <AtomRing
            key={index}
            index={index}
            shellCount={shellCount}
            electronCount={count}
          />
        ))}
      </div>
      {labeled && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[0.7rem] text-muted">
          <LegendDot color="#fb7185" label="Nucleus (protons + neutrons)" />
          <LegendDot color={PARTICLE_COLORS.electron.color} label="Electrons" />
          <LegendDot color="#38bdf8" ring label="Energy levels" />
        </div>
      )}
      <p className="mt-3 text-center text-xs text-muted">
        {element.name} — {element.shells.join(" · ")} electrons per shell
        (neutral atom)
      </p>
    </div>
  );
}

/** One rotating shell ring with up to {@link MAX_DOTS_PER_RING} electron dots. */
function AtomRing({
  index,
  shellCount,
  electronCount,
}: {
  index: number;
  shellCount: number;
  electronCount: number;
}) {
  // Ring diameters step evenly from ~34% to ~96% of the container.
  const pct = shellCount === 1 ? 62 : 34 + (index / (shellCount - 1)) * 62;
  const dots = Math.min(electronCount, MAX_DOTS_PER_RING);
  const duration = 14 + index * 6;

  return (
    <div
      className="absolute left-1/2 top-1/2 rounded-full border border-sky-400/25"
      style={{
        width: `${pct}%`,
        height: `${pct}%`,
        translate: "-50% -50%",
        animation: `orbit ${duration}s linear infinite`,
      }}
    >
      {Array.from({ length: dots }, (_, i) => {
        const angle = (i / dots) * Math.PI * 2;
        return (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${50 + 50 * Math.cos(angle)}%`,
              top: `${50 + 50 * Math.sin(angle)}%`,
              background: PARTICLE_COLORS.electron.color,
              boxShadow: `0 0 6px 1px ${PARTICLE_COLORS.electron.color}66`,
            }}
          />
        );
      })}
    </div>
  );
}

function LegendDot({
  color,
  label,
  ring = false,
}: {
  color: string;
  label: string;
  ring?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={
          ring
            ? { border: `1.5px solid ${color}99` }
            : { background: color, boxShadow: `0 0 6px 1px ${color}55` }
        }
      />
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Particle diagram: the three particles, with counts when known       */
/* ------------------------------------------------------------------ */

function ParticleDiagram({ element }: { element: Element | undefined }) {
  const neutrons = element
    ? getIsotopesForElement(element).find((iso) => iso.isStable)?.neutrons
    : undefined;

  const rows = [
    {
      name: "Proton",
      charge: "+1 charge",
      home: "In the nucleus",
      color: PARTICLE_COLORS.proton.color,
      count: element?.atomicNumber,
    },
    {
      name: "Neutron",
      charge: "No charge",
      home: "In the nucleus",
      color: PARTICLE_COLORS.neutron.color,
      count: neutrons,
    },
    {
      name: "Electron",
      charge: "−1 charge",
      home: "In energy levels",
      color: PARTICLE_COLORS.electron.color,
      count: element?.atomicNumber,
    },
  ];

  return (
    <div>
      <ul className="space-y-2.5">
        {rows.map((row) => (
          <li
            key={row.name}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3"
          >
            <span
              className="h-4 w-4 shrink-0 rounded-full"
              style={{
                background: row.color,
                boxShadow: `0 0 10px 2px ${row.color}44`,
              }}
            />
            <div className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">
                {row.name}
              </span>
              <span className="block text-xs text-muted">
                {row.charge} · {row.home}
              </span>
            </div>
            {row.count !== undefined && (
              <span className="shrink-0 font-mono text-lg text-foreground">
                {row.count}
              </span>
            )}
          </li>
        ))}
      </ul>
      {element && (
        <p className="mt-3 text-xs text-muted">
          Counts shown for a neutral {element.name} atom
          {neutrons !== undefined ? " (most common stable isotope)" : ""}.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Periodic tile preview: mini element tiles, linked to detail pages   */
/* ------------------------------------------------------------------ */

function PeriodicTilePreview({ elements }: { elements: Element[] }) {
  if (elements.length === 0) return null;
  const cols = elements.length <= 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4";
  return (
    <div className={`grid gap-3 ${elements.length === 3 ? "grid-cols-3" : cols}`}>
      {elements.map((element) => {
        const meta = CATEGORY_META[element.category];
        return (
          <Link
            key={element.symbol}
            href={`/elements/${element.symbol.toLowerCase()}`}
            className={`group flex aspect-square flex-col items-center justify-center rounded-xl border p-2 text-center transition-all ${meta.tileBg} ${meta.border} ${meta.glow}`}
          >
            <span className="text-[0.65rem] text-foreground/60">
              {element.atomicNumber}
            </span>
            <span className={`text-2xl font-bold ${meta.text}`}>
              {element.symbol}
            </span>
            <span className="mt-0.5 truncate text-[0.65rem] text-muted">
              {element.name}
            </span>
            <span className="text-[0.6rem] text-foreground/40">
              {element.atomicMass}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shell distribution: one bar per shell for a single element          */
/* ------------------------------------------------------------------ */

function ShellDistribution({ element }: { element: Element }) {
  const meta = CATEGORY_META[element.category];
  const maxCount = Math.max(...element.shells, 1);

  return (
    <div>
      <p className="text-sm text-foreground">
        <span className={`font-semibold ${meta.text}`}>{element.name}</span>
        <span className="ml-2 font-mono text-muted">
          {element.shells.join(" · ")}
        </span>
      </p>
      <ul className="mt-3 space-y-2">
        {element.shells.map((count, index) => (
          <li key={index} className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-[0.65rem] uppercase tracking-wide text-muted">
              Shell {index + 1}
            </span>
            <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-white/5">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${Math.max(8, (count / maxCount) * 100)}%`,
                  background: meta.accent,
                  boxShadow: `0 0 10px -2px ${meta.accent}`,
                  opacity: 0.85,
                }}
              />
            </div>
            <span className="w-8 shrink-0 text-right font-mono text-xs text-foreground">
              {count}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        Bohr-style shell distribution — electrons fill inner shells first; the
        outermost shell drives bonding.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Isotope comparison: stable vs unstable isotope of one element       */
/* ------------------------------------------------------------------ */

function IsotopeComparisonVisual({ element }: { element: Element }) {
  const isotopes = getIsotopesForElement(element);
  const stable = isotopes.find((iso) => iso.isStable);
  const unstable = isotopes.find((iso) => !iso.isStable);
  const pair = [stable, unstable].filter(
    (iso): iso is Isotope => Boolean(iso),
  );
  if (pair.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {pair.map((iso) => (
          <div
            key={iso.symbol}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center"
          >
            <span className="block font-mono text-lg font-semibold text-foreground">
              {iso.symbol}
            </span>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide ${
                iso.isStable
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "bg-amber-400/10 text-amber-300"
              }`}
            >
              {iso.isStable ? "Stable" : "Unstable"}
            </span>
            <dl className="mt-3 space-y-1.5 text-xs">
              <IsoRow
                label="Protons"
                value={iso.protons}
                color={PARTICLE_COLORS.proton.color}
              />
              <IsoRow
                label="Neutrons"
                value={iso.neutrons}
                color={PARTICLE_COLORS.neutron.color}
              />
            </dl>
            {iso.halfLife && (
              <p className="mt-2 text-[0.65rem] text-muted">
                Half-life ≈ {iso.halfLife}
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        Same proton count — both are {element.name}. Only the neutron count
        (and with it, nuclear stability) differs.
      </p>
    </div>
  );
}

function IsoRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-1.5 text-muted">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        {label}
      </dt>
      <dd className="font-mono text-foreground">{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bohr vs quantum: rings on the left, probability cloud on the right  */
/* ------------------------------------------------------------------ */

function BohrVsQuantumVisual() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {/* Bohr: clean concentric rings + dots */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="relative mx-auto aspect-square w-full max-w-[8.5rem]">
            <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400/80 shadow-[0_0_14px_4px] shadow-rose-400/30" />
            {[42, 68, 94].map((pct, i) => (
              <div
                key={pct}
                className="absolute left-1/2 top-1/2 rounded-full border border-sky-400/30"
                style={{
                  width: `${pct}%`,
                  height: `${pct}%`,
                  translate: "-50% -50%",
                  animation: `orbit ${12 + i * 6}s linear infinite`,
                }}
              >
                <span
                  className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: PARTICLE_COLORS.electron.color,
                    boxShadow: `0 0 6px 1px ${PARTICLE_COLORS.electron.color}66`,
                  }}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs font-medium text-foreground">
            Bohr model
          </p>
          <p className="text-center text-[0.65rem] text-muted">
            Fixed rings — a teaching model
          </p>
        </div>

        {/* Quantum: soft layered probability cloud */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="relative mx-auto aspect-square w-full max-w-[8.5rem]">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.55) 0%, rgba(168,85,247,0.28) 30%, rgba(56,189,248,0.14) 55%, transparent 75%)",
                filter: "blur(2px)",
              }}
            />
            <div
              className="absolute inset-[12%] rounded-full opacity-70"
              style={{
                background:
                  "radial-gradient(circle at 42% 45%, rgba(56,189,248,0.4), transparent 60%)",
                filter: "blur(6px)",
              }}
            />
            <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400/80 shadow-[0_0_14px_4px] shadow-rose-400/30" />
          </div>
          <p className="mt-3 text-center text-xs font-medium text-foreground">
            Quantum cloud
          </p>
          <p className="text-center text-[0.65rem] text-muted">
            Probability regions — no fixed path
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">
        Denser cloud regions mean higher probability of finding the electron
        there. Neither picture is to scale.
      </p>
    </div>
  );
}
