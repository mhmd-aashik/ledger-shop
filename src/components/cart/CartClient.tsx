"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import {
  updateCartItemQuantity,
  removeFromCart,
  CartItem,
} from "@/lib/actions/cart.action";
import { toast } from "sonner";
import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";

interface CartClientProps {
  initialItems: CartItem[];
}

export default function CartClient({ initialItems }: CartClientProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);

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
        toast.success("Quantity updated");
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      const result = await removeFromCart(productId);
      if (result.success) {
        setItems(items.filter((item) => item.id !== productId));
        toast.success("Item removed from cart");
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  if (items.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <CartItems
        items={items}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
    </div>
  );
}
