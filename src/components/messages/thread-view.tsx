"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "../../lib/actions/messages";
import { ThreadMessage, getThreadMessages } from "../../lib/actions/thread-messages";
import MessageItem from "./message-item";
import { Profile } from "../../types";
import { toast } from "sonner";
import { isSameDay, formatDistanceToNow, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatMessage } from "../../lib/formatters/message-formatter";
import { Loader2 } from "lucide-react";

interface ThreadViewProps {
  parentMessage: Message;
  parentAuthor: Profile | null;
  currentProfile: Profile | null;
  profiles: Profile[];
}

interface OptimisticThreadMessage extends ThreadMessage {
  isOptimistic?: boolean;
}

export default function ThreadView({
  parentMessage,
  parentAuthor,
  currentProfile,
  profiles
}: ThreadViewProps) {
  const [threadMessages, setThreadMessages] = useState<OptimisticThreadMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch thread messages
  useEffect(() => {
    const fetchThreadMessages = async () => {
      setIsLoading(true);
      try {
        const result = await getThreadMessages(parentMessage.id);
        if (result.success && result.data) {
          setThreadMessages(result.data);
        } else {
          toast.error(result.error || "Failed to load thread messages");
        }
      } catch (error) {
        console.error("[FETCH_THREAD_MESSAGES_ERROR]", error);
        toast.error("Failed to load thread messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreadMessages();
  }, [parentMessage.id]);

  // Listen for optimistic thread replies
  useEffect(() => {
    const handleNewThreadReply = (e: CustomEvent) => {
      const optimisticReply = e.detail as OptimisticThreadMessage;
      
      // Only add replies for this thread
      if (optimisticReply.messageId === parentMessage.id) {
        setThreadMessages(prev => [...prev, optimisticReply]);
      }
    };

    // Add the event listener with type assertion
    window.addEventListener('new-thread-reply', handleNewThreadReply as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('new-thread-reply', handleNewThreadReply as EventListener);
    };
  }, [parentMessage.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  // Find a profile by ID
  const findProfile = (profileId: string): Profile | null => {
    return profiles.find(p => p.id === profileId) || null;
  };

  // Format timestamp
  const formattedTimestamp = formatDistanceToNow(new Date(parentMessage.createdAt), {
    addSuffix: true,
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Should show date for this message?
  const shouldShowDate = (message: ThreadMessage, index: number): boolean => {
    if (index === 0) return true;
    const prevMessage = threadMessages[index - 1];
    return !isSameDay(new Date(message.createdAt), new Date(prevMessage.createdAt));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground mt-2">Loading thread messages...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Parent message */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-start gap-3">
          {parentAuthor && (
            <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
              <AvatarImage src={parentAuthor.imageUrl} alt={parentAuthor.name} />
              <AvatarFallback>{getInitials(parentAuthor.name)}</AvatarFallback>
            </Avatar>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {parentAuthor && (
                <p className="font-medium text-sm">
                  {parentAuthor.name}
                </p>
              )}
              <span className="text-xs text-muted-foreground">
                {formattedTimestamp}
              </span>
              
              {parentMessage.updatedAt > parentMessage.createdAt && (
                <span className="text-xs italic text-muted-foreground">
                  (edited)
                </span>
              )}
            </div>
            
            <div 
              className="prose prose-sm dark:prose-invert max-w-none break-words"
              dangerouslySetInnerHTML={{ __html: formatMessage(parentMessage.content) }}
            />
            
            <p className="text-xs text-muted-foreground mt-2">
              {threadMessages.length} {threadMessages.length === 1 ? 'reply' : 'replies'}
            </p>
          </div>
        </div>
      </div>

      {/* Thread replies */}
      <div className="flex-1 overflow-y-auto py-2">
        {threadMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-muted-foreground">No replies in this thread yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Be the first to reply!
            </p>
          </div>
        ) : (
          <>
            {threadMessages.map((message, index) => (
              <div 
                key={message.id} 
                className={`px-4 py-2 hover:bg-muted/50 ${message.isOptimistic ? 'opacity-70' : ''}`}
              >
                {shouldShowDate(message, index) && (
                  <div className="flex justify-center mb-4">
                    <div className="px-2 py-1 rounded-md text-xs text-muted-foreground bg-muted/50">
                      {format(new Date(message.createdAt), "MMMM d, yyyy")}
                    </div>
                  </div>
                )}
                
                <div className="flex items-start gap-3">
                  {findProfile(message.profileId) && (
                    <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
                      <AvatarImage 
                        src={findProfile(message.profileId)?.imageUrl} 
                        alt={findProfile(message.profileId)?.name || ''} 
                      />
                      <AvatarFallback>
                        {getInitials(findProfile(message.profileId)?.name || '')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {findProfile(message.profileId) && (
                        <p className="font-medium text-sm">
                          {findProfile(message.profileId)?.name}
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                      {message.isOptimistic && (
                        <span className="text-xs italic text-muted-foreground">
                          (sending...)
                        </span>
                      )}
                    </div>
                    
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none break-words"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
} 