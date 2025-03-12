import {
  pgTable,
  serial,
  varchar,
  decimal,
  timestamp,
  text,
  integer,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { debts } from "./debts";
import { relations } from "drizzle-orm";
import { transactions } from "./transactions";

export const debtPayments = pgTable("debt_payments", {
  id: serial("id").primaryKey(),
  debtId: integer("debt_id")
    .references(() => debts.id)
    .notNull(),
  transactionId: integer("transaction_id")
    .references(() => transactions.id)
    .notNull(),
  amountPaid: numeric("amount_paid", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const debtPaymentsRelations = relations(debtPayments, ({ one }) => ({
  debt: one(debts, {
    fields: [debtPayments.debtId],
    references: [debts.id],
  }),
  transaction: one(transactions, {
    fields: [debtPayments.transactionId],
    references: [transactions.id],
  }),
}));
export const insertDebtPaymentSchema = createInsertSchema(debtPayments, {
  amountPaid: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be a valid monetary value",
  }),
});
export const selectDebtPaymentSchema = createSelectSchema(debtPayments);
