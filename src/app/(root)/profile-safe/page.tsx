"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileClient from "@/components/profile/ProfileClient";

// Type for user data
type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  dateOfBirth: string | null;
  gender: string | null;
  preferences: Record<string, any>;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type FavoriteProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  imageUrl: string;
  category: string;
  tags: string[];
  inStock: boolean;
  stockQuantity: number;
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};

export default function ProfileSafePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  // Default user data
  const userData: UserData = {
    firstName: session?.user?.name?.split(" ")[0] || "",
    lastName: session?.user?.name?.split(" ").slice(1).join(" ") || "",
    email: session?.user?.email || "",
    imageUrl: session?.user?.image || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    dateOfBirth: null,
    gender: null,
    preferences: {},
    isEmailVerified: false,
    isPhoneVerified: false,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProfileClient initialUserData={userData} initialFavorites={[]} />
        </div>
      </main>
    </div>
  );
}
