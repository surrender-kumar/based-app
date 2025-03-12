"use client";

import { useEffect, useState } from "react";
import { getConversations, Conversation } from "../../lib/actions/direct-messages";
import { useCurrentProfile } from "../../hooks/use-current-profile";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import DmItem from "./dm-item";
import { useRouter } from "next/navigation";
import ProfileSearch from "../profiles/profile-search";

interface DmListProps {
  onSelect?: () => void;
}

export default function DmList({ onSelect }: DmListProps = {}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { profile } = useCurrentProfile();
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!profile) return;
      
      setIsLoading(true);
      try {
        const result = await getConversations(profile.id);
        if (result.success && result.data) {
          setConversations(result.data);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to load direct messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [profile]);

  const handleProfileSelect = (profileId: string) => {
    setIsSearchOpen(false);
    router.push(`/dm/${profileId}`);
    if (onSelect) onSelect();
  };

  // Handle conversation click to close the mobile menu
  const handleConversationClick = () => {
    if (onSelect) onSelect();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-sm font-semibold">Direct Messages</h2>
        <Button 
          onClick={() => setIsSearchOpen(true)}
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 rounded-full"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-[2px]">
        {isLoading ? (
          <div className="text-xs text-muted-foreground px-2">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="text-xs text-muted-foreground px-2">No conversations yet</div>
        ) : (
          conversations.map(conversation => (
            <DmItem 
              key={conversation.id} 
              conversation={conversation}
              onClick={handleConversationClick}
            />
          ))
        )}
      </div>
      
      <ProfileSearch 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleProfileSelect}
      />
    </div>
  );
} 