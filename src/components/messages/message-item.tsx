"use client";

import { FC, useState, useRef } from "react";
import { formatDistanceToNow, format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Pencil, Trash2, Reply, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { formatMessage } from "../../lib/formatters/message-formatter";
import { Message, updateMessage, deleteMessage } from "../../lib/actions/messages";
import { Profile } from "../../types";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { cn } from "../../lib/utils";
import { EmojiReactions } from "./emoji-reactions";

interface MessageItemProps {
  message: Message;
  profile: Profile | null;
  author: Profile | null;
  onReplyClick?: (messageId: string) => void;
  isLastMessage?: boolean;
  showDate?: boolean;
}

// Mock reactions for demo purposes - in a real app these would come from the database
const mockReactions = new Map<string, Array<{
  emoji: string;
  count: number;
  userIds: string[];
}>>();

export default function MessageItem({
  message,
  profile,
  author,
  onReplyClick,
  isLastMessage = false,
  showDate = false,
}: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  // Get existing reactions or create new empty array
  const messageReactions = mockReactions.get(message.id) || [];

  const isOwnMessage = profile?.id === message.profileId;
  const canModify = isOwnMessage;
  
  // Format timestamp
  const formattedTimestamp = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  });
  
  const formattedDate = format(new Date(message.createdAt), "MMMM d, yyyy");
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  
  // Handle adding reaction
  const handleAddReaction = (messageId: string, emoji: string) => {
    const currentReactions = mockReactions.get(messageId) || [];
    const existingReaction = currentReactions.find(r => r.emoji === emoji);
    
    if (existingReaction) {
      // User already reacted with this emoji - skip if they're already in the list
      if (!existingReaction.userIds.includes(profile?.id || "")) {
        existingReaction.count++;
        existingReaction.userIds.push(profile?.id || "");
      }
    } else {
      // New reaction
      currentReactions.push({
        emoji,
        count: 1,
        userIds: [profile?.id || ""]
      });
    }
    
    // Update the map
    mockReactions.set(messageId, currentReactions);
    // Force re-render
    forceUpdate();
  };
  
  // Handle removing reaction
  const handleRemoveReaction = (messageId: string, emoji: string) => {
    const currentReactions = mockReactions.get(messageId) || [];
    const existingReaction = currentReactions.find(r => r.emoji === emoji);
    
    if (existingReaction) {
      // Remove user from the reaction
      existingReaction.userIds = existingReaction.userIds.filter(id => id !== profile?.id);
      existingReaction.count--;
      
      // If no users left, remove the reaction
      if (existingReaction.count <= 0) {
        mockReactions.set(
          messageId,
          currentReactions.filter(r => r.emoji !== emoji)
        );
      } else {
        mockReactions.set(messageId, currentReactions);
      }
      
      // Force re-render
      forceUpdate();
    }
  };
  
  // Force re-render for the mock implementation
  const [, updateState] = useState({});
  const forceUpdate = () => updateState({});
  
  // Handle message edit
  const handleEdit = async () => {
    if (editedContent.trim() === message.content.trim()) {
      setIsEditing(false);
      return;
    }
    
    try {
      const result = await updateMessage({
        messageId: message.id,
        content: editedContent.trim(),
        channelId: message.channelId,
      });
      
      if (result.success) {
        toast.success("Message updated");
      } else {
        toast.error(result.error || "Failed to update message");
        setEditedContent(message.content);
      }
    } catch (error) {
      console.error("[EDIT_MESSAGE_ERROR]", error);
      toast.error("Failed to update message");
      setEditedContent(message.content);
    } finally {
      setIsEditing(false);
    }
  };
  
  // Handle message delete
  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteMessage({
        messageId: message.id,
        channelId: message.channelId,
      });
      
      if (result.success) {
        toast.success("Message deleted");
      } else {
        toast.error(result.error || "Failed to delete message");
      }
    } catch (error) {
      console.error("[DELETE_MESSAGE_ERROR]", error);
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handle edit cancel
  const handleEditCancel = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };
  
  // Handle key press in edit mode
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleEditCancel();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    }
  };

  // Focus edit input when entering edit mode
  useState(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  });
  
  return (
    <div className={cn(
      "group relative flex gap-2 py-4 px-4 w-full transition-colors",
      !isEditing && "hover:bg-primary/5",
      isLastMessage && "pb-8"
    )}>
      {showDate && (
        <div className="flex justify-center mb-4">
          <div className="px-2 py-1 rounded-md text-xs text-muted-foreground bg-muted/50">
            {formattedDate}
          </div>
        </div>
      )}
      
      <div className="flex items-start gap-3">
        {author && (
          <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
            <AvatarImage src={author.imageUrl} alt={author.name} />
            <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {author && (
              <p className="font-medium text-sm">
                {author.name}
              </p>
            )}
            <span className="text-xs text-muted-foreground">
              {formattedTimestamp}
            </span>
            
            {message.updatedAt > message.createdAt && (
              <span className="text-xs italic text-muted-foreground">
                (edited)
              </span>
            )}
          </div>
          
          {isEditing ? (
            <div className="mt-1">
              <Textarea
                ref={editInputRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyPress}
                className="min-h-[80px] resize-none"
                placeholder="Edit your message..."
              />
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  onClick={handleEdit}
                  disabled={!editedContent.trim() || editedContent.trim() === message.content.trim()}
                >
                  Save
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleEditCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="prose prose-sm dark:prose-invert max-w-none break-words"
              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
            />
          )}
          
          {/* Emoji reactions */}
          <EmojiReactions
            reactions={messageReactions}
            messageId={message.id}
            currentUserId={profile?.id || null}
            onReactionAdd={handleAddReaction}
            onReactionRemove={handleRemoveReaction}
          />
          
          {message.hasThread && !isEditing && (
            <button 
              className="mt-1 text-xs text-primary hover:underline"
              onClick={() => onReplyClick?.(message.id)}
            >
              View thread
            </button>
          )}
        </div>
        
        {canModify && !isEditing && (
          <div className={cn("opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity", isDeleting && "opacity-100")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {onReplyClick && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onReplyClick(message.id)}
              >
                <Reply className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 