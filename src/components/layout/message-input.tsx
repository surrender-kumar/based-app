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

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const pathname = usePathname();
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
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
    
    // In a real app, we would send the message to the API
    if (conversationType !== "unknown" && conversationId) {
      toast.success(`Message sent to ${conversationType} ${conversationId}`);
      setMessage("");
    } else {
      toast.error("Could not determine where to send message");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-background">
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
          placeholder="Type a message..."
          className="resize-none border-0 focus-visible:ring-0 p-0 min-h-[60px]"
        />
        <Button 
          onClick={handleSendMessage}
          size="icon"
          disabled={!message.trim()}
          className={`ml-2 h-8 w-8 ${!message.trim() ? 'opacity-50' : 'opacity-100'}`}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}; 