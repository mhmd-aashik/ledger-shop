"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ShoppingBag, ChevronLeft, ChevronRight, Play } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { addToCart } from "@/lib/actions/cart.action";
import { toast } from "sonner";
import { ProductItem } from "../../types/products.types";
import { useAnalytics } from "@/hooks/use-analytics";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ProductDetailClientProps {
  product: ProductItem;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(true); // Start with video
  const [videoEnded, setVideoEnded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { trackProductView, trackAddToCart } = useAnalytics();
  const { data: session, status } = useSession();

  // Track product view when component mounts
  useEffect(() => {
    trackProductView(product.id, product.name);
  }, [product.id, product.name, trackProductView]);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowVideo(false);
    // Start slideshow after video ends
    startSlideshow();
  };

  const startSlideshow = () => {
    const interval = setInterval(() => {
      setSelectedImage((prev) => {
        const next = (prev + 1) % product.images.length;
        if (next === 0) {
          // If we've cycled through all images, stop the slideshow
          clearInterval(interval);
        }
        return next;
      });
    }, 3000); // Change image every 3 seconds
  };

  return (
    <div className="space-y-4">
      {/* Main Image/Video */}
      <div className="relative aspect-square overflow-hidden rounded-xl leather-card">
        {showVideo && product.video ? (
          <video
            src={product.video}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
          />
        ) : (
          <Image
            src={product.images[selectedImage]}
            alt={product.name}
            fill
            className="object-cover"
            priority
            draggable={false}
          />
        )}

        {/* Navigation Arrows - Only show after video ends */}
        {!showVideo && product.images.length > 1 && videoEnded && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-4">
        {/* Video Thumbnail - First position like AliExpress */}
        {product.video && (
          <button
            onClick={toggleVideo}
            className={`aspect-square overflow-hidden rounded-lg transition-all duration-200 relative group ${
              showVideo ? "ring-2 ring-accent scale-105" : "hover:scale-105"
            }`}
          >
            {/* Video thumbnail with play icon overlay */}
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-8 h-8 text-white mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs text-white/80 font-medium">Video</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
          </button>
        )}

        {/* Image Thumbnails */}
        {product.images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedImage(index);
              setShowVideo(false);
            }}
            className={`aspect-square overflow-hidden rounded-lg transition-all duration-200 ${
              selectedImage === index && !showVideo
                ? "ring-2 ring-accent scale-105"
                : "hover:scale-105"
            }`}
          >
            <Image
              src={image}
              alt={`${product.name} view ${index + 1}`}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Interactive Controls */}
      <div className="space-y-6">
        {/* Quantity & Add to Cart */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Quantity
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors duration-200"
            >
              -
            </button>
            <span className="w-16 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors duration-200"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex space-x-4">
          {status === "loading" ? (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Loading...</span>
            </button>
          ) : status === "unauthenticated" || !session ? (
            <Link
              href="/sign-in"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Sign In to Add to Cart</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (isAddingToCart) return;

                setIsAddingToCart(true);
                try {
                  const result = await addToCart(product.id, quantity);
                  if (result.success) {
                    // Track add to cart event
                    trackAddToCart(
                      product.id,
                      product.name,
                      Number(product.price),
                      quantity
                    );
                    toast.success(
                      `${quantity} x ${product.name} added to cart!`
                    );
                    // Dispatch event to update header count
                    window.dispatchEvent(new CustomEvent("cartUpdated"));
                  } else {
                    toast.error(result.error || "Failed to add to cart");
                  }
                } catch (error) {
                  console.error("Error adding to cart:", error);
                  toast.error("Something went wrong");
                } finally {
                  setIsAddingToCart(false);
                }
              }}
              disabled={isAddingToCart}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          )}
          <FavoriteButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              slug: product.id, // Using id as slug for now
              category: product.category,
              rating: product.rating,
              reviewCount: product.reviews,
            }}
            className="p-4 border border-border rounded-lg hover:bg-muted transition-colors duration-200"
          />
        </div>
      </div>
    </div>
  );
}
