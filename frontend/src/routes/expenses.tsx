import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllExpenses, deleteExpense, createExpense } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { ExpenseForm } from "@/components/expense-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/expenses")({
  component: Expenses,
});

function Expenses() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: expensesData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["get-all-expenses"],
    queryFn: getAllExpenses,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["get-all-categories"],
    queryFn: () => fetch("/api/categories").then((res) => res.json()),
  });

  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-expenses"] });
      setIsDialogOpen(false);
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-expenses"] });
    },
  });

  const handleCreateExpense = (formData: {
    title: string;
    amount: number;

    categoryId: string;
  }) => {
    createExpenseMutation.mutate({
      ...formData,
      categoryId: parseInt(formData.categoryId, 10),
    });
  };

  const DeleteButton = ({ expenseId }: { expenseId: number }) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex  gap-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  const dialogClose = document.querySelector(
                    '[data-state="open"]'
                  );
                  if (dialogClose instanceof HTMLElement) {
                    dialogClose.click();
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => deleteExpenseMutation.mutate({ id: expenseId })}
              >
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
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
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : expensesData && expensesData.expenses.length > 0 ? (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expensesData?.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>${expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{expense.category.name}</TableCell>
                    <TableCell>
                      <DeleteButton expenseId={expense.id} />
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
            categories={categoriesData?.categories || []}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
