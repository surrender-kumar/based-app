"use client";

import { useEffect, useState } from "react";
import { getChannels } from "@/lib/actions/channels";
import ChannelItem from "./channel-item";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateChannelModal from "./create-channel-modal";
import { useCurrentProfile } from "@/hooks/use-current-profile";

// Using a type that matches the database schema
type Channel = {
  id: string;
  name: string;
  description: string | null;
  createdById: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { profile } = useCurrentProfile();
  
  useEffect(() => {
    const fetchChannels = async () => {
      setIsLoading(true);
      try {
        const result = await getChannels();
        if (result.success && result.data) {
          setChannels(result.data);
        }
      } catch (error) {
        console.error("[FETCH_CHANNELS_ERROR]", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChannels();
  }, []);
  
  const handleCreateSuccess = (newChannel: Channel) => {
    setChannels((prev) => [newChannel, ...prev]);
    setIsModalOpen(false);
  };
  
  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Channels
        </h2>
        {profile && (
          <Button 
            onClick={() => setIsModalOpen(true)} 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="space-y-0.5">
        {isLoading ? (
          <div className="px-3 py-2">
            <p className="text-sm text-gray-500">Loading channels...</p>
          </div>
        ) : channels.length === 0 ? (
          <div className="px-3 py-2">
            <p className="text-sm text-gray-500">No channels available.</p>
          </div>
        ) : (
          channels.map((channel) => (
            <ChannelItem 
              key={channel.id} 
              channel={channel} 
            />
          ))
        )}
      </div>
      
      {profile && (
        <CreateChannelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreateSuccess={handleCreateSuccess}
          profileId={profile.id}
        />
      )}
    </div>
  );
} 