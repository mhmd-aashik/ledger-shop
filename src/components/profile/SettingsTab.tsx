"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Label } from "@/components/ui/label";
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

interface SettingsTabProps {
  userData: UserData;
}

export default function SettingsTab({
  userData: initialUserData,
}: SettingsTabProps) {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [editData, setEditData] = useState<UserData>(initialUserData);
  const [isEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Helper function to safely get current data
  const getCurrentData = () => {
    return isEditing ? editData : userData;
  };

  const handlePreferenceChange = async (preference: string, value: boolean) => {
    if (!user) return;

    const updatedPreferences = {
      ...getCurrentData()?.preferences,
      [preference]: value,
    };

    setEditData((prev) => ({
      ...prev,
      preferences: updatedPreferences,
    }));

    try {
      setIsSaving(true);

      const result = await updateUserProfile(user.id, {
        preferences: updatedPreferences,
      });

      if (result.success) {
        setUserData((prev) => ({
          ...prev,
          preferences: updatedPreferences,
        }));
        toast.success("Preferences updated successfully!");
      } else {
        console.error("Failed to save preferences:", result.error);
        toast.error("Failed to update preferences. Please try again.");
        // Revert the change
        setEditData((prev) => ({
          ...prev,
          preferences: getCurrentData()?.preferences || prev.preferences,
        }));
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("An error occurred while updating your preferences.");
      // Revert the change
      setEditData((prev) => ({
        ...prev,
        preferences: getCurrentData()?.preferences || prev.preferences,
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
                disabled={isSaving}
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
                disabled={isSaving}
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
                disabled={isSaving}
                className="rounded"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
