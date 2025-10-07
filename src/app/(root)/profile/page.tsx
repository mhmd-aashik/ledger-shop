import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileClient from "@/components/profile/ProfileClient";

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

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  try {
    // Get user data from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
      },
    });

    if (!user) {
      redirect("/sign-in");
    }

    // Get user's default address
    const defaultAddress = user.addresses[0];

    // Transform database data to component format
    const userData: UserData = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      imageUrl: user.imageUrl || "",
      phone: user.profile?.phone || "",
      dateOfBirth: user.profile?.dateOfBirth?.toISOString().split("T")[0] || "",
      bio: user.profile?.bio || "",
      address: {
        street: defaultAddress?.address1 || "",
        city: defaultAddress?.city || "",
        state: defaultAddress?.state || "",
        zipCode: defaultAddress?.postalCode || "",
        country: defaultAddress?.country || "",
      },
      preferences: {
        newsletter: user.profile?.newsletterSubscribed || false,
        marketing: user.profile?.marketingEmails || false,
        sms: user.profile?.smsNotifications || false,
      },
    };

    return (
      <div className="min-h-screen bg-background">
        <main className="pt-16 lg:pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProfileClient initialUserData={userData} favorites={[]} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading profile data:", error);
    redirect("/sign-in");
  }
}
