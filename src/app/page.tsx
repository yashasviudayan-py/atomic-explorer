import { AmbientField } from "@/components/home/AmbientField";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCards } from "@/components/home/FeatureCards";

export default function HomePage() {
  return (
    <>
      {/* Ambient physics motion layer, above the static backdrop (z -1) but
          below the content wrapper (z 10). */}
      <AmbientField />
      <div className="relative z-10">
        <HeroSection />
        <FeatureCards />
      </div>
    </>
  );
}
