"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Search } from "lucide-react";
import { Profile } from "../../types";
import { toast } from "sonner";

interface ProfileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (profileId: string) => void;
  excludeProfileId?: string; // Optional: exclude a profile (e.g., current user)
}

export default function ProfileSearch({
  isOpen,
  onClose,
  onSelect,
  excludeProfileId
}: ProfileSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);

  // Fetch all profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/profiles");
        const data = await response.json();
        
        // Filter out the excluded profile if provided
        const fetchedProfiles = excludeProfileId
          ? data.profiles.filter((p: Profile) => p.id !== excludeProfileId)
          : data.profiles;
          
        setProfiles(fetchedProfiles);
        setFilteredProfiles(fetchedProfiles);
      } catch (error) {
        console.error("[FETCH_PROFILES_ERROR]", error);
        toast.error("Failed to load profiles");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchProfiles();
    }
  }, [isOpen, excludeProfileId]);

  // Filter profiles based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProfiles(profiles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = profiles.filter(
      (profile) =>
        profile.name.toLowerCase().includes(query) ||
        profile.email.toLowerCase().includes(query)
    );

    setFilteredProfiles(filtered);
  }, [searchQuery, profiles]);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find Someone to Message</DialogTitle>
        </DialogHeader>

        <div className="relative mt-2">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="mt-4 max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-gray-500">Loading profiles...</p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="flex items-center justify-center h-20">
              <p className="text-sm text-gray-500">
                {searchQuery ? "No matching profiles found" : "No profiles available"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => onSelect(profile.id)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={profile.imageUrl} alt={profile.name} />
                    <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{profile.name}</p>
                    <p className="text-xs text-gray-500">{profile.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 