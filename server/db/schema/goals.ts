import {
  pgTable,
  serial,
  varchar,
  decimal,
  timestamp,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { savings } from "./savings";
import { relations } from "drizzle-orm";

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  targetDate: timestamp("target_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  status: varchar("status", {
    enum: ["in progress", "completed"],
  }),
});

export const goalsRelations = relations(goals, ({ one }) => ({
  savings: one(savings, {
    fields: [goals.id],
    references: [savings.goalId],
  }),
}));

export const insertGoalSchema = createInsertSchema(goals, {
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a valid number",
  }),
  targetAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Target amount must be a valid number",
  }),
});
export const selectGoalSchema = createSelectSchema(goals);
