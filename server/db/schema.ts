import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { expensesTable } from ".";

export const insertExpenseSchema = createInsertSchema(expensesTable);
export const selectExpenseSchema = createSelectSchema(expensesTable);
