import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import CraftsmanshipSection from "@/components/CraftsmanshipSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

export const revalidate = 0; // sec = 0 means revalidate on every request

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <ProductGrid />
        <CraftsmanshipSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
