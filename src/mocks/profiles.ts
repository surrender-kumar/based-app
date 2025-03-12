import { Profile } from "@/types";

// Mock profiles for testing
export const mockProfiles: Profile[] = [
  {
    id: "c5d2e1a9-de17-4bd0-b061-7a8754639b3f",
    name: "John Doe",
    email: "john@example.com",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "a7b91e5c-e4fd-42f8-b68a-0d3a9b1c6f2d", 
    name: "Jane Smith",
    email: "jane@example.com",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "f6d48c3a-7b29-4e5f-8c1d-9a2b3c4d5e6f",
    name: "Bob Johnson",
    email: "bob@example.com",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 