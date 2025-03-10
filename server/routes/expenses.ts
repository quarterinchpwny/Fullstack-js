import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { transactions as transactionTable } from "../db/schema/transactions";
import { insertTransactionSchema } from "../db/schema/transactions";
import { eq, desc, sum, and, count, is } from "drizzle-orm";
import { categories as categoryTable } from "../db/schema/categories";
import { transactionTypes as transactionTypeTable } from "../db/schema/transaction_type";

const postSchema = insertTransactionSchema.omit({
  createdAt: true,
  id: true,
});

export const transactionsRoute = new Hono()
  .get("/", async (c) => {
    try {
      const data = await db
        .select({
          id: transactionTable.id,
          amount: transactionTable.amount,
          title: transactionTable.title,
          description: transactionTable.description,
          createdAt: transactionTable.createdAt,
          isRecurring: transactionTable.isRecurring,
          recurringFrequency: transactionTable.recurringFrequency,
          nextDueDate: transactionTable.nextDueData,
          category: {
            id: transactionTable.categoryId,
            name: categoryTable.name,
          },
          transactionType: {
            id: transactionTable.transationTypeId,
            name: transactionTypeTable.name,
          },
        })
        .from(transactionTable)
        .leftJoin(
          categoryTable,
          eq(transactionTable.categoryId, categoryTable.id)
        )
        .leftJoin(
          transactionTypeTable,
          eq(transactionTable.transationTypeId, transactionTypeTable.id)
        );
      return c.json({ transactions: data, success: true });
    } catch (error) {
      return c.json(
        { error: "Failed to fetch transactions", success: false },
        500
      );
    }
  })
  .post("/", zValidator("json", postSchema), async (c) => {
    try {
      const transaction = c.req.valid("json");
      if (transaction.categoryId) {
        const category = await db
          .select()
          .from(categoryTable)
          .where(eq(categoryTable.id, transaction.categoryId))
          .limit(1);
        if (category.length === 0) {
          return c.json({ error: "Category not found", success: false }, 400);
        }
      }
      const result = await db
        .insert(transactionTable)
        .values({
          ...transaction,
        })
        .returning();
      return c.json({ result, success: true }, 201);
    } catch (error) {
      return c.json(
        {
          error: "Failed to create transaction",
          success: false,
        },
        500
      );
    }
  })
  .get("/total-spent", async (c) => {
    const result = await db
      .select({ total: sum(transactionTable.amount) })
      .from(transactionTable)
      .limit(1)
      .then((res) => res[0]);
    const countResult = await db
      .select({ count: count() })
      .from(transactionTable);
    return c.json({
      totalSpent: result.total,
      transactionsCount: countResult[0].count,
    });
  })

  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.notFound();
    }
    const transaction = db
      .select()
      .from(transactionTable)
      .where(eq(transactionTable.id, id));
    if (transaction) {
      return c.json({ transaction: transaction });
    }
    return c.notFound();
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.notFound();
    }
    try {
      const transaction = await db
        .delete(transactionTable)
        .where(eq(transactionTable.id, id))
        .returning();
      if (transaction.length === 0) {
        return c.notFound();
      }
      return c.json({ transaction: transaction[0], success: true });
    } catch (error) {
      return c.json(
        { error: "Failed to delete transaction", success: false },
        500
      );
    }
  });
