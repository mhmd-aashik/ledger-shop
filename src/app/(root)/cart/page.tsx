"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getCartItems,
  updateCartItemQuantity,
  removeFromCart,
  CartItem,
} from "@/lib/actions/cart.action";
import { useState, useEffect } from "react";

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart items from database
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const result = await getCartItems();
        if (result.success) {
          setItems(result.items || []);
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      await handleRemoveItem(productId);
      return;
    }

    try {
      const result = await updateCartItemQuantity(productId, newQuantity);
      if (result.success) {
        setItems(
          items.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const result = await removeFromCart(productId);
      if (result.success) {
        setItems(items.filter((item) => item.id !== productId));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              Shopping Cart
            </h1>
          </div>

          {isLoading ? (
            /* Loading State */
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your cart...</p>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8">
                Discover our collection of premium leather goods
              </p>
              <Link
                href="/"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-medium transition-colors duration-200"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="leather-card rounded-xl p-6 relative"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 relative overflow-hidden rounded-lg flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-serif font-semibold text-foreground mb-1">
                          {item.name}
                        </h3>
                        {item.color && (
                          <p className="text-sm text-muted-foreground mb-2">
                            Color: {item.color}
                          </p>
                        )}
                        <p className="text-xl font-bold text-foreground">
                          {item.price} LKR
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 border border-border rounded-lg flex items-center justify-center hover:bg-muted transition-colors duration-200"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="leather-card rounded-xl p-6 sticky top-24">
                  <h2 className="text-xl font-serif font-semibold text-foreground mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{subtotal} LKR</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? "Free" : `${shipping} LKR`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Free shipping on orders over 500 LKR
                      </p>
                    )}
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>{total} LKR</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 px-6 rounded-lg font-medium transition-colors duration-200 mb-4">
                      Proceed to Checkout
                    </button>
                  </Link>

                  <p className="text-xs text-muted-foreground text-center">
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
