import { mockProfiles } from "../mocks/profiles";
import { Profile } from "../types";

/**
 * Client-side API functions to avoid API route issues
 */

/**
 * Get all profiles
 */
export const getProfiles = async (): Promise<{ profiles: Profile[] }> => {
  // In development/testing, return mock data directly
  return { profiles: mockProfiles };
};

/**
 * Get a profile by ID
 */
export const getProfileById = async (profileId: string): Promise<{ profile: Profile | null }> => {
  // Find profile in mock data
  const profile = mockProfiles.find(p => p.id === profileId) || null;
  return { profile };
}; 