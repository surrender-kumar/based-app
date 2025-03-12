export interface Profile {
  id: string;
  userId: string;
  name: string;
  imageUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OptimisticFlag {
  isOptimistic?: boolean;
  isOptimisticallyEdited?: boolean;
}

export interface EmojiReaction {
  emoji: string;
  count: number;
  userIds: string[];
} 