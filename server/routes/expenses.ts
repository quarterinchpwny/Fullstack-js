import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { expenses as expenseTable } from "../db/schema/expenses";
import { insertExpensesSchema } from "../db/schema/expenses";
import { eq, desc, sum, and, count } from "drizzle-orm";
import { categories } from "../db/schema/categories";

const postSchema = insertExpensesSchema.omit({
  createdAt: true,
  id: true,
});

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    try {
      const data = await db
        .select({
          id: expenseTable.id,
          amount: expenseTable.amount,
          title: expenseTable.title,
          description: expenseTable.description,
          createdAt: expenseTable.createdAt,
          category: {
            id: expenseTable.categoryId,
            name: categories.name,
          },
        })
        .from(expenseTable)
        .leftJoin(categories, eq(expenseTable.categoryId, categories.id));
      return c.json({ expenses: data, success: true });
    } catch (error) {
      return c.json({ error: "Failed to fetch expenses", success: false }, 500);
    }
  })
  .post("/", zValidator("json", postSchema), async (c) => {
    try {
      const expense = c.req.valid("json");
      if (expense.categoryId) {
        const category = await db
          .select()
          .from(categories)
          .where(eq(categories.id, expense.categoryId))
          .limit(1);
        if (category.length === 0) {
          return c.json({ error: "Category not found", success: false }, 400);
        }
      }
      const result = await db
        .insert(expenseTable)
        .values({
          ...expense,
        })
        .returning();
      return c.json({ result, success: true }, 201);
    } catch (error) {
      return c.json(
        {
          error: "Failed to create expense",
          success: false,
        },
        500
      );
    }
  })
  .get("/total-spent", async (c) => {
    const result = await db
      .select({ total: sum(expenseTable.amount) })
      .from(expenseTable)
      .limit(1)
      .then((res) => res[0]);
    const countResult = await db.select({ count: count() }).from(expenseTable);
    return c.json({
      totalSpent: result.total,
      expensesCount: countResult[0].count,
    });
  })

  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.notFound();
    }
    const expense = db
      .select()
      .from(expenseTable)
      .where(eq(expenseTable.id, id));
    if (expense) {
      return c.json({ expense: expense });
    }
    return c.notFound();
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.notFound();
    }
    try {
      const expense = await db
        .delete(expenseTable)
        .where(eq(expenseTable.id, id))
        .returning();
      if (expense.length === 0) {
        return c.notFound();
      }
      return c.json({ expense: expense[0], success: true });
    } catch (error) {
      return c.json({ error: "Failed to delete expense", success: false }, 500);
    }
  });
