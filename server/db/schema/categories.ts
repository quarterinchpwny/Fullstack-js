import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { transactions } from "./transactions";
import { budgets } from "./budgets";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions), // One category can have many transactions
  budgets: many(budgets), // One category can have many budgets
}));

export const insertCategoriesSchema = createInsertSchema(categories, {
  name: z
    .string()
    .min(2, { message: "Categories name must be at least 2 characters" }),
});

export const selectCategoriesSchema = createSelectSchema(categories);
