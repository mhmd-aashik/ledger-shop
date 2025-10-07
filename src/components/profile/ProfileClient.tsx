"use client";

import { useState } from "react";
import { User, Edit, Save, X, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateUserProfile } from "@/lib/actions/user.action";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

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

interface ProfileClientProps {
  initialUserData: UserData;
  favorites: FavoriteProduct[];
}

export default function ProfileClient({
  initialUserData,
  favorites,
}: ProfileClientProps) {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [editData, setEditData] = useState<UserData>(initialUserData);
  const [isSaving, setIsSaving] = useState(false);

  // Helper function to safely get current data
  const getCurrentData = () => {
    return isEditing ? editData : userData;
  };

  const handleEdit = () => {
    setEditData({ ...userData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!session?.user || !editData) return;

    try {
      setIsSaving(true);

      // Update user profile with all data
      const result = await updateUserProfile(session.user.id, {
        firstName: editData.firstName,
        lastName: editData.lastName,
        imageUrl: editData.imageUrl,
        phone: editData.phone,
        dateOfBirth: editData.dateOfBirth,
        bio: editData.bio,
        address: editData.address,
        preferences: editData.preferences,
      });

      if (result.success) {
        setUserData(editData);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        console.error("Failed to save user data:", result.error);
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("An error occurred while updating your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setEditData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
            [child]: value,
          },
        };
      });
    } else {
      setEditData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [field]: value,
        };
      });
    }
  };

  const handlePreferenceChange = (preference: string, value: boolean) => {
    setEditData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          [preference]: value,
        },
      };
    });
  };

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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
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
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
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
                    {getCurrentData()?.firstName || ""}{" "}
                    {getCurrentData()?.lastName || ""}
                  </h3>
                  <p className="text-muted-foreground">
                    {getCurrentData()?.email || ""}
                  </p>
                </div>
              </div>

              {/* Personal Information Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={getCurrentData()?.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={getCurrentData()?.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={getCurrentData()?.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={getCurrentData()?.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={getCurrentData()?.dateOfBirth || ""}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={getCurrentData()?.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Address */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={getCurrentData()?.address.street || ""}
                      onChange={(e) =>
                        handleInputChange("address.street", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={getCurrentData()?.address.city || ""}
                      onChange={(e) =>
                        handleInputChange("address.city", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={getCurrentData()?.address.state || ""}
                      onChange={(e) =>
                        handleInputChange("address.state", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={getCurrentData()?.address.zipCode || ""}
                      onChange={(e) =>
                        handleInputChange("address.zipCode", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={getCurrentData()?.address.country || ""}
                      onChange={(e) =>
                        handleInputChange("address.country", e.target.value)
                      }
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
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
                {favorites.length} items in your favorites
              </CardDescription>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No favorites yet</p>
                  <Link href="/products">
                    <Button className="mt-4">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.slice(0, 6).map((product) => (
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
              {favorites.length > 6 && (
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
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newsletter">Newsletter Subscription</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new products and offers
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={getCurrentData()?.preferences.newsletter || false}
                    onChange={(e) =>
                      handlePreferenceChange("newsletter", e.target.checked)
                    }
                    disabled={!isEditing}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails and special offers
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="marketing"
                    checked={getCurrentData()?.preferences.marketing || false}
                    onChange={(e) =>
                      handlePreferenceChange("marketing", e.target.checked)
                    }
                    disabled={!isEditing}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive order updates via SMS
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="sms"
                    checked={getCurrentData()?.preferences.sms || false}
                    onChange={(e) =>
                      handlePreferenceChange("sms", e.target.checked)
                    }
                    disabled={!isEditing}
                    className="rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
