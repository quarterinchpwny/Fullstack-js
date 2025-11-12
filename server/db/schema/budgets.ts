// External Imports
import { z } from "zod";
import {
  pgTable,
  serial,
  varchar,
  numeric,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Internal Imports
import { categories } from "./categories";

// Budgets Table Definition
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),

  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),

  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),

  frequency: varchar("frequency", {
    enum: ["monthly", "weekly", "daily"],
  }).notNull(),

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at").notNull().defaultNow(),

  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Budget → Category Relation
export const budgetsRelations = relations(budgets, ({ one }) => ({
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));

// Schema for Inserting a Budget
export const insertBudgetSchema = createInsertSchema(budgets, {
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a valid monetary value (up to 2 decimal places)",
  }),
  frequency: z.enum(["monthly", "weekly", "daily"]),
  isActive: z.boolean(),
});

// Schema for Selecting a Budget
export const selectBudgetSchema = createSelectSchema(budgets);
