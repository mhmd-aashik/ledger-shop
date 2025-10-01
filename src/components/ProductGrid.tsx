"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Classic Leather Wallet",
    price: 450,
    image: "/assets/images/leather1.jpg",
    category: "Wallets",
    description: "Handcrafted from premium Italian leather",
  },
  {
    id: "2",
    name: "Minimalist Cardholder",
    price: 280,
    image: "/assets/images/leather2.jpg",
    category: "Cardholders",
    description: "Sleek design for the modern professional",
  },
  {
    id: "3",
    name: "Executive Briefcase",
    price: 1200,
    image: "/assets/images/leather3.jpg",
    category: "Accessories",
    description: "Professional elegance meets functionality",
  },
  {
    id: "4",
    name: "Vintage Leather Belt",
    price: 320,
    image: "/assets/images/leather4.jpg",
    category: "Accessories",
    description: "Timeless style with contemporary comfort",
  },
  {
    id: "5",
    name: "Luxury Key Holder",
    price: 180,
    image: "/assets/images/leather5.jpg",
    category: "Accessories",
    description: "Keep your keys organized in style",
  },
  {
    id: "6",
    name: "Premium Watch Strap",
    price: 220,
    image: "/assets/images/leather6.jpg",
    category: "Accessories",
    description: "Hand-stitched for ultimate comfort",
  },
  {
    id: "7",
    name: "Business Card Holder",
    price: 150,
    image: "/assets/images/leather7.jpg",
    category: "Accessories",
    description: "Make a lasting first impression",
  },
  {
    id: "8",
    name: "Travel Wallet",
    price: 380,
    image: "/assets/images/leather8.jpg",
    category: "Wallets",
    description: "Perfect companion for your journeys",
  },
];

export default function ProductGrid() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { addToCart } = useCartStore();

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
              key={product.id}
              className="group leather-card rounded-xl overflow-hidden hover-zoom relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
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
                    onClick={() => {
                      const added = addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image
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
                    {product.category}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    {product.price} QAR
                  </span>
                  <Link
                    href={`/products/${product.id}`}
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
