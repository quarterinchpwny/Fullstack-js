import { useState, useEffect } from "react";

import "./App.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

function App() {
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    async function getTotalSpent() {
      const response = await fetch("api/expenses");
      const data = await response.json();
      console.log(data);
      setTotalSpent(data.totalSpent);
    }

    getTotalSpent();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>Total amount spent</CardDescription>
        </CardHeader>
        <CardContent>${totalSpent} </CardContent>
      </Card>
    </>
  );
}

export default App;
