import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Index,
});

async function getTotalSpent() {
  const response = await api.expenses["total-spent"].$get();
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  return data;
}

function Index() {
  const { data, isPending, error } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  });

  return (
    <>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
            <CardDescription>Your total expenses to date</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p className="text-gray-500">Loading...</p>
            ) : data && data.totalSpent !== 0 ? (
              <p className="text-2xl font-bold">
                $ {data.totalSpent.toFixed(2)}
              </p>
            ) : error ? (
              <p className="text-red-500">
                Failed to load expenses ({error.message})
              </p>
            ) : (
              <p className="text-gray-500">No expenses recorded yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
