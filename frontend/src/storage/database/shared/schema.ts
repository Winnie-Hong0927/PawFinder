import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb, index, decimal, pgPolicy } from "drizzle-orm/pg-core";

// ==================== 用户表 ====================
export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  name: varchar("name", { length: 100 }),
  avatar_url: text("avatar_url"),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  id_card_number: varchar("id_card_number", { length: 20 }),
  id_card_front_url: text("id_card_front_url"),
  id_card_back_url: text("id_card_back_url"),
  address: text("address"),
  bio: text("bio"),
  adopter_status: varchar("adopter_status", { length: 20 }),
  verification_notes: text("verification_notes"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==================== 宠物表 ====================
export const pets = pgTable("pets", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  species: varchar("species", { length: 50 }).notNull(),
  breed: varchar("breed", { length: 100 }),
  age: varchar("age", { length: 50 }),
  gender: varchar("gender", { length: 20 }),
  size: varchar("size", { length: 20 }),
  images: jsonb("images").default(sql`'[]'`).notNull(),
  description: text("description"),
  traits: jsonb("traits").default(sql`'[]'`).notNull(),
  health_status: varchar("health_status", { length: 100 }),
  vaccination_status: boolean("vaccination_status").default(false),
  sterilization_status: boolean("sterilization_status").default(false),
  shelter_location: varchar("shelter_location", { length: 255 }),
  adoption_fee: decimal("adoption_fee", { precision: 10, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 }).default("available").notNull(),
  created_by: varchar("created_by", { length: 36 }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==================== 领养申请表 ====================
export const adoptionApplications = pgTable("adoption_applications", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  pet_id: varchar("pet_id", { length: 36 }).notNull(),
  user_id: varchar("user_id", { length: 36 }).notNull(),
  reason: text("reason"),
  living_condition: text("living_condition"),
  experience: text("experience"),
  has_other_pets: boolean("has_other_pets"),
  other_pets_detail: text("other_pets_detail"),
  documents: jsonb("documents").default(sql`'[]'`).notNull(),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  admin_notes: text("admin_notes"),
  reviewed_by: varchar("reviewed_by", { length: 36 }),
  reviewed_at: timestamp("reviewed_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==================== 领养记录表 ====================
export const adoptions = pgTable("adoptions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  pet_id: varchar("pet_id", { length: 36 }).notNull(),
  user_id: varchar("user_id", { length: 36 }).notNull(),
  application_id: varchar("application_id", { length: 36 }),
  adoption_date: timestamp("adoption_date", { withTimezone: true }).defaultNow(),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  termination_reason: text("termination_reason"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==================== 宠物视频表 ====================
export const petVideos = pgTable("pet_videos", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  adoption_id: varchar("adoption_id", { length: 36 }).notNull(),
  user_id: varchar("user_id", { length: 36 }).notNull(),
  video_url: text("video_url").notNull(),
  thumbnail_url: text("thumbnail_url"),
  description: text("description"),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  admin_notes: text("admin_notes"),
  reviewed_by: varchar("reviewed_by", { length: 36 }),
  reviewed_at: timestamp("reviewed_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==================== 视频提醒表 ====================
export const videoReminders = pgTable("video_reminders", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  adoption_id: varchar("adoption_id", { length: 36 }).notNull(),
  due_date: timestamp("due_date", { withTimezone: true }).notNull(),
  is_sent: boolean("is_sent").default(false),
  sent_at: timestamp("sent_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==================== 捐赠项目表 ====================
export const donationCampaigns = pgTable("donation_campaigns", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  target_amount: decimal("target_amount", { precision: 10, scale: 2 }),
  current_amount: decimal("current_amount", { precision: 10, scale: 2 }).default("0"),
  cover_image: text("cover_image"),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  start_date: timestamp("start_date", { withTimezone: true }),
  end_date: timestamp("end_date", { withTimezone: true }),
  created_by: varchar("created_by", { length: 36 }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==================== 捐赠记录表 ====================
export const donations = pgTable("donations", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  campaign_id: varchar("campaign_id", { length: 36 }),
  user_id: varchar("user_id", { length: 36 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  goods_detail: text("goods_detail"),
  goods_address: text("goods_address"),
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==================== 聊天记录表 ====================
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  session_id: varchar("session_id", { length: 100 }).notNull(),
  user_id: varchar("user_id", { length: 36 }),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==================== TypeScript Types ====================
export type User = typeof users.$inferSelect;
export type Pet = typeof pets.$inferSelect;
export type Application = typeof adoptionApplications.$inferSelect;
export type Adoption = typeof adoptions.$inferSelect;
export type Video = typeof petVideos.$inferSelect;
export type DonationCampaign = typeof donationCampaigns.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

// ==================== Input Types ====================
export interface InsertUser {
  email: string;
  phone?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  role?: string;
  id_card_number?: string | null;
  id_card_front_url?: string | null;
  id_card_back_url?: string | null;
  address?: string | null;
  bio?: string | null;
  adopter_status?: string | null;
  verification_notes?: string | null;
}

export interface InsertPet {
  name: string;
  species: string;
  breed?: string | null;
  age?: string | null;
  gender?: string | null;
  size?: string | null;
  images?: any;
  description?: string | null;
  traits?: any;
  health_status?: string | null;
  vaccination_status?: boolean;
  sterilization_status?: boolean;
  shelter_location?: string | null;
  adoption_fee?: string | number | null;
  status?: string;
  created_by?: string | null;
}

export interface InsertApplication {
  pet_id: string;
  user_id: string;
  reason?: string | null;
  living_condition?: string | null;
  experience?: string | null;
  has_other_pets?: boolean | null;
  other_pets_detail?: string | null;
  documents?: any;
  status?: string;
}

export interface InsertAdoption {
  pet_id: string;
  user_id: string;
  application_id?: string | null;
  status?: string;
}

export interface InsertVideo {
  adoption_id: string;
  user_id: string;
  video_url: string;
  thumbnail_url?: string | null;
  description?: string | null;
  status?: string;
}

export interface InsertDonationCampaign {
  title: string;
  description?: string | null;
  target_amount?: string | number | null;
  current_amount?: string | number | null;
  cover_image?: string | null;
  status?: string;
  start_date?: string | null;
  end_date?: string | null;
  created_by?: string | null;
}

export interface InsertDonation {
  campaign_id?: string | null;
  user_id: string;
  type: string;
  amount?: string | number | null;
  goods_detail?: string | null;
  goods_address?: string | null;
  status?: string;
}

export interface InsertChatMessage {
  session_id: string;
  user_id?: string | null;
  role: string;
  content: string;
  metadata?: any;
}
