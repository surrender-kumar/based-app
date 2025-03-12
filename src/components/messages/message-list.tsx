"use client";

import { useEffect, useRef, useState } from "react";
import { Message, getMessages } from "../../lib/actions/messages";
import MessageItem from "./message-item";
import { Profile } from "../../types";
import { toast } from "sonner";
import { isSameDay } from "date-fns";

interface MessageListProps {
  channelId: string;
  currentProfile: Profile | null;
  profiles: Profile[];
  onReplyClick?: (messageId: string) => void;
}

export default function MessageList({
  channelId,
  currentProfile,
  profiles,
  onReplyClick
}: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const result = await getMessages(channelId);
        if (result.success && result.data) {
          setMessages(result.data);
        } else {
          toast.error(result.error || "Failed to load messages");
        }
      } catch (error) {
        console.error("[FETCH_MESSAGES_ERROR]", error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [channelId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Find a profile by ID
  const findProfile = (profileId: string): Profile | null => {
    return profiles.find(p => p.id === profileId) || null;
  };

  // Should show date for this message?
  const shouldShowDate = (message: Message, index: number): boolean => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return !isSameDay(new Date(message.createdAt), new Date(prevMessage.createdAt));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-muted-foreground">No messages in this channel yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Be the first to send a message!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-4">
      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          message={message}
          profile={currentProfile}
          author={findProfile(message.profileId)}
          onReplyClick={onReplyClick}
          isLastMessage={index === messages.length - 1}
          showDate={shouldShowDate(message, index)}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
} 