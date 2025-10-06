"use server";

import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

/**
 * Get user's favorite products
 */
export async function getFavoriteProducts() {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticated user" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: {
        favorites: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!dbUser) {
      return { success: false, error: "User not found in database" };
    }

    const favorites = dbUser.favorites.map((fav) => ({
      ...fav.product,
      price: fav.product.price.toNumber(),
      compareAtPrice: fav.product.compareAtPrice?.toNumber() || null,
      costPrice: fav.product.costPrice?.toNumber() || null,
      weight: fav.product.weight?.toNumber() || null,
      rating: fav.product.rating?.toNumber() || null,
    }));

    return { success: true, favorites };
  } catch (error) {
    console.error("Error getting favorite products:", error);
    return { success: false, error: "Failed to get favorite products" };
  }
}

/**
 * Add product to favorites
 */
export async function addToFavorites(productId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticated user" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { success: false, error: "User not found in database" };
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: dbUser.id,
          productId: productId,
        },
      },
    });

    if (existingFavorite) {
      return { success: true, message: "Product already in favorites" };
    }

    // Check if product exists before adding to favorites
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // Add to favorites
    await prisma.favorite.create({
      data: {
        userId: dbUser.id,
        productId: productId,
      },
    });

    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return { success: false, error: "Failed to add to favorites" };
  }
}

/**
 * Remove product from favorites
 */
export async function removeFromFavorites(productId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, error: "No authenticated user" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { success: false, error: "User not found in database" };
    }

    await prisma.favorite.deleteMany({
      where: {
        userId: dbUser.id,
        productId: productId,
      },
    });

    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return { success: false, error: "Failed to remove from favorites" };
  }
}

/**
 * Check if product is favorited
 */
export async function isProductFavorited(productId: string) {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, isFavorited: false };
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { success: false, isFavorited: false };
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: dbUser.id,
          productId: productId,
        },
      },
    });

    return { success: true, isFavorited: !!favorite };
  } catch (error) {
    console.error("Error checking if product is favorited:", error);
    return { success: false, isFavorited: false };
  }
}
