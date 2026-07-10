import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";
import { OriginsCta } from "@/components/origins/OriginsCta";

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
      <section className="page-shell pb-20 lg:pb-28">
        <OriginsCta />
      </section>
    </div>
  );
}
