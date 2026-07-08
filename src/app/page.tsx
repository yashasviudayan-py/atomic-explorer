import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";

/**
 * Homepage. Deliberately lightweight: true-black OLED backdrop (see
 * `.app-backdrop` in the layout), a static SVG hero atom, and solid feature
 * cards. No canvas, starfield, or animated background layer — the page is cheap
 * to paint and smooth to scroll on mobile.
 */
export default function HomePage() {
  return (
    <div className="relative z-10">
      <HeroSection />
      <FeatureCards />
    </div>
  );
}
