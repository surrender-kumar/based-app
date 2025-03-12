"use client";

import { useParams } from "next/navigation";

// Mock direct message data
const mockDirectMessages = {
  "1": [
    { id: "1", isSender: false, message: "Hey there!", timestamp: "10:30 AM" },
    { id: "2", isSender: true, message: "Hi John! How's it going?", timestamp: "10:32 AM" },
    { id: "3", isSender: false, message: "Great! Working on the new project.", timestamp: "10:35 AM" },
    { id: "4", isSender: true, message: "Awesome! Let me know if you need any help.", timestamp: "10:37 AM" }
  ],
  "2": [
    { id: "1", isSender: false, message: "Do you have time for a quick call?", timestamp: "09:15 AM" },
    { id: "2", isSender: true, message: "Sure, I'm free in 30 minutes.", timestamp: "09:17 AM" },
    { id: "3", isSender: false, message: "Perfect, I'll send a calendar invite.", timestamp: "09:18 AM" }
  ]
};

export default function DirectMessagePage() {
  const params = useParams();
  const profileId = params.profileId as string;
  const messages = mockDirectMessages[profileId as keyof typeof mockDirectMessages] || [];

  return (
    <div className="flex flex-col h-full p-4">
      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex flex-col ${message.isSender ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  message.isSender 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.message}</p>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {message.timestamp}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <p>No messages yet. Start a conversation!</p>
        </div>
      )}
    </div>
  );
} 