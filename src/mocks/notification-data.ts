import { v4 as uuidv4 } from 'uuid';

// Type for a notification
export type Notification = {
  id: string;
  profileId: string;
  type: 'message' | 'mention' | 'reply';
  title: string;
  content: string;
  isRead: boolean;
  sourceId?: string;
  sourceType?: string;
  channelId?: string;
  messageId?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Fixed UUIDs for common entities
export const MOCK_PROFILE_ID = "89dcaa92-be3f-4808-a1f6-88997c163200";
export const MOCK_CHANNEL_ID_1 = "729ef47b-8cb7-40f1-a505-6aaac9a2b1ce";
export const MOCK_CHANNEL_ID_2 = "d36f8023-8f33-4a3c-9f99-95eeee09e10d";

// Mock data for notifications
export const mockNotifications: Notification[] = [
  {
    id: uuidv4(),
    profileId: MOCK_PROFILE_ID,
    type: 'message',
    title: 'New message in #general',
    content: 'John Doe: Hey everyone, how are you doing?',
    isRead: false,
    sourceId: uuidv4(),
    sourceType: 'message',
    channelId: MOCK_CHANNEL_ID_1,
    messageId: uuidv4(),
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: uuidv4(),
    profileId: MOCK_PROFILE_ID,
    type: 'mention',
    title: 'You were mentioned in #design',
    content: 'Jane Smith: @User1 can you check the new design?',
    isRead: true,
    sourceId: uuidv4(),
    sourceType: 'message',
    channelId: MOCK_CHANNEL_ID_2,
    messageId: uuidv4(),
    createdAt: new Date(Date.now() - 7200000), // 2 hours ago
    updatedAt: new Date(Date.now() - 7200000),
  },
  {
    id: uuidv4(),
    profileId: MOCK_PROFILE_ID,
    type: 'reply',
    title: 'New reply to your message',
    content: 'Mike Johnson replied to your thread',
    isRead: false,
    sourceId: uuidv4(),
    sourceType: 'thread',
    channelId: MOCK_CHANNEL_ID_1,
    messageId: uuidv4(),
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000),
  },
]; 