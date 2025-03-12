"use server";

import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";
import { mockPreferences, PreferencesType, defaultPreferences } from "@/mocks/preferences-data";

export type UpdatePreferencesData = Partial<Omit<PreferencesType, 'id' | 'profileId' | 'createdAt' | 'updatedAt'>>;

/**
 * Get user preferences
 */
export async function getPreferences(profileId: string) {
  try {
    // In a real app, we would query the database for preferences
    const preferences = mockPreferences.find(p => p.profileId === profileId);
    
    if (preferences) {
      return { success: true, data: preferences };
    }
    
    // Create default preferences if not found
    const newPreferences: PreferencesType = {
      id: uuidv4(),
      profileId,
      ...defaultPreferences,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockPreferences.push(newPreferences);
    
    return { success: true, data: newPreferences };
  } catch (error) {
    console.error("[GET_PREFERENCES_ERROR]", error);
    return { success: false, error: "Failed to fetch preferences" };
  }
}

/**
 * Update user preferences
 */
export async function updatePreferences(profileId: string, data: UpdatePreferencesData) {
  try {
    // In a real app, we would update the database
    const preferenceIndex = mockPreferences.findIndex(p => p.profileId === profileId);
    
    if (preferenceIndex !== -1) {
      // Update existing preferences
      mockPreferences[preferenceIndex] = {
        ...mockPreferences[preferenceIndex],
        ...data,
        updatedAt: new Date(),
      };
      
      revalidatePath("/settings");
      return { success: true, data: mockPreferences[preferenceIndex] };
    } else {
      // Create new preferences if not found
      const newPreferences: PreferencesType = {
        id: uuidv4(),
        profileId,
        ...defaultPreferences,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockPreferences.push(newPreferences);
      
      revalidatePath("/settings");
      return { success: true, data: newPreferences };
    }
  } catch (error) {
    console.error("[UPDATE_PREFERENCES_ERROR]", error);
    return { success: false, error: "Failed to update preferences" };
  }
}

/**
 * Toggle notification settings
 */
export async function toggleNotificationSetting(
  profileId: string, 
  setting: 'notificationsEnabled' | 'notifyOnMessage' | 'notifyOnMention' | 'notifyOnReply'
) {
  try {
    const preferencesResult = await getPreferences(profileId);
    
    if (!preferencesResult.success || !preferencesResult.data) {
      return { success: false, error: "Failed to fetch preferences" };
    }
    
    const preferences = preferencesResult.data;
    const newValue = !preferences[setting];
    
    return updatePreferences(profileId, { [setting]: newValue });
  } catch (error) {
    console.error("[TOGGLE_NOTIFICATION_SETTING_ERROR]", error);
    return { success: false, error: "Failed to toggle notification setting" };
  }
}

/**
 * Update theme
 */
export async function updateTheme(profileId: string, theme: 'light' | 'dark' | 'system') {
  try {
    return updatePreferences(profileId, { theme });
  } catch (error) {
    console.error("[UPDATE_THEME_ERROR]", error);
    return { success: false, error: "Failed to update theme" };
  }
}

/**
 * Toggle muted channel
 */
export async function toggleMutedChannel(profileId: string, channelId: string) {
  try {
    const preferencesResult = await getPreferences(profileId);
    
    if (!preferencesResult.success || !preferencesResult.data) {
      return { success: false, error: "Failed to fetch preferences" };
    }
    
    const preferences = preferencesResult.data;
    let mutedChannels = [...preferences.mutedChannels];
    
    if (mutedChannels.includes(channelId)) {
      // Remove from muted channels
      mutedChannels = mutedChannels.filter(id => id !== channelId);
    } else {
      // Add to muted channels
      mutedChannels.push(channelId);
    }
    
    return updatePreferences(profileId, { mutedChannels });
  } catch (error) {
    console.error("[TOGGLE_MUTED_CHANNEL_ERROR]", error);
    return { success: false, error: "Failed to toggle muted channel" };
  }
}

/**
 * Reset all preferences to default
 */
export async function resetPreferences(profileId: string) {
  try {
    return updatePreferences(profileId, defaultPreferences);
  } catch (error) {
    console.error("[RESET_PREFERENCES_ERROR]", error);
    return { success: false, error: "Failed to reset preferences" };
  }
} 