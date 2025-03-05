import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const expenseSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1).max(50),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

let fakeExpenses: Expense[] = [
  { id: 1, title: "Groceries", amount: 50 },
  { id: 2, title: "Gas", amount: 30 },
  { id: 3, title: "Rent", amount: 1000 },
];

export const expensesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ expenses: fakeExpenses });
  })
  .get("/total-spent", async (c) => {
    const totalSpent = fakeExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
    return c.json({ totalSpent });
  })
  .post("/", zValidator("json", expenseSchema), async (c) => {
    const body = await c.req.valid("json");
    const expense = expenseSchema.parse(body);

    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 });

    console.log({ expense, fakeExpenses });
    return c.json({ expense });
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((expense) => expense.id === id);

    if (expense) {
      return c.json({ expense });
    }
    return c.notFound();
  })
  .delete("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    fakeExpenses = fakeExpenses.filter((expense) => expense.id !== id);
    return c.json({ message: "Expense deleted" });
  });
