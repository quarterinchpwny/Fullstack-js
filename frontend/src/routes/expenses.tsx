import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { ExpenseForm } from "@/components/expense-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

async function getAllExpenses() {
  const response = await api.expenses.$get();
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

async function createExpense(data: { title: string; amount: number }) {
  const response = await api.expenses.$post({
    json: {
      ...data,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create expense");
  }

  return response.json();
}
function Expenses() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses,
  });

  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-expenses"] });
      setIsDialogOpen(false);
    },
  });

  const handleCreateExpense = (formData: { title: string; amount: number }) => {
    createExpenseMutation.mutate(formData);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {isPending ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : data && data.expenses.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="flex items-center gap-2">
                      {expense.title}
                    </TableCell>
                    <TableCell className="text-right">
                      ${expense.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          {error ? `No expenses found (${error.message})` : "No expenses found"}
        </p>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            onSubmit={handleCreateExpense}
            isSubmitting={createExpenseMutation.isPending}
            error={createExpenseMutation.error?.message || null}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
