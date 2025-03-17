import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../../db";
import { transactions as transactionTable } from "../../db/schema/transactions";
import { insertTransactionSchema } from "../../db/schema/transactions";
import { eq, desc, sum, and, count, is, gte, or } from "drizzle-orm";
import { categories as categoryTable } from "../../db/schema/categories";
import { transactionTypes as transactionTypeTable } from "../../db/schema/transaction-types";
import { convertKeysToSnakeCase, formatResponse } from "../../lib/api-utility";

const postSchema = insertTransactionSchema.omit({
  createdAt: true,
  id: true,
});

export const transactionsRoute = new Hono()
  .get("/", async (c) => {
    try {
      const page = parseInt(c.req.query("page") || "1");
      const limit = parseInt(c.req.query("limit") || "10");
      const offset = (page - 1) * limit;

      const data = await db
        .select()
        .from(transactionTable)
        .leftJoin(
          categoryTable,
          eq(transactionTable.categoryId, categoryTable.id)
        )
        .leftJoin(
          transactionTypeTable,
          eq(transactionTable.transationTypeId, transactionTypeTable.id)
        )
        .limit(limit)
        .offset(offset);

      const totalCount = await db
        .select({ count: count() })
        .from(transactionTable);

      const flattened = data.map(
        ({ transactions, categories, transaction_types }) => ({
          ...transactions,
          category: { ...categories },
          transaction_type: { ...transaction_types },
        })
      );
      const payload = {
        total: totalCount[0].count,
        page,
        limit,
        total_pages: Math.ceil(totalCount[0].count / limit),
        transactions: convertKeysToSnakeCase(flattened),
      };

      return c.json(
        formatResponse(payload, 200, "Transactions fetched successfully")
      );
    } catch (error) {
      return c.json(formatResponse(null, 500, "Failed to fetch transactions"));
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
          return c.json(formatResponse(null, 400, "Category not found"));
        }
      }
      const result = await db
        .insert(transactionTable)
        .values({
          ...transaction,
          categoryId:
            transaction.categoryId === 0 ? null : transaction.categoryId,
        })
        .returning();

      return c.json(
        formatResponse(result, 201, "Transaction created successfully")
      );
    } catch (error) {
      console.log("error", error);
      return c.json(formatResponse(null, 500, "Failed to create transaction"));
    }
  })

  .get("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json(formatResponse(null, 404, "Transaction not found"));
    }
    const transaction = await db
      .select()
      .from(transactionTable)
      .where(eq(transactionTable.id, id));
    if (transaction.length > 0) {
      return c.json(
        formatResponse(
          { transaction: transaction[0] },
          200,
          "Transaction found"
        )
      );
    }
    return c.json(formatResponse(null, 404, "Transaction not found"));
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.json(formatResponse(null, 404, "Transaction not found"));
    }
    try {
      const transaction = await db
        .delete(transactionTable)
        .where(eq(transactionTable.id, id))
        .returning();
      if (transaction.length === 0) {
        return c.json(formatResponse(null, 404, "Transaction not found"));
      }
      return c.json(
        formatResponse(
          { transaction: transaction[0] },
          200,
          "Transaction deleted successfully"
        )
      );
    } catch (error) {
      return c.json(formatResponse(null, 500, "Failed to delete transaction"));
    }
  })
  .get("/summary/:period?", async (c) => {
    let baseQuery = db
      .select({
        type: transactionTypeTable.name,
        total: sum(transactionTable.amount),
      })
      .from(transactionTable)
      .leftJoin(
        transactionTypeTable,
        eq(transactionTable.transationTypeId, transactionTypeTable.id)
      )
      .groupBy(transactionTypeTable.name)
      .having(
        or(
          eq(transactionTypeTable.name, "Expense"),
          eq(transactionTypeTable.name, "Income")
        )
      );

    const period = c.req.param("period");
    const query =
      period === "week"
        ? baseQuery.where(
            gte(
              transactionTable.createdAt,
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            )
          )
        : period === "month"
        ? baseQuery.where(
            gte(
              transactionTable.createdAt,
              new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            )
          )
        : period === "year"
        ? baseQuery.where(
            gte(
              transactionTable.createdAt,
              new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
            )
          )
        : baseQuery;
    const data = await query.execute();

    const formattedData = data.reduce(
      (acc, curr) => {
        if (curr.type === "Expense") {
          acc.total_expense = Number(curr.total ?? 0);
        } else if (curr.type === "Income") {
          acc.total_income = Number(curr.total ?? 0);
        }
        return acc;
      },
      { total_expense: 0, total_income: 0 }
    );

    return c.json(
      formatResponse(formattedData, 200, "Summary fetched successfully")
    );
  });
