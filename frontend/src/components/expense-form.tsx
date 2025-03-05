import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function ExpenseForm({
  onSubmit,
  isSubmitting,
  error,
}: {
  onSubmit: (data: { title: string; amount: number }) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const form = useForm({
    defaultValues: {
      title: "",
      amount: "",
    },
    onSubmit: async ({ value }) => {
      onSubmit({
        title: value.title,
        amount: Number(value.amount),
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
