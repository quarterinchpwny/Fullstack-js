import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses";

const app = new Hono();

app.use("*", logger());
app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ root: "./frontend/dist/index.html" }));

// API route
app.get("/api", (c) => c.text("Hello from Bun + Hono API!"));
app.route("/api/expenses", expensesRoute);

export default app;
