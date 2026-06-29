interface ModelNoticeProps {
  /** Optional extra classes for layout (margins, etc.). */
  className?: string;
}

/**
 * Compact scientific-honesty notice. Clarifies that the 3D atom is an
 * educational Bohr-style visualization rather than a quantum-accurate model.
 * Designed to be readable but unintrusive on the OLED theme.
 */
export function ModelNotice({ className = "" }: ModelNoticeProps) {
  return (
    <div
      className={`glass-panel flex items-start gap-3 rounded-2xl px-4 py-3 ${className}`}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/15 text-[0.7rem] font-semibold text-muted"
      >
        i
      </span>
      <p className="text-xs leading-relaxed text-muted">
        This is an educational Bohr-style visualization. Real electron behaviour
        is quantum mechanical and better represented by probability orbitals.
      </p>
    </div>
  );
}
