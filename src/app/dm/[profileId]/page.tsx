"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCurrentProfile } from "../../../hooks/use-current-profile";
import { DirectMessage, getDirectMessages, markMessagesAsRead } from "../../../lib/actions/direct-messages";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { toast } from "sonner";
import { formatRelative } from "date-fns";
import { Profile } from "../../../types";
import { getProfileById } from "../../../lib/api-client";
import { useOptimisticMessages } from "@/hooks/use-optimistic-messages";
import { Loader2 } from "lucide-react";

export default function DirectMessagePage() {
  const params = useParams();
  const profileId = params.profileId as string;
  const [otherProfile, setOtherProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useCurrentProfile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Get optimistic messages
  const { directMessages, setDirectMessages } = useOptimisticMessages();
  
  // Fetch partner profile
  useEffect(() => {
    const fetchPartnerProfile = async () => {
      try {
        const data = await getProfileById(profileId);
        
        if (data.profile) {
          setOtherProfile(data.profile);
        } else {
          toast.error("User not found");
          router.push("/");
        }
      } catch (error) {
        console.error("[FETCH_PARTNER_PROFILE_ERROR]", error);
        toast.error("Failed to load user");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPartnerProfile();
  }, [profileId, router]);
  
  // Get messages between users
  useEffect(() => {
    const fetchMessages = async () => {
      if (!profile) return;
      
      setIsLoading(true);
      try {
        const result = await getDirectMessages(profile.id, profileId);
        if (result.success && result.data) {
          const fetchedMessages = result.data;
          
          // Update both local state and optimistic messages context
          setMessages(fetchedMessages);
          setDirectMessages(profileId, fetchedMessages);
          
          // Mark messages as read
          await markMessagesAsRead(profile.id, profileId);
        }
      } catch (error) {
        console.error("[FETCH_MESSAGES_ERROR]", error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (profile) {
      fetchMessages();
    }
  }, [profile, profileId, setDirectMessages]);
  
  // Get the messages to display - from optimistic context if available, otherwise from local state
  const displayMessages = directMessages[profileId] || messages;
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  
  // Format message timestamp
  const formatMessageTime = (date: Date) => {
    return formatRelative(new Date(date), new Date());
  };
  
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">Please select a profile to continue</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      {otherProfile && (
        <div className="flex items-center p-4 border-b">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={otherProfile.imageUrl} alt={otherProfile.name} />
            <AvatarFallback>{getInitials(otherProfile.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-md font-semibold">{otherProfile.name}</h2>
            <p className="text-xs text-gray-500">{otherProfile.email}</p>
          </div>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-sm text-gray-500 ml-2">Loading messages...</p>
          </div>
        ) : displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-sm text-gray-500">No messages yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          displayMessages.map((message) => {
            const isOwnMessage = message.senderId === profile.id;
            
            return (
              <div 
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'} p-3 rounded-lg`}>
                  <div className="break-words">{message.content}</div>
                  <div className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {formatMessageTime(message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Note about the message input */}
      <div className="px-4 pb-2 text-xs text-muted-foreground">
        <p>The message input is provided by the MainContent layout component</p>
      </div>
    </div>
  );
} 