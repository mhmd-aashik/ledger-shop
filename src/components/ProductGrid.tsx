"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { client, queries, urlFor, isSanityReady } from "../../lib/sanity";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: any[] | null;
  category: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  description: string;
  slug: { current: string };
  inStock: boolean;
  featured: boolean;
}

export default function ProductGrid() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProducts = async () => {
      // Check if Sanity is properly configured
      if (!isSanityReady()) {
        console.log("Sanity not configured, using fallback products");
        setProducts([
           {
             _id: "1",
             name: "Classic Leather Wallet",
             price: 450,
             images: null,
             category: {
               _id: "cat1",
               name: "Wallets",
               slug: { current: "wallets" },
             },
             description: "Handcrafted from premium Italian leather",
             slug: { current: "classic-leather-wallet" },
             inStock: true,
             featured: true,
           },
           {
             _id: "2",
             name: "Minimalist Cardholder",
             price: 280,
             images: null,
             category: {
               _id: "cat2",
               name: "Cardholders",
               slug: { current: "cardholders" },
             },
             description: "Sleek design for the modern professional",
             slug: { current: "minimalist-cardholder" },
             inStock: true,
             featured: false,
           },
        ]);
        setLoading(false);
        return;
      }

      try {
        const data = await client.fetch(queries.allProducts);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback to hardcoded data if Sanity is not configured
        setProducts([
           {
             _id: "1",
             name: "Classic Leather Wallet",
             price: 450,
             images: null,
             category: {
               _id: "cat1",
               name: "Wallets",
               slug: { current: "wallets" },
             },
             description: "Handcrafted from premium Italian leather",
             slug: { current: "classic-leather-wallet" },
             inStock: true,
             featured: true,
           },
           {
             _id: "2",
             name: "Minimalist Cardholder",
             price: 280,
             images: null,
             category: {
               _id: "cat2",
               name: "Cardholders",
               slug: { current: "cardholders" },
             },
             description: "Sleek design for the modern professional",
             slug: { current: "minimalist-cardholder" },
             inStock: true,
             featured: false,
           },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Our Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of premium leather goods,
            each piece crafted with attention to detail and timeless elegance.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group leather-card rounded-xl overflow-hidden hover-zoom relative"
              onMouseEnter={() => setHoveredProduct(product._id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={
                      product.images?.[0]?.asset?._ref
                        ? urlFor(product.images[0]).width(400).height(400).url()
                        : `/assets/images/leather${(parseInt(product._id) % 8) + 1}.jpg`
                    }
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                {/* Overlay with actions */}
                <div
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-opacity duration-300 ${
                    hoveredProduct === product._id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <button
                    onClick={() => {
                        const added = addToCart({
                          id: product._id,
                          name: product.name,
                          price: product.price,
                          image: product.images?.[0]?.asset?._ref
                            ? urlFor(product.images[0])
                                .width(400)
                                .height(400)
                                .url()
                            : `/assets/images/leather${(parseInt(product._id) % 8) + 1}.jpg`,
                        });
                      if (added) {
                        toast.success(`${product.name} added to cart!`);
                      } else {
                        toast.error(`${product.name} is already in your cart!`);
                      }
                    }}
                    className="bg-white text-foreground p-3 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                  <button className="bg-white text-foreground p-3 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground uppercase tracking-wide">
                    {product.category?.name}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                  <Link
                    href={`/products/${product.slug?.current || product._id}`}
                  >
                    {product.name}
                  </Link>
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    {product.price} LKR
                  </span>
                  <Link
                    href={`/products/${product.slug?.current || product._id}`}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 inline-block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 shadow-lg">
            Shop the Collection
          </button>
        </div>
      </div>
    </section>
  );
}
