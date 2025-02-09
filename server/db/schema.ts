import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

//Tables
export const expensesTable = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(), 
  amount: integer("amount").notNull(),

});

export const insertExpenseSchema = createInsertSchema(expensesTable);
export const selectExpenseSchema = createSelectSchema(expensesTable);
