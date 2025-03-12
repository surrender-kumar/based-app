"use client";

import { useEffect, useRef, useState } from "react";
import { Message, getMessages } from "../../lib/actions/messages";
import MessageItem from "./message-item";
import { Profile } from "../../types";
import { toast } from "sonner";
import { isSameDay } from "date-fns";
import { useInfiniteScroll } from "../../lib/utils/infinite-scroll";
import { Loader2 } from "lucide-react";
import { useOptimisticMessages } from "@/hooks/use-optimistic-messages";

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
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { channelMessages, setChannelMessages } = useOptimisticMessages();

  // Get optimistic messages for this channel (if any)
  const optimisticChannelMessages = channelMessages[channelId] || [];

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const result = await getMessages(channelId);
        if (result.success && result.data) {
          const fetchedMessages = result.data;
          // Update both local state and optimistic context
          setAllMessages(fetchedMessages);
          setChannelMessages(channelId, fetchedMessages);
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
  }, [channelId, setChannelMessages]);

  // Use optimistic messages from context if available, otherwise use local state
  const messagesForInfiniteScroll = optimisticChannelMessages.length > 0 
    ? optimisticChannelMessages 
    : allMessages;

  // Setup infinite scrolling
  const {
    visibleItems: messages,
    isLoading: isLoadingMore,
    scrollRef,
    handleScroll,
    hasReachedEnd
  } = useInfiniteScroll<Message>(messagesForInfiniteScroll, {
    direction: "bottom",
    initialBatchSize: 30,
    batchSize: 20,
    enabled: !isLoading
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0 && messagesForInfiniteScroll.length > 0 && 
        messages[messages.length - 1].id === messagesForInfiniteScroll[messagesForInfiniteScroll.length - 1].id) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesForInfiniteScroll]);

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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground mt-2">Loading messages...</p>
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
    <div 
      className="flex-1 overflow-y-auto py-4"
      ref={scrollRef as React.RefObject<HTMLDivElement>}
      onScroll={handleScroll}
    >
      {!hasReachedEnd && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
      
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