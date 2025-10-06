"use server";

import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Create a new Prisma client instance for server actions
const prisma = new PrismaClient();

export interface CreateUserData {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

/**
 * Create a new user in the database
 */
export async function createUser(data: CreateUserData) {
  try {
    const user = await prisma.user.create({
      data: {
        clerkId: data.clerkId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
      },
    });

    // Create a default profile for the user
    await prisma.profile.create({
      data: {
        userId: user.id,
        newsletterSubscribed: false,
        marketingEmails: false,
        smsNotifications: false,
      },
    });

    // Create a default wishlist for the user
    await prisma.wishlist.create({
      data: {
        userId: user.id,
        name: "My Wishlist",
        isPublic: false,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

/**
 * Update an existing user in the database
 */
export async function updateUser(clerkId: string, data: UpdateUserData) {
  try {
    const user = await prisma.user.update({
      where: { clerkId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
      },
    });

    revalidatePath("/profile");
    return { success: true, user };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        profile: true,
        addresses: true,
        wishlists: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}

/**
 * Get current user from Clerk and database
 */
export async function getCurrentUser() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return { success: false, error: "No authenticated user" };
    }

    const result = await getUserByClerkId(clerkUser.id);
    return result;
  } catch (error) {
    console.error("Error getting current user:", error);
    return { success: false, error: "Failed to get current user" };
  }
}

/**
 * Delete user and all related data
 */
export async function deleteUser(clerkId: string) {
  try {
    // Delete user (cascade will handle related data)
    await prisma.user.delete({
      where: { clerkId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

/**
 * Sync user data from Clerk to database
 * This function is called when a user signs up or updates their profile
 */
export async function syncUserFromClerk(clerkUser: {
  id: string;
  emailAddresses: { emailAddress: string }[];
  firstName: string;
  lastName: string;
  imageUrl: string;
}) {
  try {
    console.log("syncUserFromClerk called with:", clerkUser);
    console.log("prisma object:", prisma);
    console.log("prisma type:", typeof prisma);

    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }

    if (!prisma.user) {
      throw new Error("Prisma user model is not available");
    }

    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (existingUser) {
      // Update existing user
      return await updateUser(clerkUser.id, {
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      });
    } else {
      // Create new user
      return await createUser({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
      });
    }
  } catch (error) {
    console.error("Error syncing user from Clerk:", error);
    return { success: false, error: "Failed to sync user" };
  }
}

/**
 * Check if user exists in database
 */
export async function userExists(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    return { success: true, exists: !!user };
  } catch (error) {
    console.error("Error checking user existence:", error);
    return { success: false, error: "Failed to check user existence" };
  }
}
