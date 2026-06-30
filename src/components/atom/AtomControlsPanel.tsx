"use client";

import type { AtomicModelMode, AtomVisualMode } from "./atomTypes";
import { SPEED_OPTIONS, SpeedOption } from "./atomUtils";

interface AtomControlsPanelProps {
  atomicModelMode: AtomicModelMode;
  onModelModeChange: (mode: AtomicModelMode) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  paused: boolean;
  onTogglePaused: () => void;
  speed: SpeedOption;
  onSpeedChange: (speed: SpeedOption) => void;
  visualMode: AtomVisualMode;
  onVisualModeChange: (mode: AtomVisualMode) => void;
  onReset: () => void;
  accent: string;
}

interface ModelDef {
  mode: AtomicModelMode;
  label: string;
  hint: string;
}

const MODELS: ModelDef[] = [
  { mode: "bohr", label: "Educational Bohr", hint: "Shells & electrons" },
  { mode: "quantum", label: "Quantum Cloud", hint: "Probability orbitals" },
];

/** Visual-emphasis presets available per model. */
const VISUAL_MODES: Record<
  AtomicModelMode,
  { mode: AtomVisualMode; label: string }[]
> = {
  bohr: [
    { mode: "balanced", label: "Balanced" },
    { mode: "particle-focus", label: "Particle Focus" },
    { mode: "shell-focus", label: "Shell Focus" },
  ],
  quantum: [
    { mode: "balanced", label: "Balanced" },
    { mode: "particle-focus", label: "Particle Focus" },
    { mode: "orbital-focus", label: "Orbital Focus" },
  ],
};

/**
 * Glass control bar for the atom viewer. A prominent model switch (Bohr vs
 * Quantum Cloud) sits on top, followed by playback, label toggle, animation
 * speed presets, a model-aware visual-emphasis switch, and reset-view. Pure DOM
 * (lives outside the Canvas) so it can use the app's Tailwind theme directly.
 */
export function AtomControlsPanel({
  atomicModelMode,
  onModelModeChange,
  showLabels,
  onToggleLabels,
  paused,
  onTogglePaused,
  speed,
  onSpeedChange,
  visualMode,
  onVisualModeChange,
  onReset,
  accent,
}: AtomControlsPanelProps) {
  const visualModes = VISUAL_MODES[atomicModelMode];

  return (
    <div className="glass-panel flex flex-col gap-3 rounded-2xl px-4 py-3">
      {/* Model switch — the most important control, given extra weight. */}
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-muted">Model</span>
        <div className="grid grid-cols-2 gap-2">
          {MODELS.map(({ mode, label, hint }) => {
            const active = mode === atomicModelMode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onModelModeChange(mode)}
                aria-pressed={active}
                className="flex flex-col items-start rounded-xl border px-3 py-2 text-left transition-all"
                style={{
                  borderColor: active ? accent : "rgba(255,255,255,0.1)",
                  background: active
                    ? `color-mix(in srgb, ${accent} 16%, transparent)`
                    : "rgba(255,255,255,0.02)",
                  boxShadow: active ? `0 0 22px -8px ${accent}` : "none",
                }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ color: active ? accent : "var(--color-foreground)" }}
                >
                  {label}
                </span>
                <span className="text-[0.7rem] text-muted">{hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      <span className="h-px w-full bg-white/8" />

      {/* Row: playback + display */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {/* Pause / play */}
        <button
          type="button"
          onClick={onTogglePaused}
          aria-pressed={!paused}
          className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-white/25 hover:bg-white/10"
        >
          <span aria-hidden="true">{paused ? "▶" : "⏸"}</span>
          {paused ? "Play" : "Pause"}
        </button>

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
              style={{
                transform: showLabels ? "translateX(18px)" : "translateX(3px)",
              }}
            />
          </span>
          Labels
        </button>

        <span className="hidden h-5 w-px bg-white/10 sm:block" />

        {/* Speed presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs uppercase tracking-wide text-muted">Speed</span>
          <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
            {SPEED_OPTIONS.map((preset) => {
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
                  {preset}×
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset view */}
        <button
          type="button"
          onClick={onReset}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-white/25 hover:bg-white/10"
        >
          <span aria-hidden="true">⟳</span> Reset view
        </button>
      </div>

      <span className="h-px w-full bg-white/8" />

      {/* Row: visual emphasis (options depend on the active model) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-muted">View</span>
        <div className="flex flex-wrap rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
          {visualModes.map(({ mode, label }) => {
            const active = mode === visualMode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onVisualModeChange(mode)}
                aria-pressed={active}
                className="rounded-md px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  color: active ? "#05060f" : "var(--color-muted)",
                  background: active ? accent : "transparent",
                  boxShadow: active ? `0 0 16px -4px ${accent}` : "none",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
