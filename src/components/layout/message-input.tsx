"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Bold,
  Italic,
  List,
  SmilePlus,
  Paperclip,
  Send
} from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { sendMessage } from "@/lib/actions/messages";
import { sendDirectMessage } from "@/lib/actions/direct-messages";
import { sendThreadMessage } from "@/lib/actions/thread-messages";
import { useCurrentProfile } from "@/hooks/use-current-profile";
import { createOptimisticMessage, createOptimisticDirectMessage } from "@/lib/utils/optimistic-updates";
import { useOptimisticMessages } from "@/hooks/use-optimistic-messages";
import { useThreadContext } from "@/hooks/use-thread-context";

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const pathname = usePathname();
  const { profile } = useCurrentProfile();
  const { addOptimisticMessage, addOptimisticDirectMessage } = useOptimisticMessages();
  const { isInThread, parentMessageId, threadChannelId } = useThreadContext();
  
  const handleSendMessage = async () => {
    if (!message.trim() || !profile || isSending) return;
    
    // If in thread view, send a thread message
    if (isInThread && parentMessageId && threadChannelId) {
      await handleSendThreadMessage();
      return;
    }
    
    // Otherwise, handle regular channel or DM messages
    // Determine if we're in a channel or DM and get the ID
    let conversationType = "unknown";
    let conversationId = "";
    
    // Check if we're in a channel
    if (pathname.includes("/channels/")) {
      conversationType = "channel";
      // Extract channel ID, handling both direct channel paths and thread paths
      const match = pathname.match(/\/channels\/([^\/]+)/);
      if (match) conversationId = match[1];
    } 
    // Check if we're in a DM
    else if (pathname.includes("/dm/")) {
      conversationType = "DM";
      // Extract profile ID from DM path
      const match = pathname.match(/\/dm\/([^\/]+)/);
      if (match) conversationId = match[1];
    }
    
    if (conversationType !== "unknown" && conversationId) {
      setIsSending(true);
      const messageContent = message.trim();
      setMessage("");  // Clear input right away for better UX
      
      try {
        if (conversationType === "channel") {
          // Create optimistic message for immediate UI feedback
          const optimisticMessage = createOptimisticMessage({
            content: messageContent,
            channelId: conversationId,
            profile
          });
          
          // Add optimistic message to UI
          addOptimisticMessage(optimisticMessage);
          
          // Send the actual message
          const result = await sendMessage({
            content: messageContent,
            channelId: conversationId,
            profileId: profile.id
          });
          
          if (!result.success) {
            toast.error(result.error || "Failed to send message");
          }
        } else if (conversationType === "DM") {
          // Create optimistic direct message
          const optimisticDM = createOptimisticDirectMessage({
            content: messageContent,
            senderId: profile.id,
            receiverId: conversationId
          });
          
          // Add optimistic DM to UI
          addOptimisticDirectMessage(optimisticDM);
          
          // Send the actual message
          const result = await sendDirectMessage(
            profile.id,
            conversationId,
            messageContent
          );
          
          if (!result.success) {
            toast.error(result.error || "Failed to send message");
          }
        }
      } catch (error) {
        console.error("[SEND_MESSAGE_ERROR]", error);
        toast.error("Failed to send message");
      } finally {
        setIsSending(false);
      }
    } else {
      toast.error("Could not determine where to send message");
    }
  };
  
  // Handle sending a thread message
  const handleSendThreadMessage = async () => {
    if (!parentMessageId || !profile || !threadChannelId) {
      return;
    }
    
    setIsSending(true);
    const messageContent = message.trim();
    setMessage("");  // Clear input right away for better UX
    
    try {
      // Create optimistic thread message for immediate UI feedback
      const optimisticThreadMessage = {
        id: `optimistic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: messageContent,
        messageId: parentMessageId,
        profileId: profile.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        isOptimistic: true
      };
      
      // Dispatch a custom event that ThreadView can listen for
      window.dispatchEvent(new CustomEvent('new-thread-reply', { 
        detail: optimisticThreadMessage 
      }));
      
      const result = await sendThreadMessage({
        content: messageContent,
        messageId: parentMessageId,
        profileId: profile.id
      });
      
      if (!result.success) {
        toast.error(result.error || "Failed to send reply");
      }
    } catch (error) {
      console.error("[SEND_THREAD_REPLY_ERROR]", error);
      toast.error("Failed to send reply");
    } finally {
      setIsSending(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Determine placeholder text based on context
  const placeholderText = isInThread ? "Reply in thread..." : "Type a message...";
  
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-background">
      {/* Thread indicator when in thread mode */}
      {isInThread && (
        <div className="px-3 pt-2 pb-0">
          <div className="flex items-center text-xs text-muted-foreground py-1 px-2 bg-muted/40 rounded-md">
            <span className="mr-1">↪</span> Replying in thread
          </div>
        </div>
      )}
      
      {/* Formatting toolbar */}
      <div className="flex items-center gap-1 px-3 pt-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          title="List"
        >
          <List className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          title="Add emoji"
        >
          <SmilePlus className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          title="Attach file"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Input area */}
      <div className="flex items-end px-3 pb-3">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          className="resize-none border-0 focus-visible:ring-0 p-0 min-h-[60px]"
          disabled={isSending}
        />
        <Button 
          onClick={handleSendMessage}
          size="icon"
          disabled={!message.trim() || isSending || !profile}
          className={`ml-2 h-8 w-8 ${(!message.trim() || isSending || !profile) ? 'opacity-50' : 'opacity-100'}`}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}; 