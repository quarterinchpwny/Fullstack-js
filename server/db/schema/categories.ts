import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCategoriesSchema = createInsertSchema(categories, {
  name: z
    .string()
    .min(2, { message: "Categories name must be at least 2 characters" }),
});

export const selectCategoriesSchema = createSelectSchema(categories);
