import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const consultantsTable = pgTable("consultants", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  name: text("name").notNull(),
  speciality: text("speciality").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar"),
  zodiacSign: text("zodiac_sign"),
  rating: real("rating"),
  reviewCount: integer("review_count").notNull().default(0),
  pricePerSession: integer("price_per_session"), // in cents
  experience: text("experience"),
  tags: text("tags").array().notNull().default([]),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertConsultantSchema = createInsertSchema(consultantsTable).omit({ id: true, createdAt: true, updatedAt: true, reviewCount: true, rating: true, status: true });
export type InsertConsultant = z.infer<typeof insertConsultantSchema>;
export type Consultant = typeof consultantsTable.$inferSelect;
