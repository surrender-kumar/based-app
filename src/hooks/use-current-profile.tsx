"use client";

import { useContext } from "react";
import { Profile } from "@/types";
import { ProfileContext } from "@/components/providers/profile-provider";

export const useCurrentProfile = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useCurrentProfile must be used within a ProfileProvider");
  }

  return context;
};

export type ProfileContextType = {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  isLoading: boolean;
}; 