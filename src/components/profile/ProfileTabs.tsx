"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "./ProfileTab";
import OrdersTab from "./OrdersTab";
import FavoritesTab from "./FavoritesTab";
import SettingsTab from "./SettingsTab";

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

interface ProfileTabsProps {
  userData: UserData;
  favorites: FavoriteProduct[];
}

export default function ProfileTabs({ userData, favorites }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <ProfileTab userData={userData} />
      <OrdersTab />
      <FavoritesTab favorites={favorites} />
      <SettingsTab userData={userData} />
    </Tabs>
  );
}
