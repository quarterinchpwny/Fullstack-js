import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { expensesTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { insertExpenseSchema, selectExpenseSchema } from "../db/schema";

export const expensesRoute = new Hono()
  .get("/", (c) => {
    const allExpenses = db.select().from(expensesTable).all();

    return c.json({
      expenses: allExpenses,
    });
  })
  .get("/total-spent", (c) => {
    const result = db
      .select({ total: sql<number>`sum(${expensesTable.amount})` })
      .from(expensesTable)
      .all();

    return c.json({
      totalSpent: result[0].total || 0,
    });
  })

  .post("/", zValidator("json", insertExpenseSchema), async (c) => {
    const body = c.req.valid("json");
    const result = await db.insert(expensesTable).values(body).run();
    const newExpenseId = Number(result.lastInsertRowid);

    const newExpense = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.id, newExpenseId))
      .get();

    return c.json({ expense: newExpense });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.id, id))
      .get();

    return expense ? c.json({ expense }) : c.notFound();
  });
// .delete("/:id{[0-9]+}", (c) => {
//   const id = Number.parseInt(c.req.param("id"));
//   fakeExpenses = fakeExpenses.filter((expense) => expense.id !== id);
//   return c.json({ message: "Expense deleted" });
// });
