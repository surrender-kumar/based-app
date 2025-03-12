"use client";

import { createContext, useEffect, useState } from "react";
import { Profile } from "@/types";
import { ProfileContextType } from "@/hooks/use-current-profile";
import { getProfiles, getProfileById } from "../../lib/api-client";

export const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch and set profiles
  const fetchProfiles = async () => {
    try {
      const data = await getProfiles();

      // If we have profiles and no profile is selected yet, select the first one
      if (data.profiles.length > 0 && !profile) {
        setProfile(data.profiles[0]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setIsLoading(false);
    }
  };

  // Load profiles on mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  // Save selected profile to localStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem("currentProfileId", profile.id);
    }
  }, [profile]);

  // Try to load profile from localStorage on client
  useEffect(() => {
    const loadSavedProfile = async () => {
      const savedProfileId = localStorage.getItem("currentProfileId");
      
      if (savedProfileId) {
        try {
          const data = await getProfileById(savedProfileId);
          
          if (data.profile) {
            setProfile(data.profile);
          }
        } catch (error) {
          console.error("Error loading saved profile:", error);
        }
      }
      
      setIsLoading(false);
    };

    loadSavedProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}; 