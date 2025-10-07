import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import CraftsmanshipSection from "@/components/CraftsmanshipSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default async function Home() {
  return (
    <main>
      <HeroCarousel />
      <ProductGrid />
      <CraftsmanshipSection />
      <TestimonialsSection />
    </main>
  );
}
