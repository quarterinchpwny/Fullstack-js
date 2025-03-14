import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "../db";
import { categories as categoryTable } from "../db/schema/categories";
import { insertCategoriesSchema } from "../db/schema/categories";
import { eq, desc, sum, and, count } from "drizzle-orm";
import { convertKeysToSnakeCase } from "../lib/caseFormatter";
const postSchema = insertCategoriesSchema.omit({
  createdAt: true,
  id: true,
});

export const categoriesRoute = new Hono()
  .get("/", async (c) => {
    try {
      const data = await db.select().from(categoryTable);

      return c.json({
        categories: convertKeysToSnakeCase(data),
        success: true,
      });
    } catch (error) {
      return c.json(
        { error: "Failed to fetch categories", success: false },
        500
      );
    }
  })
  .post("/", zValidator("json", postSchema), async (c) => {
    try {
      const category = c.req.valid("json");
      const result = await db
        .insert(categoryTable)
        .values({
          ...category,
        })
        .returning();
      return c.json({ result, success: true }, 201);
    } catch (error) {
      return c.json(
        {
          error: "Failed to create category",
          success: false,
        },
        500
      );
    }
  })

  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.notFound();
    }
    const category = db
      .select()
      .from(categoryTable)
      .where(eq(categoryTable.id, id));
    if (category) {
      return c.json({ category: category });
    }
    return c.notFound();
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    if (Number.isNaN(id)) {
      return c.notFound();
    }
    try {
      const category = await db
        .delete(categoryTable)
        .where(eq(categoryTable.id, id))
        .returning();
      if (category.length === 0) {
        return c.notFound();
      }
      return c.json({ category: category[0], success: true });
    } catch (error) {
      return c.json(
        { error: "Failed to delete category", success: false },
        500
      );
    }
  });
