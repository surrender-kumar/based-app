"use server";

import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";
import { Message, getAllMessages, updateMessageThread } from "./messages";
import { mockThreadMessages } from "../../mocks/thread-message-data";

// Type for a thread message
export type ThreadMessage = {
  id: string;
  content: string;
  messageId: string;
  profileId: string;
  createdAt: Date;
  updatedAt: Date;
  files?: string[];
};

/**
 * Get thread messages for a parent message
 */
export async function getThreadMessages(messageId: string) {
  try {
    // In a real app, we would query the database for thread messages
    const messages = mockThreadMessages
      .filter(msg => msg.messageId === messageId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    return { success: true, data: messages };
  } catch (error) {
    console.error("[GET_THREAD_MESSAGES_ERROR]", error);
    return { success: false, error: "Failed to fetch thread messages" };
  }
}

/**
 * Get a parent message by ID
 */
export async function getParentMessage(messageId: string): Promise<{ success: boolean; data?: Message; error?: string }> {
  try {
    // Get all messages 
    const allMessages = await getAllMessages();
    
    const parentMessage = allMessages.find(msg => msg.id === messageId);
    
    if (!parentMessage) {
      return { success: false, error: "Parent message not found" };
    }
    
    return { success: true, data: parentMessage };
  } catch (error) {
    console.error("[GET_PARENT_MESSAGE_ERROR]", error);
    return { success: false, error: "Failed to fetch parent message" };
  }
}

/**
 * Send a reply in a thread
 */
export async function sendThreadMessage({
  content,
  messageId,
  profileId,
  files = []
}: {
  content: string;
  messageId: string;
  profileId: string;
  files?: string[];
}) {
  try {
    // In a real app, we would insert into the database
    const newThreadMessage: ThreadMessage = {
      id: uuidv4(),
      content,
      messageId,
      profileId,
      createdAt: new Date(),
      updatedAt: new Date(),
      files: files.length > 0 ? files : undefined
    };
    
    // Add to mock thread messages
    mockThreadMessages.push(newThreadMessage);
    
    // Update the parent message to indicate it has a thread
    await updateMessageThread(messageId);
    
    // Revalidate threads page
    revalidatePath(`/channels/[channelId]/thread/${messageId}`);
    
    return { success: true, data: newThreadMessage };
  } catch (error) {
    console.error("[SEND_THREAD_MESSAGE_ERROR]", error);
    return { success: false, error: "Failed to send thread message" };
  }
}

/**
 * Update a thread message's content
 */
export async function updateThreadMessage({
  threadMessageId,
  content,
  messageId
}: {
  threadMessageId: string;
  content: string;
  messageId: string;
}) {
  try {
    // Find the thread message to update
    const messageIndex = mockThreadMessages.findIndex(msg => msg.id === threadMessageId);
    
    if (messageIndex === -1) {
      return { success: false, error: "Thread message not found" };
    }
    
    // Update the thread message
    mockThreadMessages[messageIndex] = {
      ...mockThreadMessages[messageIndex],
      content,
      updatedAt: new Date()
    };
    
    // Revalidate path
    revalidatePath(`/channels/[channelId]/thread/${messageId}`);
    
    return { success: true, data: mockThreadMessages[messageIndex] };
  } catch (error) {
    console.error("[UPDATE_THREAD_MESSAGE_ERROR]", error);
    return { success: false, error: "Failed to update thread message" };
  }
}

/**
 * Delete a thread message
 */
export async function deleteThreadMessage({
  threadMessageId,
  messageId
}: {
  threadMessageId: string;
  messageId: string;
}) {
  try {
    // Find the thread message to delete
    const messageIndex = mockThreadMessages.findIndex(msg => msg.id === threadMessageId);
    
    if (messageIndex === -1) {
      return { success: false, error: "Thread message not found" };
    }
    
    // Remove the thread message
    mockThreadMessages.splice(messageIndex, 1);
    
    // Check if there are any remaining thread messages for this parent
    const hasRemainingThreads = mockThreadMessages.some(msg => msg.messageId === messageId);
    
    // If no threads remain, update the parent message
    if (!hasRemainingThreads) {
      await updateMessageThread(messageId, false);
    }
    
    // Revalidate path
    revalidatePath(`/channels/[channelId]/thread/${messageId}`);
    
    return { success: true };
  } catch (error) {
    console.error("[DELETE_THREAD_MESSAGE_ERROR]", error);
    return { success: false, error: "Failed to delete thread message" };
  }
} 