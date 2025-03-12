import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const threadMessages = pgTable("thread_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  messageId: uuid("message_id").notNull(),
  profileId: uuid("profile_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}); 