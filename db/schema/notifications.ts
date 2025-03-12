import { text, timestamp, pgTable, uuid, boolean } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { messages } from "./messages";
import { channels } from "./channels";

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").references(() => profiles.id).notNull(),
  type: text("type").notNull(), // 'message', 'mention', 'reply', etc.
  title: text("title").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  sourceId: uuid("source_id"), // ID of message, thread, etc.
  sourceType: text("source_type"), // 'message', 'thread', etc.
  channelId: uuid("channel_id").references(() => channels.id),
  messageId: uuid("message_id").references(() => messages.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}); 