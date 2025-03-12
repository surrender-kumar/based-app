import { text, timestamp, pgTable, uuid, boolean, json } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const preferences = pgTable("preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id").references(() => profiles.id).notNull().unique(),
  // Theme preferences
  theme: text("theme").default("system").notNull(), // "light", "dark", "system"
  // Notification preferences
  notificationsEnabled: boolean("notifications_enabled").default(true).notNull(),
  notifyOnMessage: boolean("notify_on_message").default(true).notNull(),
  notifyOnMention: boolean("notify_on_mention").default(true).notNull(),
  notifyOnReply: boolean("notify_on_reply").default(true).notNull(),
  mutedChannels: json("muted_channels").default([]).notNull(), // Array of channel IDs
  // Display preferences
  compactView: boolean("compact_view").default(false).notNull(),
  fontSize: text("font_size").default("medium").notNull(), // "small", "medium", "large"
  // Time preferences
  timeFormat: text("time_format").default("12h").notNull(), // "12h", "24h"
  dateFormat: text("date_format").default("MM/DD/YYYY").notNull(),
  timezone: text("timezone").default("UTC").notNull(),
  // Creation and update timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}); 