import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database("server/db/db.sqlite");
export const db = drizzle(sqlite);
