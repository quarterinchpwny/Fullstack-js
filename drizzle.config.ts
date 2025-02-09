// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations", // Set where migrations are stored
  dbCredentials: {
    url: 'file:./server/db/db.sqlite',
  }
});
