import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import CraftsmanshipSection from "@/components/CraftsmanshipSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const maxDuration = 10;
export const fetchCache = "force-cache";
export const revalidateTag = "*";
export const runtime = "nodejs";

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
