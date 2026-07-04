"use client";

import dynamic from "next/dynamic";
import type { Element } from "@/types/element";

/**
 * Client-only loader for {@link AtomViewer}.
 *
 * The 3D viewer relies on WebGL and browser APIs, so it must not render on the
 * server. `ssr: false` can only be requested from a client component, hence
 * this thin wrapper that the server-rendered detail page imports. A matching
 * placeholder keeps layout stable while the Three.js bundle loads.
 */
const AtomViewer = dynamic(
  () => import("./AtomViewer").then((mod) => mod.AtomViewer),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,26rem)]">
        <div className="glass-panel-subtle flex h-[clamp(24rem,60vh,32rem)] items-center justify-center rounded-3xl lg:h-[clamp(560px,70vh,820px)]">
          <span className="animate-pulse text-sm text-muted">
            Loading 3D atom…
          </span>
        </div>
        <div className="glass-panel-subtle hidden rounded-2xl lg:block" />
      </div>
    ),
  },
);

export function AtomViewerClient({ element }: { element: Element }) {
  return <AtomViewer element={element} />;
}
