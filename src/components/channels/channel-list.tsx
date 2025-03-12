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

// Inlined ChannelItem component
const ChannelItem = ({ channel }: { channel: Channel }) => {
  const pathname = usePathname();
  const isActive = pathname === `/channels/${channel.id}`;
  
  return (
    <Link
      href={`/channels/${channel.id}`}
      className={cn(
        "group px-3 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition",
        isActive && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <div className="flex items-center justify-center w-5 h-5">
        {channel.isPrivate ? (
          <Lock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        ) : (
          <Hash className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        )}
      </div>
      <p className={cn(
        "line-clamp-1 font-medium text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
        isActive && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
      )}>
        {channel.name}
      </p>
    </Link>
  );
};

export default function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState(false);
  
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
        toast.error("Failed to fetch channels");
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

  const handleCreateClick = () => {
    try {
      setIsModalOpen(true);
      setModalError(false);
    } catch (error) {
      console.error("[MODAL_ERROR]", error);
      setModalError(true);
      toast.error("Failed to open channel creation dialog");
    }
  };
  
  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Channels
        </h2>
        {profile && (
          <Button 
            onClick={handleCreateClick} 
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
      
      {profile && !modalError && (
        <CreateChannelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreateSuccess={handleCreateSuccess}
          profileId={profile.id}
        />
      )}
      
      {modalError && isModalOpen && (
        <div className="mt-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md">
          <p className="text-sm text-center text-gray-500">
            There was an issue opening the channel creation dialog.
            <br />
            <Button 
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Close
            </Button>
          </p>
        </div>
      )}
    </div>
  );
} 