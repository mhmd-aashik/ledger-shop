"use server";

import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  color: string;
  rating: number;
  reviewCount: number;
}

/**
 * Get user's cart items
 */
export async function getCartItems() {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticated user" };
    }

    // For now, we'll use a simple approach with localStorage for cart
    // In a full implementation, you'd store cart items in the database
    // This is a temporary solution until we implement proper cart storage
    const cartItems: CartItem[] = [];

    return { success: true, items: cartItems };
  } catch (error) {
    console.error("Error getting cart items:", error);
    return { success: false, error: "Failed to get cart items" };
  }
}

/**
 * Add item to cart
 */
export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticated user" };
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // For now, we'll use a simple approach
    // In a full implementation, you'd store cart items in the database
    // This is a temporary solution until we implement proper cart storage
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add to cart" };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(productId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticated user" };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: "Failed to remove from cart" };
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  productId: string,
  quantity: number
) {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticated user" };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return { success: false, error: "Failed to update cart quantity" };
  }
}

/**
 * Clear cart
 */
export async function clearCart() {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticated user" };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}
