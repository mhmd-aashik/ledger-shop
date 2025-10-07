"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { CreateUserData, UpdateUserData } from "./types/user.action.types";

// Create a new Prisma client instance for server actions
const prisma = new PrismaClient();

/**
 * Create a new user in the database
 */
export async function createUser(data: CreateUserData) {
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        imageUrl: data.imageUrl || null,
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
export async function updateUser(userId: string, data: UpdateUserData) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
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
 * Update user profile with comprehensive data
 */
export async function updateUserProfile(
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    phone?: string;
    dateOfBirth?: string;
    bio?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    preferences?: {
      newsletter: boolean;
      marketing: boolean;
      sms: boolean;
    };
  }
) {
  try {
    // Update basic user info
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
      },
    });

    // Update or create profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        bio: data.bio,
        newsletterSubscribed: data.preferences?.newsletter || false,
        marketingEmails: data.preferences?.marketing || false,
        smsNotifications: data.preferences?.sms || false,
      },
      create: {
        userId: user.id,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        bio: data.bio,
        newsletterSubscribed: data.preferences?.newsletter || false,
        marketingEmails: data.preferences?.marketing || false,
        smsNotifications: data.preferences?.sms || false,
      },
    });

    // Update or create address if provided
    if (data.address) {
      // First, deactivate existing default addresses
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });

      // Create new default address
      await prisma.address.create({
        data: {
          userId: user.id,
          type: "SHIPPING",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          address1: data.address.street,
          city: data.address.city,
          state: data.address.state,
          postalCode: data.address.zipCode,
          country: data.address.country,
          isDefault: true,
          isActive: true,
        },
      });
    }

    revalidatePath("/profile");
    return { success: true, user };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Failed to update user profile" };
  }
}

/**
 * Get user by Clerk ID
 */
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
 * Get current user from Auth.js and database
 */
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "No authenticated user" };
    }

    const result = await getUserById(session.user.id);
    return result;
  } catch (error) {
    console.error("Error getting current user:", error);
    return { success: false, error: "Failed to get current user" };
  }
}

/**
 * Delete user and all related data
 */
export async function deleteUser(userId: string) {
  try {
    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existingUser) {
      console.log(
        `User with id ${userId} not found in database, skipping deletion`
      );
      return { success: true, message: "User not found in database" };
    }

    // Delete user (cascade will handle related data)
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

/**
 * Sync user data from Auth.js to database
 * This function is called when a user signs up or updates their profile
 */
export async function syncUserFromAuth(authUser: {
  id: string;
  email: string;
  name?: string;
  image?: string;
}) {
  try {
    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }

    if (!prisma.user) {
      throw new Error("Prisma user model is not available");
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (existingUser) {
      // Update existing user
      const nameParts = authUser.name?.split(" ") || [];
      return await updateUser(authUser.id, {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        imageUrl: authUser.image,
      });
    } else {
      // Create new user
      const nameParts = authUser.name?.split(" ") || [];
      return await createUser({
        email: authUser.email,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        imageUrl: authUser.image,
      });
    }
  } catch (error) {
    console.error("Error syncing user from Auth.js:", error);
    return { success: false, error: "Failed to sync user" };
  }
}

/**
 * Check if user exists in database
 */
export async function userExists(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    return { success: true, exists: !!user };
  } catch (error) {
    console.error("Error checking user existence:", error);
    return { success: false, error: "Failed to check user existence" };
  }
}
