import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import CraftsmanshipSection from "@/components/CraftsmanshipSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Suspense } from "react";
import { ProductSuspense } from "@/components/SuspenseWrapper";
import { Loading } from "@/components/Loading";

export default async function Home() {
  return (
    <main>
      <Suspense fallback={<Loading type="page" />}>
        <HeroCarousel />
      </Suspense>

      <ProductSuspense count={8}>
        <ProductGrid limit={8} featured={true} />
      </ProductSuspense>

      <Suspense fallback={<Loading type="page" />}>
        <CraftsmanshipSection />
      </Suspense>

      <Suspense fallback={<Loading type="page" />}>
        <TestimonialsSection />
      </Suspense>
    </main>
  );
}
