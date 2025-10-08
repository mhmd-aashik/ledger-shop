import Image from "next/image";

export default function About() {
  return (
    <main className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/images/leather1.jpg"
            alt="About Heritano"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
              Our Story
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Crafting luxury leather goods with timeless elegance and
              uncompromising quality
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                At Heritano, we believe that luxury is not just about the final
                product, but about the journey of creation. Each piece in our
                collection is handcrafted by master artisans who have dedicated
                their lives to perfecting the art of leather work.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We source only the finest Italian leather and use traditional
                techniques passed down through generations, ensuring that every
                wallet, cardholder, and accessory meets our exacting standards
                of quality and beauty.
              </p>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-xl leather-card">
              <Image
                src="/assets/images/leather2.jpg"
                alt="Craftsmanship"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Craftsmanship */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square overflow-hidden rounded-xl leather-card order-2 lg:order-1">
              <Image
                src="/assets/images/leather3.jpg"
                alt="Traditional Techniques"
                fill
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
                Traditional Craftsmanship
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our artisans employ time-honored techniques that have been
                refined over centuries. From the careful selection of leather
                hides to the precise hand-stitching of seams, every step is
                performed with meticulous attention to detail.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Hand-selected premium Italian leather
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Traditional hand-stitching techniques
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Lifetime craftsmanship guarantee
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-6">
              Sustainability & Ethics
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We are committed to responsible sourcing and sustainable practices
              throughout our supply chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                Eco-Friendly Materials
              </h3>
              <p className="text-muted-foreground">
                We use only sustainably sourced leather and environmentally
                friendly tanning processes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                Fair Trade
              </h3>
              <p className="text-muted-foreground">
                Our artisans are paid fair wages and work in safe, comfortable
                conditions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">♻️</span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                Longevity
              </h3>
              <p className="text-muted-foreground">
                Our products are built to last, reducing the need for frequent
                replacements.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
