// External Imports
import { z } from "zod";
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

// Internal Imports
import { transactions } from "./transactions";
import { budgets } from "./budgets";
import { transactionTypes } from "./transaction-types";

// Categories Table Definition
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),

  description: varchar("description", { length: 255 }),

  transactionTypeId: integer("transaction_type_id").references(
    () => transactionTypes.id
  ),

  createdAt: timestamp("created_at").notNull().defaultNow(),

  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Categories Table Relations
export const categoriesRelations = relations(categories, ({ many, one }) => ({
  transactions: many(transactions), // A category can have many transactions
  budgets: many(budgets), // A category can have many budgets
  transactionType: one(transactionTypes, {
    fields: [categories.transactionTypeId],
    references: [transactionTypes.id],
  }),
}));

// Zod Schema for Inserting Category
export const insertCategoriesSchema = createInsertSchema(categories, {
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters long" })
    .max(100, { message: "Category name must be at most 100 characters long" }),

  description: z
    .string()
    .max(255, { message: "Description must be at most 255 characters" })
    .optional(),
});

// Zod Schema for Selecting Category
export const selectCategoriesSchema = createSelectSchema(categories);

// TypeScript Types
export type NewCategory = z.infer<typeof insertCategoriesSchema>;
export type Category = z.infer<typeof selectCategoriesSchema>;
