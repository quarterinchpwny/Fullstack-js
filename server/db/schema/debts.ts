import {
  pgTable,
  serial,
  varchar,
  numeric,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { debtPayments } from "./debt-payments";
import { relations } from "drizzle-orm";

export const debts = pgTable("debts", {
  id: serial("id").primaryKey(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueData: timestamp("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const debtsRelations = relations(debts, ({ many }) => ({
  debtPayments: many(debtPayments),
}));

export const insertDebtsSchema = createInsertSchema(debts, {
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a valid monetary value",
  }),
});

export const selectDebtsSchema = createSelectSchema(debts);
