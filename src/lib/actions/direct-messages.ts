"use server";

import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";
import { mockProfiles } from "../../mocks/profiles";

// Type for a direct message
export type DirectMessage = {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
};

// Type for a conversation
export type Conversation = {
  id: string;
  profileId: string;
  name: string;
  email: string;
  imageUrl: string;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  unreadCount: number;
};

// Mock direct messages for testing
const mockDirectMessages: DirectMessage[] = [
  {
    id: "d1e2f3a4-b5c6-47d8-9e0f-1a2b3c4d5e6f",
    content: "Hey, how are you doing?",
    senderId: "c5d2e1a9-de17-4bd0-b061-7a8754639b3f", // John Doe
    receiverId: "a7b91e5c-e4fd-42f8-b68a-0d3a9b1c6f2d", // Jane Smith
    createdAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2),
    isRead: true
  },
  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    content: "I'm good, thanks! How about you?",
    senderId: "a7b91e5c-e4fd-42f8-b68a-0d3a9b1c6f2d", // Jane Smith
    receiverId: "c5d2e1a9-de17-4bd0-b061-7a8754639b3f", // John Doe
    createdAt: new Date(Date.now() - 3600000 * 24 * 1), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1),
    isRead: true
  },
  {
    id: "f1e2d3c4-b5a6-47d8-9e0f-1a2b3c4d5e6f",
    content: "Do you have the latest design files?",
    senderId: "c5d2e1a9-de17-4bd0-b061-7a8754639b3f", // John Doe
    receiverId: "a7b91e5c-e4fd-42f8-b68a-0d3a9b1c6f2d", // Jane Smith
    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 2),
    isRead: false
  },
  {
    id: "e1d2c3b4-a5f6-47d8-9e0f-1a2b3c4d5e6f",
    content: "Hey Bob, welcome to the team!",
    senderId: "c5d2e1a9-de17-4bd0-b061-7a8754639b3f", // John Doe
    receiverId: "f6d48c3a-7b29-4e5f-8c1d-9a2b3c4d5e6f", // Bob Johnson
    createdAt: new Date(Date.now() - 3600000 * 24 * 3), // 3 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3),
    isRead: true
  },
  {
    id: "d1c2b3a4-9e8f-47d8-9e0f-1a2b3c4d5e6f",
    content: "Thanks John! Excited to be here.",
    senderId: "f6d48c3a-7b29-4e5f-8c1d-9a2b3c4d5e6f", // Bob Johnson
    receiverId: "c5d2e1a9-de17-4bd0-b061-7a8754639b3f", // John Doe
    createdAt: new Date(Date.now() - 3600000 * 24 * 3 + 1800000), // 3 days ago + 30 minutes
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3 + 1800000),
    isRead: true
  }
];

/**
 * Gets conversations with other users
 */
export async function getConversations(profileId: string) {
  try {
    // Get all direct messages involving this user
    const messages = mockDirectMessages.filter(
      msg => msg.senderId === profileId || msg.receiverId === profileId
    );
    
    // Group messages by conversation partner
    const conversationsByPartner = new Map<string, DirectMessage[]>();
    
    messages.forEach(msg => {
      const partnerId = msg.senderId === profileId ? msg.receiverId : msg.senderId;
      
      if (!conversationsByPartner.has(partnerId)) {
        conversationsByPartner.set(partnerId, []);
      }
      
      conversationsByPartner.get(partnerId)!.push(msg);
    });
    
    // Create conversation summaries
    const conversations: Conversation[] = [];
    
    for (const [partnerId, msgs] of conversationsByPartner.entries()) {
      // Get partner profile info
      const partner = mockProfiles.find(p => p.id === partnerId);
      
      if (!partner) continue;
      
      // Sort messages by date (newest first for finding latest)
      msgs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      // Get latest message
      const latestMessage = msgs[0];
      
      // Count unread messages
      const unreadCount = msgs.filter(
        msg => msg.receiverId === profileId && !msg.isRead
      ).length;
      
      // Create conversation summary
      conversations.push({
        id: uuidv4(),
        profileId: partnerId,
        name: partner.name,
        email: partner.email,
        imageUrl: partner.imageUrl,
        lastMessage: latestMessage.content,
        lastMessageAt: latestMessage.createdAt,
        unreadCount
      });
    }
    
    // Sort by last message date
    conversations.sort((a, b) => {
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
    });
    
    return { success: true, data: conversations };
  } catch (error) {
    console.error("[GET_CONVERSATIONS_ERROR]", error);
    return { success: false, error: "Failed to fetch conversations" };
  }
}

/**
 * Gets direct messages between two users
 */
export async function getDirectMessages(profileId: string, otherProfileId: string) {
  try {
    // Get messages between the two users
    const messages = mockDirectMessages
      .filter(msg => 
        (msg.senderId === profileId && msg.receiverId === otherProfileId) || 
        (msg.senderId === otherProfileId && msg.receiverId === profileId)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    // Mark messages as read
    messages.forEach(msg => {
      if (msg.receiverId === profileId) {
        msg.isRead = true;
      }
    });
    
    return { success: true, data: messages };
  } catch (error) {
    console.error("[GET_DIRECT_MESSAGES_ERROR]", error);
    return { success: false, error: "Failed to fetch direct messages" };
  }
}

/**
 * Sends a direct message from one user to another
 */
export async function sendDirectMessage(senderId: string, receiverId: string, content: string) {
  try {
    // In a real app, we would insert this into the database
    const newMessage: DirectMessage = {
      id: uuidv4(),
      content,
      senderId,
      receiverId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isRead: false
    };
    
    // Add to mock messages
    mockDirectMessages.push(newMessage);
    
    // Revalidate both user pages
    revalidatePath(`/dm/${receiverId}`);
    revalidatePath(`/dm/${senderId}`);
    
    return { success: true, data: newMessage };
  } catch (error) {
    console.error("[SEND_DIRECT_MESSAGE_ERROR]", error);
    return { success: false, error: "Failed to send message" };
  }
}

/**
 * Marks all messages from a specific sender as read
 */
export async function markMessagesAsRead(readerId: string, senderId: string) {
  try {
    // Update all unread messages from this sender
    mockDirectMessages.forEach(msg => {
      if (msg.senderId === senderId && msg.receiverId === readerId && !msg.isRead) {
        msg.isRead = true;
        msg.updatedAt = new Date();
      }
    });
    
    // Revalidate paths
    revalidatePath(`/dm/${senderId}`);
    revalidatePath(`/dm/${readerId}`);
    
    return { success: true };
  } catch (error) {
    console.error("[MARK_MESSAGES_READ_ERROR]", error);
    return { success: false, error: "Failed to mark messages as read" };
  }
} 