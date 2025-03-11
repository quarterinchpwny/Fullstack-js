import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { transactionTypes as transactionTypeTable } from "../../db/schema/transaction_types";
import { insertTransactionTypeSchema } from "../../db/schema/transaction_types";

import { db } from "../../db";
import { zValidator } from "@hono/zod-validator";

const postSchema = insertTransactionTypeSchema.omit({
  createdAt: true,
  id: true,
});
export const transactionTypesRoute = new Hono()
  .get("/", async (c) => {
    try {
      const data = await db.select().from(transactionTypeTable);
      return c.json({ transactionTypes: data, success: true });
    } catch (error) {
      return c.json(
        { error: "Failed to fetch transaction types", success: false },
        500
      );
    }
  })
  .post("/", zValidator("json", postSchema), async (c) => {
    try {
      const transactionType = c.req.valid("json");
      const result = await db
        .insert(transactionTypeTable)
        .values(transactionType);
      return c.json({ transactionType: result, success: true });
    } catch (error) {
      return c.json(
        { error: "Failed to create transaction type", success: false },
        500
      );
    }
  });
