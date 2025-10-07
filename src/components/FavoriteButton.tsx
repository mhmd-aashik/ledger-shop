"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  addToFavorites,
  removeFromFavorites,
  isProductFavorited,
} from "@/lib/actions/favorite.action";
import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    category: string;
    rating: number;
    reviewCount: number;
  };
  variant?: "default" | "icon" | "outline";
  size?: "sm" | "default" | "lg";
  className?: string;
  showText?: boolean;
}

export default function FavoriteButton({
  product,
  variant = "icon",
  size = "default",
  className,
  showText = false,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is favorited on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const result = await isProductFavorited(product.id);
      if (result.success) {
        setIsFavorited(result.isFavorited);
      }
    };
    checkFavoriteStatus();
  }, [product.id]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isFavorited) {
        const result = await removeFromFavorites(product.id);
        if (result.success) {
          setIsFavorited(false);
          toast.success("Removed from favorites");
          // Dispatch custom event to update header count
          window.dispatchEvent(new CustomEvent("favoritesUpdated"));
        } else {
          toast.error(result.error || "Failed to remove from favorites");
        }
      } else {
        const result = await addToFavorites(product.id);
        if (result.success) {
          setIsFavorited(true);
          toast.success("Added to favorites");
          // Dispatch custom event to update header count
          window.dispatchEvent(new CustomEvent("favoritesUpdated"));
        } else {
          toast.error(result.error || "Failed to add to favorites");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={handleToggle}
        disabled={isLoading}
        className={cn(
          "h-12 w-12 p-0 hover:bg-red-50 hover:text-red-600 transition-colors",
          isFavorited && "text-red-600",
          isLoading && "opacity-50 cursor-not-allowed",
          className
        )}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className={cn("h-10 w-10", isFavorited && "fill-current")} />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "transition-colors",
        isFavorited && "bg-red-50 text-red-600 hover:bg-red-100",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <Heart className={cn("h-10 w-10 mr-2", isFavorited && "fill-current")} />
      {showText && (isFavorited ? "Remove from Favorites" : "Add to Favorites")}
    </Button>
  );
}
