"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Message } from '../lib/actions/messages';
import { DirectMessage } from '../lib/actions/direct-messages';
import { updateMessagesWithServerResponse, updateDirectMessagesWithServerResponse } from '../lib/utils/optimistic-updates';

// Define OptimisticFlag interface here instead of importing
interface OptimisticFlag {
  isOptimistic?: boolean;
  isOptimisticallyEdited?: boolean;
}

// Extend Message and DirectMessage types with optimistic flags
type OptimisticMessage = Message & OptimisticFlag;
type OptimisticDirectMessage = DirectMessage & OptimisticFlag;

interface OptimisticMessagesContextType {
  // Channel messages
  channelMessages: Record<string, OptimisticMessage[]>;
  setChannelMessages: (channelId: string, messages: OptimisticMessage[]) => void;
  addOptimisticMessage: (message: OptimisticMessage) => void;
  updateMessage: (messageId: string, updatedMessage: Message) => void;
  
  // Direct messages
  directMessages: Record<string, OptimisticDirectMessage[]>;
  setDirectMessages: (conversationId: string, messages: OptimisticDirectMessage[]) => void;
  addOptimisticDirectMessage: (message: OptimisticDirectMessage) => void;
  updateDirectMessage: (messageId: string, updatedMessage: DirectMessage) => void;
}

const OptimisticMessagesContext = createContext<OptimisticMessagesContextType | undefined>(undefined);

export function OptimisticMessagesProvider({ children }: { children: ReactNode }) {
  const [channelMessages, setAllChannelMessages] = useState<Record<string, OptimisticMessage[]>>({});
  const [directMessages, setAllDirectMessages] = useState<Record<string, OptimisticDirectMessage[]>>({});
  
  // Set messages for a specific channel
  const setChannelMessages = useCallback((channelId: string, messages: OptimisticMessage[]) => {
    setAllChannelMessages(prev => ({
      ...prev,
      [channelId]: messages
    }));
  }, []);
  
  // Add an optimistic message to a channel
  const addOptimisticMessage = useCallback((message: OptimisticMessage) => {
    setAllChannelMessages(prev => {
      const channelId = message.channelId;
      const existingMessages = prev[channelId] || [];
      
      return {
        ...prev,
        [channelId]: updateMessagesWithServerResponse(existingMessages, message)
      };
    });
  }, []);
  
  // Update a message with server response
  const updateMessage = useCallback((messageId: string, updatedMessage: Message) => {
    setAllChannelMessages(prev => {
      const channelId = updatedMessage.channelId;
      const existingMessages = prev[channelId] || [];
      
      // Replace the message with the updated one
      const updatedMessages = existingMessages.map(msg => 
        msg.id === messageId ? { ...updatedMessage } : msg
      );
      
      return {
        ...prev,
        [channelId]: updatedMessages
      };
    });
  }, []);
  
  // Set messages for a direct message conversation
  const setDirectMessages = useCallback((conversationId: string, messages: OptimisticDirectMessage[]) => {
    setAllDirectMessages(prev => ({
      ...prev,
      [conversationId]: messages
    }));
  }, []);
  
  // Add an optimistic direct message
  const addOptimisticDirectMessage = useCallback((message: OptimisticDirectMessage) => {
    setAllDirectMessages(prev => {
      // For DMs, we use the receiver ID as the conversation ID
      const conversationId = message.receiverId;
      const existingMessages = prev[conversationId] || [];
      
      return {
        ...prev,
        [conversationId]: updateDirectMessagesWithServerResponse(existingMessages, message)
      };
    });
  }, []);
  
  // Update a direct message with server response
  const updateDirectMessage = useCallback((messageId: string, updatedMessage: DirectMessage) => {
    setAllDirectMessages(prev => {
      const conversationId = updatedMessage.receiverId;
      const existingMessages = prev[conversationId] || [];
      
      // Replace the message with the updated one
      const updatedMessages = existingMessages.map(msg => 
        msg.id === messageId ? { ...updatedMessage } : msg
      );
      
      return {
        ...prev,
        [conversationId]: updatedMessages
      };
    });
  }, []);
  
  return (
    <OptimisticMessagesContext.Provider
      value={{
        channelMessages,
        setChannelMessages,
        addOptimisticMessage,
        updateMessage,
        directMessages,
        setDirectMessages,
        addOptimisticDirectMessage,
        updateDirectMessage
      }}
    >
      {children}
    </OptimisticMessagesContext.Provider>
  );
}

export function useOptimisticMessages() {
  const context = useContext(OptimisticMessagesContext);
  
  if (!context) {
    throw new Error('useOptimisticMessages must be used within an OptimisticMessagesProvider');
  }
  
  return context;
} 