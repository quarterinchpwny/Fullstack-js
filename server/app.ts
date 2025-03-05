import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses";

const app = new Hono();

app.use("*", logger());
app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ root: "./frontend/dist/index.html" }));

// API route
const apiRoutes = app.basePath("/api").route("/expenses", expensesRoute);

export default app;
export type ApiRoutes = typeof apiRoutes;
