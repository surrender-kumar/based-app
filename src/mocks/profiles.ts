import { Profile } from "@/types";

// Mock profiles for testing
export const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2", 
    name: "Jane Smith",
    email: "jane@example.com",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 