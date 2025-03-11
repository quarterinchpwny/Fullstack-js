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

export function ExpenseForm({
  onSubmit,
  isSubmitting,
  error,
  categories,
}: {
  onSubmit: (data: {
    title: string;
    amount: number;
    categoryId: string;
    transationTypeId: string;
  }) => void;
  isSubmitting: boolean;
  error: string | null;
  categories: { id: string; name: string }[];
}) {
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "",
      categoryId: "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        title: value.title,
        amount: Number(value.amount),
        categoryId: value.categoryId,
        transationTypeId: "1",
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
      className="space-y-6"
    >
      <div className="space-y-4">
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) => (!value ? "Title is required" : undefined),
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

        <form.Field
          name="categoryId"
          validators={{
            onChange: ({ value }) =>
              !value ? "Category is required" : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                value={field.state.value ? String(field.state.value) : ""}
                onValueChange={(value) => {
                  console.log("Selected Value:", value);
                  field.handleChange(value);
                }}
                disabled={categories.length === 0}
                required
              >
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
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
          )}
        </form.Field>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
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
