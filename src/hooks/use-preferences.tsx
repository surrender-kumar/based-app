"use client";

import { useState, useEffect, useCallback } from "react";
import { PreferencesType, defaultPreferences } from "@/mocks/preferences-data";
import { 
  getPreferences,
  updatePreferences,
  toggleNotificationSetting,
  updateTheme,
  toggleMutedChannel,
  resetPreferences,
  UpdatePreferencesData
} from "@/lib/actions/preferences";
import { useCurrentProfile } from "./use-current-profile";
import { toast } from "sonner";

export const usePreferences = () => {
  const { profile } = useCurrentProfile();
  const [preferences, setPreferences] = useState<PreferencesType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch preferences
  const fetchPreferences = useCallback(async () => {
    if (!profile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getPreferences(profile.id);
      
      if (result.success && result.data) {
        setPreferences(result.data);
      } else {
        setError(result.error || "Failed to fetch preferences");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Update preferences
  const updateUserPreferences = useCallback(async (data: UpdatePreferencesData) => {
    if (!profile) return { success: false, error: "No profile selected" };
    
    try {
      const result = await updatePreferences(profile.id, data);
      
      if (result.success && result.data) {
        setPreferences(result.data);
        toast.success("Preferences updated");
      } else {
        setError(result.error || "Failed to update preferences");
        toast.error(result.error || "Failed to update preferences");
      }
      
      return result;
    } catch (err) {
      const errorMessage = "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    }
  }, [profile]);

  // Toggle notification setting
  const toggleUserNotificationSetting = useCallback(async (
    setting: 'notificationsEnabled' | 'notifyOnMessage' | 'notifyOnMention' | 'notifyOnReply'
  ) => {
    if (!profile) return { success: false, error: "No profile selected" };
    
    try {
      const result = await toggleNotificationSetting(profile.id, setting);
      
      if (result.success && result.data) {
        setPreferences(result.data);
        toast.success(`${setting} setting toggled`);
      } else {
        setError(result.error || "Failed to toggle notification setting");
        toast.error(result.error || "Failed to toggle notification setting");
      }
      
      return result;
    } catch (err) {
      const errorMessage = "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    }
  }, [profile]);

  // Update theme
  const updateUserTheme = useCallback(async (theme: 'light' | 'dark' | 'system') => {
    if (!profile) return { success: false, error: "No profile selected" };
    
    try {
      const result = await updateTheme(profile.id, theme);
      
      if (result.success && result.data) {
        setPreferences(result.data);
        toast.success(`Theme updated to ${theme} mode`);
      } else {
        setError(result.error || "Failed to update theme");
        toast.error(result.error || "Failed to update theme");
      }
      
      return result;
    } catch (err) {
      const errorMessage = "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    }
  }, [profile]);

  // Toggle muted channel
  const toggleUserMutedChannel = useCallback(async (channelId: string) => {
    if (!profile) return { success: false, error: "No profile selected" };
    
    try {
      const result = await toggleMutedChannel(profile.id, channelId);
      
      if (result.success && result.data) {
        setPreferences(result.data);
        const action = result.data.mutedChannels.includes(channelId) ? "muted" : "unmuted";
        toast.success(`Channel ${action}`);
      } else {
        setError(result.error || "Failed to toggle muted channel");
        toast.error(result.error || "Failed to toggle muted channel");
      }
      
      return result;
    } catch (err) {
      const errorMessage = "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    }
  }, [profile]);

  // Reset preferences
  const resetUserPreferences = useCallback(async () => {
    if (!profile) return { success: false, error: "No profile selected" };
    
    try {
      const result = await resetPreferences(profile.id);
      
      if (result.success && result.data) {
        setPreferences(result.data);
        toast.success("Preferences reset to default");
      } else {
        setError(result.error || "Failed to reset preferences");
        toast.error(result.error || "Failed to reset preferences");
      }
      
      return result;
    } catch (err) {
      const errorMessage = "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    }
  }, [profile]);

  // Initial fetch
  useEffect(() => {
    if (profile) {
      fetchPreferences();
    }
  }, [profile, fetchPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences: updateUserPreferences,
    toggleNotificationSetting: toggleUserNotificationSetting,
    updateTheme: updateUserTheme,
    toggleMutedChannel: toggleUserMutedChannel,
    resetPreferences: resetUserPreferences,
    refreshPreferences: fetchPreferences,
  };
}; 