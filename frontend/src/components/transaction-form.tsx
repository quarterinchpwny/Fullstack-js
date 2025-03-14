import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TransactionForm({
  onSubmit,
  isSubmitting,
  error,
  categories,
  transactionTypes,
}: {
  onSubmit: (data: {
    name: string;
    amount: number;
    categoryId: number;
    transationTypeId: number;
  }) => void;
  isSubmitting: boolean;
  error: string | null;
  categories: {
    transaction_type_id: number;
    id: string;
    name: string;
  }[];
  transactionTypes: { id: string; name: string }[];
}) {
  const form = useForm({
    defaultValues: {
      name: "",
      amount: "",
      categoryId: "",
      transactionTypeId: "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        name: value.name,
        amount: Number(value.amount),
        categoryId: Number(value.categoryId),
        transationTypeId: Number(value.transactionTypeId),
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <div className="space-y-4">
        <div>
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                !value ? "Title is required" : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field
            name="amount"
            validators={{
              onChange: ({ value }) =>
                !value ? "Amount is required" : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field
            name="transactionTypeId"
            validators={{
              onChange: ({ value }) =>
                !value ? "Transaction type is required" : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="transactionTypeId">Transaction type</Label>
                <Select
                  value={field.state.value ? String(field.state.value) : ""}
                  onValueChange={(value) => {
                    field.handleChange(value);
                    form.setFieldValue("categoryId", ""); // Reset categoryId when transactionTypeId changes
                  }}
                  required
                >
                  <SelectTrigger id="transactionTypeId">
                    <SelectValue placeholder="Select a transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {field.state.meta.errors && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field
            name="categoryId"
            validators={{
              onChange: ({ value }) =>
                !value ? "Category is required" : undefined,
            }}
          >
            {(field) => {
              const selectedTransactionTypeId = Number(
                form.state.values.transactionTypeId
              );
              const availableCategories = categories.filter(
                (category) =>
                  category.transaction_type_id === selectedTransactionTypeId
              );

              return (
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select
                    value={field.state.value ? String(field.state.value) : ""}
                    onValueChange={field.handleChange}
                    required={availableCategories.length > 0}
                  >
                    <SelectTrigger id="categoryId">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={String(category.id)}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
