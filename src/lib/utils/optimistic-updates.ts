import { Message } from "../actions/messages";
import { DirectMessage } from "../actions/direct-messages";
import { v4 as uuidv4 } from 'uuid';
import { Profile } from "@/types";

// Extended types for optimistic updates
interface OptimisticMessage extends Message {
  isOptimistic?: boolean;
  isOptimisticallyEdited?: boolean;
}

interface OptimisticDirectMessage extends DirectMessage {
  isOptimistic?: boolean;
  isOptimisticallyEdited?: boolean;
}

/**
 * Create an optimistic message for immediate UI feedback before server response
 */
export function createOptimisticMessage({
  content,
  channelId,
  profile,
  files = []
}: {
  content: string;
  channelId: string;
  profile: Profile;
  files?: string[];
}): OptimisticMessage {
  // Create a temporary optimistic message with a unique ID
  return {
    id: `optimistic-${uuidv4()}`,
    content,
    channelId,
    profileId: profile.id,
    createdAt: new Date(),
    updatedAt: new Date(),
    hasThread: false,
    files: files.length > 0 ? files : undefined,
    isOptimistic: true // Flag to identify optimistic messages
  };
}

/**
 * Create an optimistic direct message
 */
export function createOptimisticDirectMessage({
  content,
  senderId,
  receiverId
}: {
  content: string;
  senderId: string;
  receiverId: string;
}): OptimisticDirectMessage {
  // Create a temporary optimistic DM with a unique ID
  return {
    id: `optimistic-${uuidv4()}`,
    content,
    senderId,
    receiverId,
    createdAt: new Date(),
    updatedAt: new Date(),
    isRead: true,
    isOptimistic: true // Flag to identify optimistic messages
  };
}

/**
 * Update a list of messages with the server response
 * Replaces optimistic messages with real ones from the server
 */
export function updateMessagesWithServerResponse(
  currentMessages: OptimisticMessage[],
  newMessage: Message
): OptimisticMessage[] {
  // If the new message is optimistic, just append it
  const optimisticNewMessage = newMessage as OptimisticMessage;
  if (optimisticNewMessage.isOptimistic) {
    return [...currentMessages, optimisticNewMessage];
  }
  
  // Find and replace optimistic messages, or append new ones
  const updatedMessages = currentMessages.filter(msg => {
    // Keep all messages that are not optimistic or have different content
    return !(
      msg.isOptimistic && 
      msg.content === newMessage.content && 
      msg.profileId === newMessage.profileId
    );
  });
  
  // Add the new message
  return [...updatedMessages, optimisticNewMessage];
}

/**
 * Update a list of direct messages with the server response
 */
export function updateDirectMessagesWithServerResponse(
  currentMessages: OptimisticDirectMessage[],
  newMessage: DirectMessage
): OptimisticDirectMessage[] {
  // Similar logic as for channel messages
  const optimisticNewMessage = newMessage as OptimisticDirectMessage;
  if (optimisticNewMessage.isOptimistic) {
    return [...currentMessages, optimisticNewMessage];
  }
  
  const updatedMessages = currentMessages.filter(msg => {
    return !(
      msg.isOptimistic && 
      msg.content === newMessage.content && 
      msg.senderId === newMessage.senderId && 
      msg.receiverId === newMessage.receiverId
    );
  });
  
  return [...updatedMessages, optimisticNewMessage];
}

/**
 * Handle optimistic message edits
 */
export function updateMessageOptimistically(
  messages: OptimisticMessage[],
  messageId: string,
  newContent: string
): OptimisticMessage[] {
  return messages.map(message => {
    if (message.id === messageId) {
      return {
        ...message,
        content: newContent,
        updatedAt: new Date(),
        isOptimisticallyEdited: true
      };
    }
    return message;
  });
}

/**
 * Handle optimistic message deletions
 */
export function deleteMessageOptimistically(
  messages: OptimisticMessage[],
  messageId: string
): OptimisticMessage[] {
  return messages.filter(message => message.id !== messageId);
} 