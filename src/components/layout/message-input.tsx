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
import { toast } from "@/components/ui/toast";

export const MessageInput = () => {
  const [message, setMessage] = useState("");
  const pathname = usePathname();
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, we would send the message to the API
    const conversationType = pathname.includes("/channels/") ? "channel" : "DM";
    const conversationId = pathname.split("/").pop() || "";
    
    toast.success(`Message sent to ${conversationType} ${conversationId}`);
    setMessage("");
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