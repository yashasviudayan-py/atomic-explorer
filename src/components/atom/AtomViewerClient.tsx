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
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="glass-panel flex h-[26rem] items-center justify-center rounded-3xl sm:h-[34rem]">
          <span className="animate-pulse text-sm text-muted">
            Loading 3D atom…
          </span>
        </div>
        <div className="glass-panel hidden rounded-2xl lg:block" />
      </div>
    ),
  },
);

export function AtomViewerClient({ element }: { element: Element }) {
  return <AtomViewer element={element} />;
}
