"use client";

import { useEffect, useState } from "react";
import { getChannels } from "../../lib/actions/channels";
import { Button } from "../ui/button";
import { Plus, Hash, Lock } from "lucide-react";
import { useCurrentProfile } from "../../hooks/use-current-profile";
import { cn } from "../../lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateChannelModal from "./create-channel-modal";
import { toast } from "sonner";

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

interface ChannelItemProps {
  channel: Channel;
  onSelect?: () => void;
}

// Inlined ChannelItem component
const ChannelItem = ({ channel, onSelect }: ChannelItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === `/channels/${channel.id}`;
  
  return (
    <Link
      href={`/channels/${channel.id}`}
      onClick={onSelect}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-accent/50",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      {channel.isPrivate ? (
        <Lock className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Hash className="h-4 w-4 text-muted-foreground" />
      )}
      <span className="truncate">{channel.name}</span>
    </Link>
  );
};

interface ChannelListProps {
  onSelect?: () => void;
}

export default function ChannelList({ onSelect }: ChannelListProps = {}) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { profile } = useCurrentProfile();

  useEffect(() => {
    const fetchChannels = async () => {
      if (!profile) return;
      
      setIsLoading(true);
      try {
        const result = await getChannels();
        console.log("Fetched channels:", result);
        if (result.success && result.data) {
          setChannels(result.data);
        } else {
          console.error("Failed to get channels:", result.error);
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
        toast.error("Failed to load channels");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, [profile]);

  const handleCreateSuccess = (newChannel: Channel) => {
    setIsCreateModalOpen(false);
    setChannels(prevChannels => [...prevChannels, newChannel]);
    toast.success(`Channel ${newChannel.name} created successfully`);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-sm font-semibold">Channels</h2>
        {profile && (
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="space-y-[2px]">
        {isLoading ? (
          <div className="text-xs text-muted-foreground px-2">Loading...</div>
        ) : channels.length === 0 ? (
          <div className="text-xs text-muted-foreground px-2">No channels found</div>
        ) : (
          channels.map(channel => (
            <ChannelItem key={channel.id} channel={channel} onSelect={onSelect} />
          ))
        )}
      </div>

      {/* Create Channel Modal */}
      {profile && (
        <CreateChannelModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateSuccess={handleCreateSuccess}
          profileId={profile.id}
        />
      )}
    </div>
  );
} 