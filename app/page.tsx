import { MainNavigation } from "@/components/navigation/main-navigation";
import { HeroSection } from "@/components/sections/hero-section";

export default function HomePage() {
  return (
    <>
      <MainNavigation />
      <main>
        <HeroSection />
      </main>
    </>
  );
}