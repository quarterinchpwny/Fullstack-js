import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllTransactions,
  deleteTransaction,
  createTransaction,
} from "@/lib/api";
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
import { TransactionForm } from "@/components/transaction-form";
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

export const Route = createFileRoute("/transaction")({
  component: Transactions,
});

function Transactions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: transactionData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["get-all-transactions"],
    queryFn: getAllTransactions,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["get-all-categories"],
    queryFn: () => fetch("/api/categories").then((res) => res.json()),
  });

  const { data: transactionTypesData } = useQuery({
    queryKey: ["get-all-transaction-types"],
    queryFn: () => fetch("/api/transaction-types").then((res) => res.json()),
  });

  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-transactions"] });
      setIsDialogOpen(false);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-transactions"] });
    },
  });

  const handleCreateTransaction = (formData: {
    name: string;
    amount: number;
    categoryId: string;
    transactionTypeId: string;
  }) => {
    createTransactionMutation.mutate({
      ...formData,
      categoryId: parseInt(formData.categoryId, 10),
      transactionTypeId: parseInt(formData.transactionTypeId, 10),
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
            <DialogTitle>Delete Transaction</DialogTitle>
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
                onClick={() =>
                  deleteTransactionMutation.mutate({ id: expenseId })
                }
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
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {isPending ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : transactionData && transactionData.transactions.length > 0 ? (
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
                {transactionData?.transactions.map(
                  (transaction: {
                    id: string;
                    name: string;
                    amount: number;
                    category: {
                      name: string;
                    };
                  }) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.name}</TableCell>
                      <TableCell>${transaction.amount}</TableCell>
                      <TableCell>{transaction.category.name}</TableCell>
                      <TableCell>
                        <DeleteButton expenseId={Number(transaction.id)} />
                      </TableCell>
                    </TableRow>
                  )
                )}
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
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleCreateTransaction}
            isSubmitting={createTransactionMutation.isPending}
            error={createTransactionMutation.error?.message || null}
            categories={categoriesData?.categories || []}
            transactionTypes={transactionTypesData?.transactionTypes || []}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
