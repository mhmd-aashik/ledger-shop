import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getFavoriteProducts } from "@/lib/actions/favorite.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import ProfileTabs from "@/components/profile/ProfileTabs";

// Type for user data
type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  phone: string;
  dateOfBirth: string;
  bio: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    marketing: boolean;
    sms: boolean;
  };
};

// Type for favorite products with category
type FavoriteProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number | null;
  sku: string | null;
  barcode: string | null;
  trackQuantity: boolean;
  quantity: number;
  lowStockThreshold: number;
  images: string[];
  video: string | null;
  thumbnail: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    sortOrder: number;
    isActive: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  tags: string[];
  features: string[];
  materials: string[];
  dimensions: string | null;
  weight: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  rating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};

export default async function ProfilePage() {
  // Get current user from Clerk
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Load user data and favorites from database
  let userData: UserData;
  let favorites: FavoriteProduct[] = [];

  try {
    // Load favorites
    const favoritesResult = await getFavoriteProducts();
    if (favoritesResult.success) {
      favorites = favoritesResult.favorites || [];
    }

    // Load user data from database
    const userResult = await getCurrentUser();
    if (userResult.success && "user" in userResult && userResult.user) {
      const dbUser = userResult.user;

      // Merge Clerk data with database data
      userData = {
        firstName: clerkUser.firstName || dbUser.firstName || "",
        lastName: clerkUser.lastName || dbUser.lastName || "",
        email:
          clerkUser.emailAddresses?.[0]?.emailAddress || dbUser.email || "",
        imageUrl: clerkUser.imageUrl || dbUser.imageUrl || "",
        phone: dbUser.profile?.phone || "",
        dateOfBirth: dbUser.profile?.dateOfBirth
          ? new Date(dbUser.profile.dateOfBirth).toISOString().split("T")[0]
          : "",
        bio: dbUser.profile?.bio || "",
        address: dbUser.addresses?.[0]
          ? {
              street: dbUser.addresses[0].address1 || "",
              city: dbUser.addresses[0].city || "",
              state: dbUser.addresses[0].state || "",
              zipCode: dbUser.addresses[0].postalCode || "",
              country: dbUser.addresses[0].country || "",
            }
          : {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
        preferences: {
          newsletter: dbUser.profile?.newsletterSubscribed || false,
          marketing: dbUser.profile?.marketingEmails || false,
          sms: dbUser.profile?.smsNotifications || false,
        },
      };
    } else {
      // Fallback to Clerk data only
      userData = {
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
        imageUrl: clerkUser.imageUrl || "",
        phone: "",
        dateOfBirth: "",
        bio: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        preferences: {
          newsletter: false,
          marketing: false,
          sms: false,
        },
      };
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    // Fallback to Clerk data only
    userData = {
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
      imageUrl: clerkUser.imageUrl || "",
      phone: "",
      dateOfBirth: "",
      bio: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      preferences: {
        newsletter: false,
        marketing: false,
        sms: false,
      },
    };
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 lg:pt-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
              My Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <ProfileTabs userData={userData} favorites={favorites} />
        </div>
      </main>
    </div>
  );
}
