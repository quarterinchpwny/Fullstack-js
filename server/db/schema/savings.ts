import { relations } from "drizzle-orm";
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
import { goals } from "./goals";

export const savings = pgTable("savings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  targetDate: timestamp("target_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  goalId: integer("goal_id").references(() => goals.id),
});

export const savingsRelations = relations(savings, ({ one }) => ({
  goal: one(goals, {
    fields: [savings.goalId],
    references: [goals.id],
  }),
}));

export const insertSavingsSchema = createInsertSchema(savings, {
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a valid number",
  }),
});

export const selectSavingsSchema = createSelectSchema(savings);
