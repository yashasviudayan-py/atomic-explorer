/**
 * CSS-only atom visualization placeholder.
 *
 * Hints at the future React Three Fiber / Three.js scene using nested orbit
 * rings, animated electrons, and a glowing nucleus. Intentionally
 * self-contained so it can be swapped for the real 3D component later without
 * touching the hero layout.
 */
export function AtomPreview() {
  return (
    <div className="relative aspect-square w-full max-w-[26rem] select-none">
      {/* Ambient glow behind the atom */}
      <div className="absolute inset-0 rounded-full bg-accent/[0.07] blur-3xl" />

      <div className="glass-panel-subtle relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl">
        {/* Grid sheen */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(circle at center, black 35%, transparent 75%)",
          }}
        />

        {/* Orbit system */}
        <div className="relative flex h-[78%] w-[78%] items-center justify-center">
          <OrbitRing
            sizeClass="h-full w-full"
            tiltClass="[transform:rotateX(72deg)]"
            animation="var(--animate-orbit-slow)"
            electronClass="bg-accent-cyan shadow-[0_0_10px_2px_var(--color-accent-cyan)]"
          />
          <OrbitRing
            sizeClass="h-[68%] w-[68%]"
            tiltClass="[transform:rotateX(72deg)_rotateZ(60deg)]"
            animation="var(--animate-orbit-medium)"
            electronClass="bg-accent shadow-[0_0_10px_2px_var(--color-accent)]"
          />
          <OrbitRing
            sizeClass="h-[40%] w-[40%]"
            tiltClass="[transform:rotateX(72deg)_rotateZ(-60deg)]"
            animation="var(--animate-orbit-fast)"
            electronClass="bg-accent-cyan shadow-[0_0_10px_2px_var(--color-accent-cyan)]"
          />

          {/* Nucleus */}
          <div className="relative h-16 w-16 animate-[var(--animate-float)] rounded-full bg-gradient-to-br from-accent-cyan via-accent to-accent shadow-[0_0_32px_-6px_var(--color-accent)]">
            <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
          </div>
        </div>

        {/* Caption */}
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.7rem] font-medium tracking-wide text-muted backdrop-blur">
          Open any element for the full 3D atom
        </span>
      </div>
    </div>
  );
}

interface OrbitRingProps {
  /** Tailwind sizing classes for the ring diameter. */
  sizeClass: string;
  /** Tailwind transform classes to tilt the ring into a 3D-looking ellipse. */
  tiltClass: string;
  /** CSS animation shorthand (orbit speed). */
  animation: string;
  /** Tailwind classes styling the electron dot. */
  electronClass: string;
}

/** A single tilted orbit ring carrying one rotating electron. */
function OrbitRing({
  sizeClass,
  tiltClass,
  animation,
  electronClass,
}: OrbitRingProps) {
  return (
    <div
      className={`absolute rounded-full border border-white/15 ${sizeClass} ${tiltClass}`}
    >
      <div
        className="absolute inset-0"
        style={{ animation, transformOrigin: "center" }}
      >
        <span
          className={`absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full ${electronClass}`}
        />
      </div>
    </div>
  );
}
