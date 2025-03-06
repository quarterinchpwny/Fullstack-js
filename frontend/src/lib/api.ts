import { type ApiRoutes } from "@server/app";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const api = client.api;

export async function getAllExpenses() {
  const response = await api.expenses.$get();
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export async function createExpense(data: {
  title: string;
  amount: number;
  categoryId: number;
}) {
  const response = await api.expenses.$post({
    json: {
      ...data,
      amount: data.amount.toString(),
    },
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error);
  }

  return response.json();
}

export async function deleteExpense({ id }: { id: number }) {
  const res = await api.expenses[":id{[0-9]+}"].$delete({
    param: { id: id.toString() },
  });

  if (!res.ok) {
    throw new Error("server error");
  }
}

export async function getCategories() {
  const response = await api.categories.$get();
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}
