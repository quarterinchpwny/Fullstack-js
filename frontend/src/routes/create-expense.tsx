import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-expense")({
  component: CreateExpense,
});

function CreateExpense() {
  return <div>Hello "/create-expenese"!</div>;
}
