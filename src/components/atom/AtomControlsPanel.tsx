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

const MODELS: { mode: AtomicModelMode; label: string }[] = [
  { mode: "bohr", label: "Educational Bohr" },
  { mode: "quantum", label: "Quantum Cloud" },
];

/** Visual-emphasis presets available per model. */
const VISUAL_MODES: Record<
  AtomicModelMode,
  { mode: AtomVisualMode; label: string }[]
> = {
  bohr: [
    { mode: "balanced", label: "Balanced" },
    { mode: "particle-focus", label: "Particles" },
    { mode: "shell-focus", label: "Shells" },
  ],
  quantum: [
    { mode: "balanced", label: "Balanced" },
    { mode: "particle-focus", label: "Particles" },
    { mode: "orbital-focus", label: "Orbitals" },
  ],
};

/** Compact eyebrow label above each control group. */
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted-2">
      {children}
    </span>
  );
}

/**
 * Control bar for the atom viewer, styled after Apple segmented controls:
 * model switcher, visual emphasis, playback + speed, labels switch, and
 * reset-view. Pure DOM (lives outside the Canvas) so it can use the app's
 * Tailwind theme directly.
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
}: AtomControlsPanelProps) {
  const visualModes = VISUAL_MODES[atomicModelMode];

  return (
    <div className="glass-panel-subtle flex flex-col gap-3 rounded-2xl px-4 py-3.5">
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        {/* Model switch */}
        <div className="flex flex-col gap-1.5">
          <GroupLabel>Model</GroupLabel>
          <div className="segmented-control">
            {MODELS.map(({ mode, label }) => (
              <button
                key={mode}
                type="button"
                onClick={() => onModelModeChange(mode)}
                aria-pressed={mode === atomicModelMode}
                data-active={mode === atomicModelMode}
                className="segment"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual emphasis (options depend on the active model) */}
        <div className="flex flex-col gap-1.5">
          <GroupLabel>View</GroupLabel>
          <div className="segmented-control">
            {visualModes.map(({ mode, label }) => (
              <button
                key={mode}
                type="button"
                onClick={() => onVisualModeChange(mode)}
                aria-pressed={mode === visualMode}
                data-active={mode === visualMode}
                className="segment"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Speed presets + pause */}
        <div className="flex flex-col gap-1.5">
          <GroupLabel>Speed</GroupLabel>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTogglePaused}
              aria-pressed={!paused}
              aria-label={paused ? "Play animation" : "Pause animation"}
              className="flex h-[33px] w-[33px] items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.06] text-xs text-foreground transition-colors hover:bg-white/[0.12]"
            >
              <span aria-hidden="true">{paused ? "▶" : "⏸"}</span>
            </button>
            <div className="segmented-control">
              {SPEED_OPTIONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onSpeedChange(preset)}
                  aria-pressed={preset === speed}
                  data-active={preset === speed}
                  className="segment"
                >
                  {preset === 0 ? "Paused" : `${preset}×`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Labels switch + reset */}
        <div className="ml-auto flex items-center gap-4 pb-0.5">
          <button
            type="button"
            onClick={onToggleLabels}
            aria-pressed={showLabels}
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <span
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
              style={{
                background: showLabels ? "#0a84ff" : "rgba(255,255,255,0.14)",
              }}
            >
              <span
                className="absolute h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
                style={{
                  transform: showLabels ? "translateX(18px)" : "translateX(2px)",
                }}
              />
            </span>
            Labels
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-[10px] border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-white/[0.12]"
          >
            <span aria-hidden="true">⟳</span> Reset view
          </button>
        </div>
      </div>
    </div>
  );
}
