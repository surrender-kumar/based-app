"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ThreadContextType {
  isInThread: boolean;
  setIsInThread: (value: boolean) => void;
  parentMessageId: string | null;
  setParentMessageId: (id: string | null) => void;
  threadChannelId: string | null;
  setThreadChannelId: (id: string | null) => void;
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined);

export function ThreadProvider({ children }: { children: ReactNode }) {
  const [isInThread, setIsInThread] = useState(false);
  const [parentMessageId, setParentMessageId] = useState<string | null>(null);
  const [threadChannelId, setThreadChannelId] = useState<string | null>(null);

  return (
    <ThreadContext.Provider
      value={{
        isInThread,
        setIsInThread,
        parentMessageId,
        setParentMessageId,
        threadChannelId,
        setThreadChannelId
      }}
    >
      {children}
    </ThreadContext.Provider>
  );
}

export function useThreadContext() {
  const context = useContext(ThreadContext);
  
  if (!context) {
    throw new Error("useThreadContext must be used within a ThreadProvider");
  }
  
  return context;
} 