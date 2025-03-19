import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export function SummaryCard({
  isPending,
  total,
  error,
  type,
}: {
  isPending: boolean;
  total: number;
  error: {
    message: string | null;
  };
  type: "expense" | "income" | "balance";
}) {
  const activeIcon = {
    expense: (
      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
        <ArrowDownCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
      </div>
    ),
    income: (
      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
        <ArrowUpCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
      </div>
    ),
    balance: (
      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
        <DollarSign className="h-6 w-6 text-blue-500 dark:text-blue-400" />
      </div>
    ),
  };

  const textColorClass = {
    expense: "text-red-700 dark:text-red-300",
    income: "text-green-700 dark:text-green-300",
    balance: "text-blue-700 dark:text-blue-300",
  };

  const errorColorClass = {
    expense: "text-red-500",
    income: "text-green-500",
    balance: "text-blue-500",
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total {type}
              </p>
              {isPending ? (
                <p className={errorColorClass[type]}>Loading...</p>
              ) : total && total !== undefined && total !== null ? (
                <>
                  <p className={`text-2xl font-bold ${textColorClass[type]}`}>
                    ${" "}
                    {Number(total).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </>
              ) : error ? (
                <p className={errorColorClass[type]}>
                  Failed to load {type} ({error.message})
                </p>
              ) : (
                <p className={errorColorClass[type]}>No {type} recorded yet</p>
              )}
            </div>
            {activeIcon[type]}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
