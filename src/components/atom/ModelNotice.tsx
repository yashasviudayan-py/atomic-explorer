import type { AtomicModelMode } from "./atomTypes";

interface ModelNoticeProps {
  /** Which model the notice should describe. */
  mode: AtomicModelMode;
  /** Optional extra classes for layout (margins, etc.). */
  className?: string;
}

const NOTICE: Record<AtomicModelMode, string> = {
  bohr: "This is an educational Bohr-style visualization. Real electron behaviour is quantum mechanical and better represented by probability orbitals.",
  quantum:
    "This is a simplified probability-cloud visualization inspired by atomic orbitals. It is designed for learning, not as a full quantum-mechanical calculation.",
};

/**
 * Compact scientific-honesty notice. Adapts its wording to the active model so
 * the claim on screen always matches what's being rendered. Readable but
 * unintrusive on the OLED theme.
 */
export function ModelNotice({ mode, className = "" }: ModelNoticeProps) {
  return (
    <div
      className={`glass-panel-subtle flex items-start gap-3 rounded-2xl px-4 py-3 ${className}`}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 text-[0.7rem] font-semibold text-muted"
      >
        i
      </span>
      <p className="text-xs leading-relaxed text-muted">{NOTICE[mode]}</p>
    </div>
  );
}
