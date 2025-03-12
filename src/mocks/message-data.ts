import { Message } from "../lib/actions/messages";

// Mock messages for testing
export const mockMessages: Message[] = [
  {
    id: "b1c2d3e4-f5a6-47d8-9e0f-1a2b3c4d5e6f",
    content: "Welcome to the general channel!",
    channelId: "37f4f57d-ca27-40c1-aa25-2099e5ff3e53", // General channel
    profileId: "c5d2e1a9-de17-4bd0-b061-7a8754639b3f", // John Doe
    createdAt: new Date(Date.now() - 3600000 * 24 * 3), // 3 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3),
    hasThread: true
  },
  {
    id: "a2b3c4d5-e6f7-48d9-0e1f-2a3b4c5d6e7f",
    content: "Thanks! Excited to be here.",
    channelId: "37f4f57d-ca27-40c1-aa25-2099e5ff3e53", // General channel
    profileId: "f6d48c3a-7b29-4e5f-8c1d-9a2b3c4d5e6f", // Bob Johnson
    createdAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2),
    hasThread: false
  },
  {
    id: "c3d4e5f6-a7b8-49e0-1f2a-3b4c5d6e7f8a",
    content: "Hey everyone, what are we working on today?",
    channelId: "37f4f57d-ca27-40c1-aa25-2099e5ff3e53", // General channel
    profileId: "a7b91e5c-e4fd-42f8-b68a-0d3a9b1c6f2d", // Jane Smith
    createdAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 5),
    hasThread: false
  },
  {
    id: "d4e5f6a7-b8c9-40f1-2a3b-4c5d6e7f8a9b",
    content: "I'm updating the design system, anyone need help with components?",
    channelId: "9e8c51e6-3baa-4d1b-8f8e-3b6f9f92d3d7", // Random channel
    profileId: "c5d2e1a9-de17-4bd0-b061-7a8754639b3f", // John Doe
    createdAt: new Date(Date.now() - 3600000 * 24 * 1), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1),
    hasThread: false
  },
  {
    id: "e5f6a7b8-c9d0-41f2-3a4b-5c6d7e8f9a0b",
    content: "Hi, I'm Bob, just joined the team!",
    channelId: "8f5cf7b2-3d4a-4d3f-9c8e-5b1f9e2d6c7a", // Introductions channel
    profileId: "f6d48c3a-7b29-4e5f-8c1d-9a2b3c4d5e6f", // Bob Johnson
    createdAt: new Date(Date.now() - 3600000 * 24 * 4), // 4 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 4),
    hasThread: true
  }
]; 