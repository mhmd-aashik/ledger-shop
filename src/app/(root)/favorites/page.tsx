"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Trash2, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavoriteButton from "@/components/FavoriteButton";
import {
  getFavoriteProducts,
  removeFromFavorites,
} from "@/lib/actions/favorite.action";
import { addToCart } from "@/lib/actions/cart.action";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  // Load favorites from database
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const result = await getFavoriteProducts();
        if (result.success) {
          setFavorites(result.favorites || []);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      // Remove all favorites one by one
      for (const favorite of favorites) {
        await removeFromFavorites(favorite.id);
      }
      setFavorites([]);
      toast.success("All favorites cleared");
      // Dispatch event to update header count
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    } catch (error) {
      console.error("Error clearing favorites:", error);
      toast.error("Failed to clear favorites");
    } finally {
      setIsClearing(false);
    }
  };

  const handleRemoveItem = async (productId: string, productName: string) => {
    try {
      const result = await removeFromFavorites(productId);
      if (result.success) {
        setFavorites(favorites.filter((fav) => fav.id !== productId));
        toast.success(`${productName} removed from favorites`);
        // Dispatch event to update header count
        window.dispatchEvent(new CustomEvent("favoritesUpdated"));
      } else {
        toast.error(result.error || "Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Something went wrong");
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
                Your favorites list is empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Start adding products you love to your favorites
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
                  My Favorites
                </h1>
                <p className="text-muted-foreground mt-2">
                  {favorites.length} {favorites.length === 1 ? "item" : "items"}{" "}
                  in your favorites
                </p>
              </div>
              {favorites.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearAll}
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
                      onClick={() => {
                        const added = addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                        });
                        if (added) {
                          toast.success(`${product.name} added to cart!`);
                        } else {
                          toast.error(
                            `${product.name} is already in your cart!`
                          );
                        }
                      }}
                      className="bg-white text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveItem(product.id, product.name)}
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
                    <Link href={`/products/${product.slug}`}>
                      {product.name}
                    </Link>
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
