import { ThreadMessage } from "../lib/actions/thread-messages";

// Mock thread messages for testing
export const mockThreadMessages: ThreadMessage[] = [
  {
    id: "t1",
    content: "This is a thread reply to the welcome message",
    messageId: "1", // Reply to "Welcome to the general channel!"
    profileId: "2", // Jane Smith
    createdAt: new Date(Date.now() - 3600000 * 24 * 2.5), // 2.5 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2.5)
  },
  {
    id: "t2",
    content: "I think we should post announcements here",
    messageId: "1", // Reply to "Welcome to the general channel!"
    profileId: "3", // Bob Johnson
    createdAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2)
  },
  {
    id: "t3",
    content: "Thanks for introducing yourself!",
    messageId: "5", // Reply to "Hi, I'm Bob, just joined the team!"
    profileId: "1", // John Doe
    createdAt: new Date(Date.now() - 3600000 * 24 * 3.8), // 3.8 days ago
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3.8)
  }
]; 