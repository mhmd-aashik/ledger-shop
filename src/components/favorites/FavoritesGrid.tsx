"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FavoriteButton from "@/components/FavoriteButton";
import { addToCart } from "@/lib/actions/cart.action";
import { toast } from "sonner";

// Type for the transformed product that matches FavoriteButton expectations
interface TransformedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  rating: number;
  reviewCount: number;
}

interface FavoritesGridProps {
  favorites: TransformedProduct[];
  onRemoveItem: (productId: string, productName: string) => void;
  onClearAll: () => void;
  isClearing: boolean;
}

export default function FavoritesGrid({
  favorites,
  onRemoveItem,
  onClearAll,
  isClearing,
}: FavoritesGridProps) {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              My Favorites
            </h1>
            <p className="text-muted-foreground mt-2">
              {favorites.length} {favorites.length === 1 ? "item" : "items"} in
              your favorites
            </p>
          </div>
          {favorites.length > 0 && (
            <Button
              variant="outline"
              onClick={onClearAll}
              disabled={isClearing}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isClearing ? "Clearing..." : "Clear All"}
            </Button>
          )}
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div
            key={product.id}
            className="group leather-card rounded-xl overflow-hidden hover-zoom relative"
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Favorite Button */}
              <div className="absolute top-3 right-3">
                <FavoriteButton
                  product={product}
                  className="bg-white/90 backdrop-blur-sm hover:bg-white"
                />
              </div>

              {/* Quick Actions */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  onClick={async () => {
                    try {
                      const result = await addToCart(product.id, 1);
                      if (result.success) {
                        toast.success(`${product.name} added to cart!`);
                        // Dispatch event to update header count
                        window.dispatchEvent(new CustomEvent("cartUpdated"));
                      } else {
                        toast.error(result.error || "Failed to add to cart");
                      }
                    } catch (error) {
                      console.error("Error adding to cart:", error);
                      toast.error("Something went wrong");
                    }
                  }}
                  className="bg-white text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onRemoveItem(product.id, product.name)}
                  className="bg-white/90 text-foreground hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="mb-2">
                <span className="text-sm text-muted-foreground uppercase tracking-wide">
                  {product.category}
                </span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
              </h3>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-3">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.floor(product.rating)
                          ? "text-accent fill-current"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">
                  {product.price} LKR
                </span>
                <Link
                  href={`/products/${product.slug}`}
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
      <div className="text-center mt-12">
        <Link href="/products">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    </>
  );
}
