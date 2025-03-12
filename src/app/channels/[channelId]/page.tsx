"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Mock message data
const mockMessages = {
  "1": [
    { id: "1", user: "John Doe", message: "Hello everyone!", timestamp: "10:30 AM" },
    { id: "2", user: "Jane Smith", message: "Hi John! How are you?", timestamp: "10:32 AM" },
    { id: "3", user: "Bob Johnson", message: "Good morning team.", timestamp: "10:35 AM" }
  ],
  "2": [
    { id: "1", user: "Jane Smith", message: "Anyone have the latest design files?", timestamp: "09:15 AM" },
    { id: "2", user: "Bob Johnson", message: "I'll share them shortly.", timestamp: "09:17 AM" }
  ],
  "3": [
    { id: "1", user: "John Doe", message: "I'm John, new to the team!", timestamp: "Yesterday" },
    { id: "2", user: "Jane Smith", message: "Welcome John! Glad to have you here.", timestamp: "Yesterday" },
    { id: "3", user: "Bob Johnson", message: "Welcome! Let me know if you need anything.", timestamp: "Yesterday" }
  ]
};

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.channelId as string;
  const messages = mockMessages[channelId as keyof typeof mockMessages] || [];

  return (
    <div className="flex flex-col h-full p-4">
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="font-medium">{message.user}</div>
                <div className="text-xs text-muted-foreground">{message.timestamp}</div>
              </div>
              <p className="text-sm">{message.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <p>No messages in this channel yet.</p>
        </div>
      )}
    </div>
  );
} 