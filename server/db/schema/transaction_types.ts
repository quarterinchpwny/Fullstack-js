import {
  pgTable,
  serial,
  varchar,
  decimal,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { transactions } from "./transactions";
import { relations } from "drizzle-orm";

export const transactionTypes = pgTable("transaction_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transactionTypeRelations = relations(
  transactionTypes,
  ({ many }) => ({
    transactions: many(transactions),
  })
);

export const insertTransactionTypeSchema = createInsertSchema(
  transactionTypes,
  {
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  }
);
export const selectTransactionTypeSchema = createSelectSchema(transactionTypes);
