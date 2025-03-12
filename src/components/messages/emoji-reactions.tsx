"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "../ui/popover";
import { SmilePlus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

// Common emoji reactions
const commonEmojis = ["👍", "👎", "❤️", "😄", "😮", "👀", "🎉", "🙏"];

// Define our EmojiReaction type locally
interface EmojiReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

interface EmojiReactionsProps {
  reactions: EmojiReaction[];
  messageId: string;
  currentUserId: string | null;
  onReactionAdd: (messageId: string, emoji: string) => void;
  onReactionRemove: (messageId: string, emoji: string) => void;
}

export function EmojiReactions({
  reactions = [],
  messageId,
  currentUserId,
  onReactionAdd,
  onReactionRemove
}: EmojiReactionsProps) {
  const [showPopover, setShowPopover] = useState(false);

  // Handle emoji click
  const handleEmojiClick = (emoji: string) => {
    // Close the popover
    setShowPopover(false);
    
    // Check if the user already reacted with this emoji
    const existingReaction = reactions.find(r => r.emoji === emoji);
    const hasReacted = existingReaction?.userIds.includes(currentUserId || "");
    
    if (hasReacted) {
      // Remove reaction
      onReactionRemove(messageId, emoji);
    } else {
      // Add reaction
      onReactionAdd(messageId, emoji);
    }
  };

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {/* Display existing reactions */}
      {reactions.map((reaction) => {
        const hasReacted = reaction.userIds.includes(currentUserId || "");
        
        return (
          <TooltipProvider key={reaction.emoji}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleEmojiClick(reaction.emoji)}
                  className={cn(
                    "h-6 px-1.5 text-xs rounded-full border",
                    hasReacted ? "bg-primary/10 border-primary/20" : "hover:bg-muted border-border"
                  )}
                >
                  <span className="mr-1">{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {hasReacted ? "You and " : ""}
                  {reaction.userIds.length - (hasReacted ? 1 : 0)} other{reaction.userIds.length !== 1 ? "s" : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}

      {/* Add reaction button */}
      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="xs" 
            className="h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <SmilePlus className="h-3.5 w-3.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" side="top" align="start">
          <div className="flex flex-wrap gap-1.5 max-w-[200px]">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="text-lg hover:bg-muted p-1 rounded cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 