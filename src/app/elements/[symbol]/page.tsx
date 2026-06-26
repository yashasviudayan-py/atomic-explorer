import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

interface ElementDetailPageProps {
  // In the Next.js App Router (v15+), dynamic route params are async.
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({
  params,
}: ElementDetailPageProps): Promise<Metadata> {
  const { symbol } = await params;
  const display = formatSymbol(symbol);
  return {
    title: `Element ${display}`,
    description: `Atomic structure and scientific facts for element ${display}.`,
  };
}

export default async function ElementDetailPage({
  params,
}: ElementDetailPageProps) {
  const { symbol } = await params;
  const display = formatSymbol(symbol);

  return (
    <PagePlaceholder
      eyebrow={`Element · ${display}`}
      title={`Inside ${display}`}
      description="This is where the 3D atom visualization will live — orbiting electrons, layered shells, and a glowing nucleus, paired with the element's key scientific facts."
      upcoming={[
        "3D atom with protons & neutrons",
        "Electron shell configuration",
        "Atomic mass, group & period",
        "Notable scientific facts",
      ]}
    />
  );
}

/** Normalize a raw URL symbol (e.g. "he") into display form (e.g. "He"). */
function formatSymbol(raw: string): string {
  const decoded = decodeURIComponent(raw);
  if (decoded.length === 0) return decoded;
  return decoded.charAt(0).toUpperCase() + decoded.slice(1).toLowerCase();
}
