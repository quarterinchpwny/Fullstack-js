import { useState, useEffect } from "react";

import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

import { hc } from "hono/client";
import { type ApiRoutes } from "../../server/app";

const client = hc<ApiRoutes>("/");

function App() {
  const [totalSpent, setTotalSpent] = useState(0);
  const [expensesList, setExpensesList] = useState<
    { id: number; title: string; amount: number }[]
  >([]);
  useEffect(() => {
    async function getTotalSpent() {
      const response = await client.api.expenses["total-spent"].$get();
      const data = await response.json();
      console.log(data);
      setTotalSpent(data.totalSpent);
    }
    async function getExpenses() {
      const response = await fetch("api/expenses");
      const data = await response.json();
      setExpensesList(data.expenses);
    }

    getTotalSpent();
    getExpenses();
  }, []);
  const expenses = expensesList.map((expense) => (
    <li key={expense.id}>
      {expense.title}: ${expense.amount}
    </li>
  ));
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>Total amount spent</CardDescription>
        </CardHeader>
        <CardContent>${totalSpent} </CardContent>
      </Card>
      <Card className="mt-4 mb-4">
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>List of expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <ul>{expenses}</ul>
        </CardContent>
      </Card>
    </>
  );
}

export default App;
