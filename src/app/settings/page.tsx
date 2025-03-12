"use client";

import { useState } from "react";
import { useCurrentProfile } from "@/hooks/use-current-profile";
import { usePreferences } from "@/hooks/use-preferences";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { AlertCircle, Bell, Palette, RotateCcw, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const { profile } = useCurrentProfile();
  const { loading, error, resetPreferences } = usePreferences();
  const [activeTab, setActiveTab] = useState("notifications");

  // Handle reset all settings
  const handleResetSettings = async () => {
    await resetPreferences();
  };

  // If no profile selected
  if (!profile) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No profile selected</AlertTitle>
          <AlertDescription>
            Please select a profile from the sidebar to view and manage your settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // If there's an error loading preferences
  if (error && !loading) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Preferences</CardTitle>
            <CardDescription>
              Configure your user preferences for notifications, appearance, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Appearance</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="notifications" className="space-y-4">
                <NotificationSettings />
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-4">
                <ThemeSettings />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={handleResetSettings}
            disabled={loading}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset All Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 