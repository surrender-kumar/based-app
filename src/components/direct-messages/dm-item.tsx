"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Conversation } from "../../lib/actions/direct-messages";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface DmItemProps {
  conversation: Conversation;
}

export default function DmItem({ conversation }: DmItemProps) {
  const pathname = usePathname();
  const isActive = pathname === `/dm/${conversation.profileId}`;
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  
  // Format the timestamp
  const formatTimestamp = (date: Date | null) => {
    if (!date) return "";
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  return (
    <Link
      href={`/dm/${conversation.profileId}`}
      className={cn(
        "group px-3 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        isActive && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={conversation.imageUrl} alt={conversation.name} />
        <AvatarFallback>
          {getInitials(conversation.name)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between">
          <p className={cn(
            "font-medium text-sm truncate",
            isActive ? "text-primary dark:text-white" : "text-zinc-600 dark:text-zinc-300"
          )}>
            {conversation.name}
          </p>
          
          {conversation.lastMessageAt && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
              {formatTimestamp(conversation.lastMessageAt)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {conversation.lastMessage ? (
            <p className={cn(
              "text-xs truncate text-gray-500 dark:text-gray-400 max-w-[180px]",
              conversation.unreadCount > 0 && "font-medium text-gray-800 dark:text-gray-200"
            )}>
              {conversation.lastMessage}
            </p>
          ) : (
            <p className="text-xs text-gray-500 italic">
              No messages yet
            </p>
          )}
          
          {conversation.unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto h-5 w-5 flex-shrink-0 flex items-center justify-center rounded-full text-[10px] p-0">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
} 