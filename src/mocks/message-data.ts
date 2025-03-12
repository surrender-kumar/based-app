import { Message } from "../lib/actions/messages";

// Mock messages for testing
export const mockMessages: Message[] = [
  {
    id: "1",
    content: "Welcome to the general channel!",
    channelId: "1", // General channel
    profileId: "1", // John Doe
    createdAt: new Date(Date.now() - 3600000 * 24 * 3), // 3 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3),
    hasThread: true
  },
  {
    id: "2",
    content: "Thanks! Excited to be here.",
    channelId: "1", // General channel
    profileId: "3", // Bob Johnson
    createdAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2),
    hasThread: false
  },
  {
    id: "3",
    content: "Hey everyone, what are we working on today?",
    channelId: "1", // General channel
    profileId: "2", // Jane Smith
    createdAt: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    updatedAt: new Date(Date.now() - 3600000 * 5),
    hasThread: false
  },
  {
    id: "4",
    content: "I'm updating the design system, anyone need help with components?",
    channelId: "2", // Random channel
    profileId: "1", // John Doe
    createdAt: new Date(Date.now() - 3600000 * 24 * 1), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1),
    hasThread: false
  },
  {
    id: "5",
    content: "Hi, I'm Bob, just joined the team!",
    channelId: "3", // Introductions channel
    profileId: "3", // Bob Johnson
    createdAt: new Date(Date.now() - 3600000 * 24 * 4), // 4 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 4),
    hasThread: true
  }
]; 