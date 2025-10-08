"use server";

import { auth } from "@/lib/auth";
import { prisma } from "../prisma";
import { withDatabaseConnection, getDatabaseErrorMessage } from "../db-utils";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string | null;
  color: string;
  rating: number;
  reviewCount: number;
}

/**
 * Get user's cart items
 */
export async function getCartItems() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "No authenticated user" };
    }

    const result = await withDatabaseConnection(
      async () => {
        // Get cart items with product details in a single query
        const cartItems = await prisma.cart.findMany({
          where: { userId: session.user.id },
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        });

        // Transform to CartItem format
        const items: CartItem[] = cartItems.map((item) => ({
          id: item.productId,
          productId: item.productId,
          quantity: item.quantity,
          name: item.product.name,
          price: Number(item.product.price),
          image: item.product.images[0] || "/placeholder.jpg",
          slug: item.product.slug,
          category: item.product.category.name,
          color: "Default", // You might want to add color to your product model
          rating: Number(item.product.rating) || 0,
          reviewCount: item.product.reviewCount,
        }));

        return items;
      },
      [] // Fallback to empty array
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to get cart items",
        items: result.data || [],
      };
    }

    return { success: true, items: result.data || [] };
  } catch (error) {
    console.error("Error getting cart items:", error);
    return {
      success: false,
      error: getDatabaseErrorMessage(error),
      items: [],
    };
  }
}

/**
 * Add item to cart
 */
export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "No authenticated user" };
    }

    const result = await withDatabaseConnection(async () => {
      // Check if product exists first
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Use upsert to handle both insert and update in one operation
      await prisma.cart.upsert({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: productId,
          },
        },
        update: {
          quantity: {
            increment: quantity,
          },
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          productId: productId,
          quantity: quantity,
        },
      });

      return true;
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to add to cart",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      success: false,
      error: getDatabaseErrorMessage(error),
    };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(productId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "No authenticated user" };
    }

    // Remove item from cart
    await prisma.cart.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });

    // Note: We don't need revalidatePath here since we're using client-side state management
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
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "No authenticated user" };
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await prisma.cart.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: productId,
          },
        },
      });
    } else {
      // Update quantity
      await prisma.cart.update({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: productId,
          },
        },
        data: {
          quantity: quantity,
          updatedAt: new Date(),
        },
      });
    }

    // Note: We don't need revalidatePath here since we're using client-side state management
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
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "No authenticated user" };
    }

    // Clear all cart items for user
    await prisma.cart.deleteMany({
      where: { userId: session.user.id },
    });

    // Note: We don't need revalidatePath here since we're using client-side state management
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}
