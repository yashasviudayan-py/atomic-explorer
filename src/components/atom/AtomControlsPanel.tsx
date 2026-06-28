"use client";

import { SPEED_ORDER, SpeedPreset } from "./atomUtils";

interface AtomControlsPanelProps {
  showLabels: boolean;
  onToggleLabels: () => void;
  speed: SpeedPreset;
  onSpeedChange: (speed: SpeedPreset) => void;
  onReset: () => void;
  accent: string;
}

const SPEED_LABELS: Record<SpeedPreset, string> = {
  paused: "Paused",
  slow: "Slow",
  normal: "Normal",
  fast: "Fast",
};

/**
 * Glass control bar for the atom viewer: label toggle, animation-speed presets,
 * a reset-view button, and the current model name. Pure DOM (lives outside the
 * Canvas) so it can use the app's Tailwind theme directly.
 */
export function AtomControlsPanel({
  showLabels,
  onToggleLabels,
  speed,
  onSpeedChange,
  onReset,
  accent,
}: AtomControlsPanelProps) {
  return (
    <div className="glass-panel flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl px-4 py-3">
      {/* Labels toggle */}
      <button
        type="button"
        onClick={onToggleLabels}
        aria-pressed={showLabels}
        className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
      >
        <span
          className="relative inline-flex h-5 w-9 items-center rounded-full border transition-colors"
          style={{
            borderColor: showLabels ? accent : "rgba(255,255,255,0.18)",
            background: showLabels
              ? `color-mix(in srgb, ${accent} 30%, transparent)`
              : "rgba(255,255,255,0.05)",
          }}
        >
          <span
            className="absolute h-3.5 w-3.5 rounded-full bg-white transition-transform"
            style={{ transform: showLabels ? "translateX(18px)" : "translateX(3px)" }}
          />
        </span>
        Labels
      </button>

      <span className="hidden h-5 w-px bg-white/10 sm:block" />

      {/* Speed presets */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs uppercase tracking-wide text-muted">Speed</span>
        <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
          {SPEED_ORDER.map((preset) => {
            const active = preset === speed;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => onSpeedChange(preset)}
                aria-pressed={active}
                className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                style={{
                  color: active ? "#05060f" : "var(--color-muted)",
                  background: active ? accent : "transparent",
                  boxShadow: active ? `0 0 16px -4px ${accent}` : "none",
                }}
              >
                {SPEED_LABELS[preset]}
              </button>
            );
          })}
        </div>
      </div>

      <span className="hidden h-5 w-px bg-white/10 sm:block" />

      {/* Reset view */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-white/25 hover:bg-white/10"
      >
        <span aria-hidden="true">⟳</span> Reset view
      </button>

      <span
        className="ml-auto rounded-full border px-3 py-1 text-[0.7rem] font-medium"
        style={{
          borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`,
          color: accent,
          background: `color-mix(in srgb, ${accent} 10%, transparent)`,
        }}
      >
        Bohr-style educational model
      </span>
    </div>
  );
}
