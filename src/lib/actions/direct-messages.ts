"use server";

import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";

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
    id: "1",
    content: "Hey, how are you doing?",
    senderId: "1", // John Doe
    receiverId: "2", // Jane Smith
    createdAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2),
    isRead: true
  },
  {
    id: "2",
    content: "I'm good, thanks! How about you?",
    senderId: "2", // Jane Smith
    receiverId: "1", // John Doe
    createdAt: new Date(Date.now() - 3600000 * 24 * 1), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1),
    isRead: true
  },
  {
    id: "3",
    content: "Do you have the latest design files?",
    senderId: "1", // John Doe
    receiverId: "2", // Jane Smith
    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 2),
    isRead: false
  },
  {
    id: "4",
    content: "Hey Bob, welcome to the team!",
    senderId: "1", // John Doe
    receiverId: "3", // Bob Johnson
    createdAt: new Date(Date.now() - 3600000 * 24 * 3), // 3 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3),
    isRead: true
  },
  {
    id: "5",
    content: "Thanks John! Excited to be here.",
    senderId: "3", // Bob Johnson
    receiverId: "1", // John Doe
    createdAt: new Date(Date.now() - 3600000 * 24 * 3 + 1800000), // 3 days ago + 30 minutes
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3 + 1800000),
    isRead: true
  }
];

/**
 * Fetches all conversations for a user
 */
export async function getConversations(profileId: string) {
  try {
    // In a real app, we would query the database for all direct messages
    // involving the user and then group them by conversation partner
    
    // Get unique conversation partners for this user
    const conversationPartnerIds = Array.from(new Set(
      mockDirectMessages
        .filter(msg => msg.senderId === profileId || msg.receiverId === profileId)
        .map(msg => msg.senderId === profileId ? msg.receiverId : msg.senderId)
    ));
    
    // Fetch each conversation
    const conversations: Conversation[] = await Promise.all(
      conversationPartnerIds.map(async (partnerId) => {
        // In a real app, we would fetch user details from database
        // For now, simulate an API call to get profile details
        const partnerResponse = await fetch(`/api/profiles/${partnerId}`);
        const partnerData = await partnerResponse.json();
        const partner = partnerData.profile;
        
        if (!partner) {
          throw new Error(`Profile with ID ${partnerId} not found`);
        }
        
        // Get messages between the two users, ordered by createdAt
        const messages = mockDirectMessages
          .filter(msg => 
            (msg.senderId === profileId && msg.receiverId === partnerId) || 
            (msg.senderId === partnerId && msg.receiverId === profileId)
          )
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        // Calculate unread count
        const unreadCount = messages.filter(
          msg => msg.receiverId === profileId && !msg.isRead
        ).length;
        
        // Get last message
        const lastMessage = messages.length > 0 ? messages[0] : null;
        
        return {
          id: partnerId, // Use partner ID as conversation ID for simplicity
          profileId: partnerId,
          name: partner.name,
          email: partner.email,
          imageUrl: partner.imageUrl,
          lastMessage: lastMessage ? lastMessage.content : null,
          lastMessageAt: lastMessage ? lastMessage.createdAt : null,
          unreadCount
        };
      })
    );
    
    // Sort conversations by last message time
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