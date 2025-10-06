"use client";

import { useState, useEffect } from "react";
import { User, Edit, Save, X, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
import { getFavoriteProducts } from "@/lib/actions/favorite.action";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Load favorites from database
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const result = await getFavoriteProducts();
        if (result.success) {
          setFavorites(result.favorites || []);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Mock user data - in real app, this would come from authentication
  const [userData, setUserData] = useState({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    bio: "Leather goods enthusiast and fashion lover. Always looking for quality craftsmanship.",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    preferences: {
      newsletter: true,
      marketing: false,
      sms: true,
    },
  });

  const [editData, setEditData] = useState(userData);

  const handleEdit = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setEditData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setEditData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handlePreferenceChange = (preference: string, value: boolean) => {
    setEditData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value,
      },
    }));
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 lg:pt-20">
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
                        <Button onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
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
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {isEditing ? editData.firstName : userData.firstName}{" "}
                        {isEditing ? editData.lastName : userData.lastName}
                      </h3>
                      <p className="text-muted-foreground">
                        {isEditing ? editData.email : userData.email}
                      </p>
                    </div>
                  </div>

                  {/* Personal Information Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={
                          isEditing ? editData.firstName : userData.firstName
                        }
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
                        value={
                          isEditing ? editData.lastName : userData.lastName
                        }
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
                        value={isEditing ? editData.email : userData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={isEditing ? editData.phone : userData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={
                          isEditing
                            ? editData.dateOfBirth
                            : userData.dateOfBirth
                        }
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
                      value={isEditing ? editData.bio : userData.bio}
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
                          value={
                            isEditing
                              ? editData.address.street
                              : userData.address.street
                          }
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
                          value={
                            isEditing
                              ? editData.address.city
                              : userData.address.city
                          }
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
                          value={
                            isEditing
                              ? editData.address.state
                              : userData.address.state
                          }
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
                          value={
                            isEditing
                              ? editData.address.zipCode
                              : userData.address.zipCode
                          }
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
                          value={
                            isEditing
                              ? editData.address.country
                              : userData.address.country
                          }
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
                              src={product.image}
                              alt={product.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {product.price} LKR
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
                        <Label htmlFor="newsletter">
                          Newsletter Subscription
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new products and offers
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        id="newsletter"
                        checked={
                          isEditing
                            ? editData.preferences.newsletter
                            : userData.preferences.newsletter
                        }
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
                        checked={
                          isEditing
                            ? editData.preferences.marketing
                            : userData.preferences.marketing
                        }
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
                        checked={
                          isEditing
                            ? editData.preferences.sms
                            : userData.preferences.sms
                        }
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
      </main>
      <Footer />
    </div>
  );
}
