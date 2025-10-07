"use client";

import { useState } from "react";
import { User, Edit, Save, X, LogOut, AlertTriangle } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
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
import { TabsContent } from "@/components/ui/tabs";
import { updateUserProfile } from "@/lib/actions/user.action";
import { toast } from "sonner";
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

interface ProfileTabProps {
  userData: UserData;
}

export default function ProfileTab({
  userData: initialUserData,
}: ProfileTabProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [editData, setEditData] = useState<UserData>(initialUserData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Helper function to safely get current data
  const getCurrentData = () => {
    return isEditing ? editData : userData;
  };

  const handleEdit = () => {
    setEditData({ ...userData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user || !editData) return;

    try {
      setIsSaving(true);

      // Update user profile with all data
      const result = await updateUserProfile(user.id, {
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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
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

  return (
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
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!isEditing}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={getCurrentData()?.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
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

      {/* Logout Section */}
      <Card className="border-red-200 mt-4">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Account Actions</span>
          </CardTitle>
          <CardDescription>Manage your account and session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Sign Out</h3>
              <p className="text-sm text-muted-foreground">
                Sign out of your account on this device
              </p>
            </div>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
