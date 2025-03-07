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
import {
  DollarSign,
  PiggyBank,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";

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
  const progressValue: number = 70;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </p>
                {isPending ? (
                  <p className="text-red-500">Loading...</p>
                ) : data &&
                  data.totalSpent !== undefined &&
                  data.totalSpent !== null ? (
                  <>
                    <p className=" text-2xl font-bold text-red-700 dark:text-red-300">
                      ${" "}
                      {Number(data.totalSpent).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </>
                ) : error ? (
                  <p className="text-red-500">
                    Failed to load expenses ({error.message})
                  </p>
                ) : (
                  <p className="text-red-500">No expenses recorded yet</p>
                )}
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <ArrowDownCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Income
                </p>
                <h3 className="text-2xl font-bold">1000</h3>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <ArrowUpCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Current Balance
                </p>
                <h3 className="text-2xl font-bold">1000</h3>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-5">
          <CardTitle>Savings</CardTitle>
          <CardDescription>
            Track your savings progress and reach your financial goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Savings Progress
            </p>
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-4 w-4 text-primary" />
              <Progress
                value={progressValue}
                className={`flex-grow ${progressValue === 100 ? "[&>*]:bg-green-600" : "[&>*]:bg-blue-600"}`}
              />
              <span className="text-sm font-medium">{progressValue}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {progressValue} / 100
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
