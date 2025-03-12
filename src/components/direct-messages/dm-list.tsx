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

export default function DmList() {
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
        console.error("[FETCH_CONVERSATIONS_ERROR]", error);
        toast.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [profile]);

  const handleProfileSelect = (profileId: string) => {
    if (profileId === profile?.id) {
      toast.error("You can't message yourself");
      return;
    }

    router.push(`/dm/${profileId}`);
    setIsSearchOpen(false);
  };

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-3 mb-2">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Direct Messages
        </h2>
        <Button
          onClick={() => setIsSearchOpen(true)}
          variant="ghost"
          size="icon"
          className="h-6 w-6"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-0.5">
        {isLoading ? (
          <div className="px-3 py-2">
            <p className="text-sm text-gray-500">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-3 py-2">
            <p className="text-sm text-gray-500">No conversations yet.</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <DmItem key={conversation.id} conversation={conversation} />
          ))
        )}
      </div>

      {isSearchOpen && (
        <ProfileSearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelect={handleProfileSelect}
          excludeProfileId={profile?.id}
        />
      )}
    </div>
  );
} 