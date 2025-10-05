import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function Products() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="bg-leather-gradient py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Our Products
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of premium leather goods, each
              piece crafted with attention to detail and timeless elegance.
            </p>
          </div>
        </section>

        {/* Product Grid */}
        <ProductGrid />
      </main>

      <Footer />
    </div>
  );
}
