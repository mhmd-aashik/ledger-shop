import { products } from "@/data/products";
import Link from "next/link";
import Image from "next/image";

export default function AllProductsGrid() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
            All Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our complete collection of premium leather goods
          </p>
        </div>

        {/* Product Grid - Show all products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    ${product.price}
                  </span>
                  <Link
                    href={`/products/${product.id}`}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-muted rounded-lg p-8">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
              Crafted with Excellence
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Each piece in our collection is handcrafted using traditional
              techniques and the finest materials, ensuring quality that lasts a
              lifetime.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-foreground/10 px-4 py-2 rounded-full">
                Premium Materials
              </span>
              <span className="bg-foreground/10 px-4 py-2 rounded-full">
                Handcrafted
              </span>
              <span className="bg-foreground/10 px-4 py-2 rounded-full">
                Lifetime Quality
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
