import { User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import Image from "next/image";
import ProfileEditForm from "./ProfileEditForm";
import SettingsForm from "./SettingsForm";

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

interface ProfileServerProps {
  userData: UserData;
  favorites: FavoriteProduct[];
}

export default function ProfileServer({
  userData,
  favorites,
}: ProfileServerProps) {
  const recentOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 299.0,
      items: ["Classic Leather Wallet"],
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "Processing",
      total: 149.5,
      items: ["Minimalist Cardholder"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
          My Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                {userData.imageUrl ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden">
                    <Image
                      src={userData.imageUrl}
                      alt={`${userData.firstName} ${userData.lastName}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>
              </div>

              {/* Profile Edit Form */}
              <ProfileEditForm userData={userData} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View your recent orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {order.date} • {order.items.join(", ")}
                    </p>
                    <p className="font-semibold">${order.total}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>My Favorites</CardTitle>
              <CardDescription>
                {favorites?.length || 0} items in your favorites
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(favorites?.length || 0) === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No favorites yet</p>
                  <Link href="/products">
                    <Button className="mt-4">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(favorites || []).slice(0, 6).map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={product.images[0] || "/placeholder-product.jpg"}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            LKR {product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {(favorites?.length || 0) > 6 && (
                <div className="text-center mt-4">
                  <Link href="/favorites">
                    <Button variant="outline">View All Favorites</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Manage your notification and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm userData={userData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
