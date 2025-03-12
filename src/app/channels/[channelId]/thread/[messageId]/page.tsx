"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { useCurrentProfile } from "../../../../../hooks/use-current-profile";
import { getParentMessage } from "../../../../../lib/actions/thread-messages";
import ThreadView from "../../../../../components/messages/thread-view";
import { Profile } from "../../../../../types";
import { toast } from "sonner";
import { getProfiles } from "../../../../../lib/api-client";
import { useThreadContext } from "@/hooks/use-thread-context";

export default function ThreadPage() {
  const router = useRouter();
  const params = useParams();
  const channelId = params.channelId as string;
  const messageId = params.messageId as string;
  const { profile } = useCurrentProfile();
  const { setIsInThread, setParentMessageId, setThreadChannelId } = useThreadContext();
  
  const [parentMessage, setParentMessage] = useState<any>(null);
  const [parentAuthor, setParentAuthor] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  
  // Set thread context when component mounts
  useEffect(() => {
    setIsInThread(true);
    setParentMessageId(messageId);
    setThreadChannelId(channelId);
    
    // Clean up when component unmounts
    return () => {
      setIsInThread(false);
      setParentMessageId(null);
      setThreadChannelId(null);
    };
  }, [setIsInThread, setParentMessageId, setThreadChannelId, messageId, channelId]);
  
  // Handle close
  const handleClose = () => {
    router.push(`/channels/${channelId}`);
  };
  
  // Fetch parent message
  useEffect(() => {
    const fetchParentMessage = async () => {
      setIsLoading(true);
      try {
        const result = await getParentMessage(messageId);
        if (result.success && result.data) {
          setParentMessage(result.data);
        } else {
          toast.error("Thread not found");
          router.push(`/channels/${channelId}`);
        }
      } catch (error) {
        console.error("[FETCH_PARENT_MESSAGE_ERROR]", error);
        toast.error("Failed to load thread");
        router.push(`/channels/${channelId}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchParentMessage();
  }, [messageId, channelId, router]);
  
  // Fetch profiles for message authors
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getProfiles();
        setProfiles(data.profiles);
        
        // Set parent author if we have the parent message
        if (parentMessage && data.profiles) {
          const author = data.profiles.find((p: Profile) => p.id === parentMessage.profileId);
          setParentAuthor(author || null);
        }
      } catch (error) {
        console.error("[FETCH_PROFILES_ERROR]", error);
        toast.error("Failed to load profiles");
      }
    };
    
    fetchProfiles();
  }, [parentMessage]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading thread...</p>
      </div>
    );
  }
  
  if (!parentMessage) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Thread not found</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 md:hidden"
            onClick={handleClose}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Thread</h1>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Thread View */}
      <div className="flex-1 overflow-hidden">
        <ThreadView
          parentMessage={parentMessage}
          parentAuthor={parentAuthor}
          currentProfile={profile}
          profiles={profiles}
        />
      </div>
      
      {/* Note: The MessageInput component from the layout is now used for replying */}
    </div>
  );
} 