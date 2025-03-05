import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { db } from "../db";
import {
  expenses as expenseTable,
  insertExpensesSchema,
} from "../db/schema/expenses";
import { eq, desc, sum, and } from "drizzle-orm";

import { createExpenseSchema } from "../sharedTypes";

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    const expenses = await db
      .select()
      .from(expenseTable)
      // .where(eq(expenseTable.userId, user.id))
      .orderBy(desc(expenseTable.createdAt))
      .limit(100);

    return c.json({ expenses: expenses });
  })

  .get("/total-spent", async (c) => {
    return c.json({ total: 1000 });
  });
