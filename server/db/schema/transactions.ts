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
import { categories } from "./categories";
import { transactionTypes } from "./transaction_type";
import { relations } from "drizzle-orm";
import { debtPayments } from "./debt_payments";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transationTypeId: integer("transaction_type_id").references(
    () => transactionTypes.id
  ),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  isRecurring: boolean("is_recurring").notNull().default(false),
  recurringFrequency: varchar("recurring_frequency", {
    enum: ["monthly", "weekly", "daily"],
  }),
  nextDueData: timestamp("next_due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  transactionType: one(transactionTypes, {
    fields: [transactions.transationTypeId],
    references: [transactionTypes.id],
  }),
  debtPayment: one(debtPayments, {
    fields: [transactions.id],
    references: [debtPayments.transactionId],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a valid monetary value",
  }),
  isRecurring: z.boolean(),
  recurringFrequency: z.enum(["monthly", "weekly", "daily"]),
  categoryId: z.number(),
});

export const selectTransactionSchema = createSelectSchema(transactions);
