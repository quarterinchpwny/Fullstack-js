import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Base timestamp columns
const timestampColumns = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};

// Expenses table definition
export const expensesTable = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  ...timestampColumns,
});

// Schema validations
export const insertExpenseSchema = createInsertSchema(expensesTable);
export const selectExpenseSchema = createSelectSchema(expensesTable);

// Type definitions
export type Expense = typeof expensesTable.$inferSelect;
export type NewExpense = typeof expensesTable.$inferInsert;
