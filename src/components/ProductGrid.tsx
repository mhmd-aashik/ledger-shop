"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import { toast } from "sonner";
import { addToCart } from "@/lib/actions/cart.action";
import { Button } from "./ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  thumbnail?: string | null;
  images: string[];
  category: {
    name: string;
  };
  description: string;
  shortDescription?: string | null;
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProductGrid() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/public/products?limit=8&featured=true"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-8 lg:py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 lg:py-8 bg-background">
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
              key={product.id}
              className="group leather-card rounded-xl overflow-hidden hover-zoom relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={
                    product.thumbnail ||
                    product.images[0] ||
                    "/assets/images/leather1.jpg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay with actions */}
                <div
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-4 transition-opacity duration-300 ${
                    hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <button
                    onClick={async () => {
                      if (isLoading === product.id) return;

                      setIsLoading(product.id);
                      try {
                        const result = await addToCart(product.id, 1);
                        if (result.success) {
                          toast.success(`${product.name} added to cart!`);
                          // Dispatch custom event to update header count
                          window.dispatchEvent(new CustomEvent("cartUpdated"));
                        } else {
                          toast.error(result.error || "Failed to add to cart");
                        }
                      } catch (error) {
                        console.error("Error adding to cart:", error);
                        toast.error("Something went wrong");
                      } finally {
                        setIsLoading(null);
                      }
                    }}
                    disabled={isLoading === product.id}
                    className="bg-white text-foreground p-3 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                  <FavoriteButton
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image:
                        product.thumbnail ||
                        product.images[0] ||
                        "/assets/images/leather1.jpg",
                      slug: product.slug || product.id,
                      category: product.category.name,
                      rating: product.rating,
                      reviewCount: product.reviewCount,
                    }}
                    className="bg-white text-foreground p-3 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-sm text-muted-foreground uppercase tracking-wide">
                    {product.category.name}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                  <Link href={`/products/${product.slug || product.id}`}>
                    {product.name}
                  </Link>
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {product.shortDescription || product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      LKR {product.price.toLocaleString()}
                    </span>
                    {product.compareAtPrice &&
                      product.compareAtPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          LKR {product.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                  </div>
                  <Link
                    href={`/products/${product.slug || product.id}`}
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
        <Link
          href="/products"
          className="text-center mt-8 w-fit flex justify-center mx-auto"
        >
          <Button className="bg-gradient-to-r from-primary hover:cursor-pointer to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-7 rounded-lg font-medium text-lg transition-all duration-300 hover:scale-105 shadow-lg">
            Shop the Collection
          </Button>
        </Link>
      </div>
    </section>
  );
}
