"use client";

import { useState } from "react";
import { removeFromFavorites } from "@/lib/actions/favorite.action";
import { toast } from "sonner";
import FavoritesGrid from "./FavoritesGrid";
import EmptyFavorites from "./EmptyFavorites";

// Type for the product returned from getFavoriteProducts (with numbers instead of Decimals)
interface FavoriteProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  sku: string | null;
  barcode: string | null;
  trackQuantity: boolean;
  quantity: number;
  lowStockThreshold: number;
  images: string[];
  video: string | null;
  thumbnail: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    sortOrder: number;
    isActive: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  tags: string[];
  features: string[];
  materials: string[];
  dimensions: string | null;
  weight: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

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

interface FavoritesClientProps {
  initialFavorites: FavoriteProduct[];
}

export default function FavoritesClient({
  initialFavorites,
}: FavoritesClientProps) {
  const [favorites, setFavorites] = useState<TransformedProduct[]>(
    initialFavorites.map((product: FavoriteProduct) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "/placeholder.jpg",
      slug: product.slug,
      category: product.category.name || "Uncategorized",
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
    }))
  );
  const [isClearing, setIsClearing] = useState(false);

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
    return <EmptyFavorites />;
  }

  return (
    <FavoritesGrid
      favorites={favorites}
      onRemoveItem={handleRemoveItem}
      onClearAll={handleClearAll}
      isClearing={isClearing}
    />
  );
}
