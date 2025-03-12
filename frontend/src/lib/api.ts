import { type ApiRoutes } from "@server/app";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const api = client.api;

export async function getAllTransactions() {
  const response = await api.transactions.$get();
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export async function createTransaction(data: {
  name: string;
  amount: number;
  categoryId: number;
  transationTypeId: number;
}) {
  const response = await api.transactions.$post({
    json: {
      ...data,
      amount: data.amount.toString(), //Stored as string but type numeric for precision
      isRecurring: false,
      recurringFrequency: null,
      transationTypeId: data.transationTypeId,
      categoryId: data.categoryId,
    },
  });

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.error);
  }

  return response.json();
}
export async function deleteTransaction({ id }: { id: number }) {
  const res = await api.transactions[":id{[0-9]+}"].$delete({
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
