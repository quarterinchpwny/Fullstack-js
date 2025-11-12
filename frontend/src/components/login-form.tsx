import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import { useNavigate } from "@tanstack/react-router";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.auth.login.$post({ json: { email, password } });
      const data = await res.json();

      if (res.status === 200) {
        toast(data.message, {
          description: "Sunday, December 03, 2023 at 9:00 AM",
        });
        navigate({ to: "/transaction" });
      } else {
        toast(data.error, {
          description: "Please try again",
        });
      }
    } catch (error) {
      toast("Event has been created", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <Toaster />

      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Sign in</Button>
        </CardFooter>
      </form>
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <a href="/signup" className="underline">
          Sign up
        </a>
      </div>
    </Card>
  );
}
