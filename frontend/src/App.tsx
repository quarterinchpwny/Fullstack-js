import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

import { api } from "@/lib/api";

import { useQuery } from "@tanstack/react-query";

async function getTotalSpent() {
  const response = await api.expenses["total-spent"].$get();

  if (!response.ok) {
    throw new Error("Server error");
  }
  const data = await response.json();
  return data;
}

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-expenses"],
    queryFn: getTotalSpent,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
          <CardDescription>Total amount spent</CardDescription>
        </CardHeader>
        <CardContent>${data} </CardContent>
      </Card>
    </>
  );
}

export default App;
