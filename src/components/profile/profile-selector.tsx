"use client";

import { useState, useEffect } from "react";
import { useCurrentProfile, ProfileContextType } from "@/hooks/use-current-profile";
import { Profile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";

export const ProfileSelector = () => {
  const { profile, setProfile, isLoading } = useCurrentProfile() as ProfileContextType;
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  // Fetch all available profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("/api/profiles");
        const data = await response.json();
        setProfiles(data.profiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        toast.error("Failed to load profiles");
      } finally {
        setLoadingProfiles(false);
      }
    };

    fetchProfiles();
  }, []);

  // Helper function to get initials from profile name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading || loadingProfiles) {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-col items-center outline-none bg-muted/50 hover:bg-muted px-5 py-3 rounded-xl transition-colors">
        <Avatar className="h-16 w-16 border mb-2">
          {profile?.imageUrl && (
            <AvatarImage src={profile.imageUrl} alt={profile.name} />
          )}
          <AvatarFallback className="text-lg">
            {profile?.name ? getInitials(profile.name) : "?"}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-sm text-center">
          {profile?.name || "Select Profile"}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        <DropdownMenuLabel className="text-center">Switch Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[240px] overflow-y-auto p-1">
          {profiles.map((p) => (
            <DropdownMenuItem
              key={p.id}
              className="cursor-pointer py-2 px-3 rounded-lg focus:bg-muted"
              onClick={() => {
                setProfile(p);
                toast.success(`Switched to ${p.name}`);
              }}
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-10 w-10">
                  {p.imageUrl && <AvatarImage src={p.imageUrl} alt={p.name} />}
                  <AvatarFallback className="text-sm">{getInitials(p.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm flex-1">{p.name}</span>
                {profile?.id === p.id && (
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 