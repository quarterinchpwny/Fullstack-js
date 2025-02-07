import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database("./db-files/db.sqlite");

//Tables
export const expensesTable = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  amount: integer("amount").notNull(),
  createdAt: text("createdAt").notNull().default(Date.now().toString()),
  updatedAt: text("updatedAt").notNull().default(Date.now().toString()),
});

export const db = drizzle(sqlite);
