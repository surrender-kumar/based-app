"use server";

import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";
import { mockMessages } from "../../mocks/message-data";

// Type for a channel message
export type Message = {
  id: string;
  content: string;
  channelId: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  hasThread?: boolean;
  files?: string[];
};

/**
 * Get all messages (for internal use)
 */
export async function getAllMessages() {
  return mockMessages;
}

/**
 * Get messages for a specific channel
 */
export async function getMessages(channelId: string) {
  try {
    // In a real app, we would query the database for messages
    const messages = mockMessages
      .filter(msg => msg.channelId === channelId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    return { success: true, data: messages };
  } catch (error) {
    console.error("[GET_MESSAGES_ERROR]", error);
    return { success: false, error: "Failed to fetch messages" };
  }
}

/**
 * Send a message to a channel
 */
export async function sendMessage({
  content,
  channelId,
  profileId,
  files = []
}: {
  content: string;
  channelId: string;
  profileId: string;
  files?: string[];
}) {
  try {
    // In a real app, we would insert into the database
    const newMessage: Message = {
      id: uuidv4(),
      content,
      channelId,
      profileId,
      createdAt: new Date(),
      updatedAt: new Date(),
      hasThread: false,
      files: files.length > 0 ? files : undefined
    };
    
    // Add to mock messages
    mockMessages.push(newMessage);
    
    // Revalidate path
    revalidatePath(`/channels/${channelId}`);
    
    return { success: true, data: newMessage };
  } catch (error) {
    console.error("[SEND_MESSAGE_ERROR]", error);
    return { success: false, error: "Failed to send message" };
  }
}

/**
 * Update a message's content
 */
export async function updateMessage({
  messageId,
  content,
  channelId
}: {
  messageId: string;
  content: string;
  channelId: string;
}) {
  try {
    // Find the message to update
    const messageIndex = mockMessages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      return { success: false, error: "Message not found" };
    }
    
    // Update the message
    mockMessages[messageIndex] = {
      ...mockMessages[messageIndex],
      content,
      updatedAt: new Date()
    };
    
    // Revalidate path
    revalidatePath(`/channels/${channelId}`);
    
    return { success: true, data: mockMessages[messageIndex] };
  } catch (error) {
    console.error("[UPDATE_MESSAGE_ERROR]", error);
    return { success: false, error: "Failed to update message" };
  }
}

/**
 * Delete a message
 */
export async function deleteMessage({
  messageId,
  channelId
}: {
  messageId: string;
  channelId: string;
}) {
  try {
    // Find the message to delete
    const messageIndex = mockMessages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      return { success: false, error: "Message not found" };
    }
    
    // Remove the message
    mockMessages.splice(messageIndex, 1);
    
    // Revalidate path
    revalidatePath(`/channels/${channelId}`);
    
    return { success: true };
  } catch (error) {
    console.error("[DELETE_MESSAGE_ERROR]", error);
    return { success: false, error: "Failed to delete message" };
  }
}

/**
 * Update a message's thread status
 */
export async function updateMessageThread(messageId: string, hasThread: boolean = true) {
  try {
    // Find the message to update
    const messageIndex = mockMessages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) {
      return { success: false, error: "Message not found" };
    }
    
    // Update the message's thread status
    mockMessages[messageIndex] = {
      ...mockMessages[messageIndex],
      hasThread,
      updatedAt: new Date()
    };
    
    // Get the channel ID to revalidate paths
    const channelId = mockMessages[messageIndex].channelId;
    
    // Revalidate paths
    revalidatePath(`/channels/${channelId}`);
    revalidatePath(`/channels/${channelId}/thread/${messageId}`);
    
    return { success: true, data: mockMessages[messageIndex] };
  } catch (error) {
    console.error("[UPDATE_MESSAGE_THREAD_ERROR]", error);
    return { success: false, error: "Failed to update message thread status" };
  }
} 