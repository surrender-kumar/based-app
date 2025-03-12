"use client";

import { useState, useRef } from "react";
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

interface MessageItemProps {
  message: Message;
  profile: Profile | null;
  author: Profile | null;
  onReplyClick?: (messageId: string) => void;
  isLastMessage?: boolean;
  showDate?: boolean;
}

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
    <div className="group relative px-4 py-2 hover:bg-muted/50">
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