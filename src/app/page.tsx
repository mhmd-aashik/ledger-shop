import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import SanityDebug from "@/components/SanityDebug";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <ProductGrid />
      </main>
      <Footer />
      <SanityDebug />
    </div>
  );
}
