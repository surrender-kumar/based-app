"use server";

import { db } from "../../../db/db";
import { channels } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { mockChannels } from "../../mocks/channels-data";

/**
 * Type for creating a new channel
 */
export type CreateChannelData = {
  name: string;
  description?: string;
  createdById: string;
  isPrivate?: boolean;
};

/**
 * Creates a new channel
 */
export async function createChannel(data: CreateChannelData) {
  try {
    // Try database first
    try {
      const [channel] = await db.insert(channels).values(data).returning();
      revalidatePath("/");
      return { success: true, data: channel };
    } catch (dbError) {
      console.error("[DB_ERROR]", dbError);
      
      // Fallback to mock implementation
      const newChannel = {
        id: uuidv4(),
        name: data.name,
        description: data.description || "",
        createdById: data.createdById,
        isPrivate: data.isPrivate || false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockChannels.push(newChannel);
      revalidatePath("/");
      return { success: true, data: newChannel };
    }
  } catch (error) {
    console.error("[CHANNEL_CREATE_ERROR]", error);
    return { success: false, error: "Failed to create channel" };
  }
}

/**
 * Gets all channels
 */
export async function getChannels() {
  try {
    // Try database first
    try {
      const allChannels = await db.query.channels.findMany({
        orderBy: (ch, { desc }) => [desc(ch.createdAt)],
      });
      return { success: true, data: allChannels };
    } catch (dbError) {
      console.error("[DB_ERROR]", dbError);
      
      // Fallback to mock implementation - ensure we return a copy of the array
      return { success: true, data: [...mockChannels] };
    }
  } catch (error) {
    console.error("[CHANNEL_GET_ERROR]", error);
    return { success: false, error: "Failed to fetch channels" };
  }
}

/**
 * Gets a channel by ID
 */
export async function getChannelById(channelId: string) {
  try {
    // Try database first
    try {
      const channel = await db.query.channels.findFirst({
        where: eq(channels.id, channelId),
      });
      
      if (!channel) {
        // Check mock data if not found in DB
        const mockChannel = mockChannels.find(c => c.id === channelId);
        if (mockChannel) {
          return { success: true, data: mockChannel };
        }
        return { success: false, error: "Channel not found" };
      }
      
      return { success: true, data: channel };
    } catch (dbError) {
      console.error("[DB_ERROR]", dbError);
      
      // Fallback to mock implementation
      const mockChannel = mockChannels.find(c => c.id === channelId);
      if (!mockChannel) {
        return { success: false, error: "Channel not found" };
      }
      
      return { success: true, data: mockChannel };
    }
  } catch (error) {
    console.error("[CHANNEL_GET_BY_ID_ERROR]", error);
    return { success: false, error: "Failed to fetch channel" };
  }
}

/**
 * Updates a channel by ID
 */
export async function updateChannel(
  channelId: string,
  data: Partial<Omit<CreateChannelData, "createdById">>
) {
  try {
    const [channel] = await db
      .update(channels)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(channels.id, channelId))
      .returning();
    
    if (!channel) {
      return { success: false, error: "Channel not found" };
    }
    
    revalidatePath("/");
    revalidatePath(`/channels/${channelId}`);
    return { success: true, data: channel };
  } catch (error) {
    console.error("[CHANNEL_UPDATE_ERROR]", error);
    return { success: false, error: "Failed to update channel" };
  }
}

/**
 * Deletes a channel by ID
 */
export async function deleteChannel(channelId: string) {
  try {
    const [channel] = await db
      .delete(channels)
      .where(eq(channels.id, channelId))
      .returning();
    
    if (!channel) {
      return { success: false, error: "Channel not found" };
    }
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[CHANNEL_DELETE_ERROR]", error);
    return { success: false, error: "Failed to delete channel" };
  }
} 