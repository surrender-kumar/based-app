"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { getChannelById } from "../../../lib/actions/channels";
import { useCurrentProfile } from "../../../hooks/use-current-profile";
import MessageList from "../../../components/messages/message-list";
import MessageEditor from "../../../components/messages/message-editor";
import { Profile } from "../../../types";
import { toast } from "sonner";
import { getProfiles } from "../../../lib/api-client";

export default function ChannelPage() {
  const params = useParams();
  const router = useRouter();
  const channelId = params.channelId as string;
  const { profile } = useCurrentProfile();
  const [channel, setChannel] = useState<{ name: string; description: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  
  // Fetch channel details
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const result = await getChannelById(channelId);
        if (!result.success || !result.data) {
          toast.error("Channel not found");
          return;
        }
        
        setChannel(result.data);
      } catch (error) {
        console.error("[FETCH_CHANNEL_ERROR]", error);
        toast.error("Failed to load channel");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChannel();
  }, [channelId]);
  
  // Fetch profiles for message authors
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getProfiles();
        setProfiles(data.profiles);
      } catch (error) {
        console.error("[FETCH_PROFILES_ERROR]", error);
        toast.error("Failed to load profiles");
      }
    };
    
    fetchProfiles();
  }, []);
  
  // Handle reply click
  const handleReplyClick = (messageId: string) => {
    router.push(`/channels/${channelId}/thread/${messageId}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading channel...</p>
      </div>
    );
  }
  
  if (!channel) {
    return notFound();
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h1 className="text-xl font-semibold">#{channel.name}</h1>
        {channel.description && (
          <p className="text-sm text-muted-foreground mt-1">{channel.description}</p>
        )}
      </div>
      
      {/* Message List */}
      <MessageList
        channelId={channelId}
        currentProfile={profile}
        profiles={profiles}
        onReplyClick={handleReplyClick}
      />
      
      {/* Message Editor */}
      <div className="p-4 mt-auto">
        <MessageEditor
          channelId={channelId}
          profile={profile}
          placeholder={`Message #${channel.name}`}
        />
      </div>
    </div>
  );
} 