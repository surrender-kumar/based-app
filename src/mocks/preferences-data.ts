import { v4 as uuidv4 } from 'uuid';
import { MOCK_PROFILE_ID } from './notification-data';

export type PreferencesType = {
  id: string;
  profileId: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  notifyOnMessage: boolean;
  notifyOnMention: boolean;
  notifyOnReply: boolean;
  mutedChannels: string[]; // Array of channel IDs
  compactView: boolean;
  fontSize: 'small' | 'medium' | 'large';
  timeFormat: '12h' | '24h';
  dateFormat: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
};

// Default preferences for all users
export const defaultPreferences: Omit<PreferencesType, 'id' | 'profileId' | 'createdAt' | 'updatedAt'> = {
  theme: 'system',
  notificationsEnabled: true,
  notifyOnMessage: true,
  notifyOnMention: true,
  notifyOnReply: true,
  mutedChannels: [],
  compactView: false,
  fontSize: 'medium',
  timeFormat: '12h',
  dateFormat: 'MM/DD/YYYY',
  timezone: 'UTC',
};

// Mock data for user preferences
export const mockPreferences: PreferencesType[] = [
  {
    id: uuidv4(),
    profileId: MOCK_PROFILE_ID,
    ...defaultPreferences,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]; 