import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { transactions } from "./transactions";
import { budgets } from "./budgets";
import { relations } from "drizzle-orm";
import { transactionTypes } from "./transaction-types";

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

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  transactions: many(transactions), // One category can have many transactions
  budgets: many(budgets), // One category can have many budgets
  transactionTypeRelations: one(transactionTypes, {
    fields: [categories.transactionTypeId],
    references: [transactionTypes.id],
  }),
}));

export const insertCategoriesSchema = createInsertSchema(categories, {
  name: z
    .string()
    .min(2, { message: "Categories name must be at least 2 characters" }),
});

export const selectCategoriesSchema = createSelectSchema(categories);
