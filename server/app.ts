import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { transactionsRoute } from "./routes/transactions/transactions";
import { transactionTypesRoute } from "./routes/transactions/transaction-types";
import { categoriesRoute } from "./routes/categories";

const app = new Hono();

app.use("*", logger());
app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ root: "./frontend/dist/index.html" }));

// API route
const apiRoutes = app
  .basePath("/api")
  .route("/transactions", transactionsRoute)
  .route("/transaction-types", transactionTypesRoute)
  .route("/categories", categoriesRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
