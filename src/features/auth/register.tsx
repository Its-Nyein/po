import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "@/api/queries/auth.queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const register = useRegister();

  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const name = nameRef.current?.value || "";
    const username = usernameRef.current?.value || "";
    const bio = bioRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!name || !username || !password) {
      setError("Name, username and password are required.");
      return;
    }

    register.mutate(
      { name, username, bio, password },
      {
        onSuccess: () => {
          toast.success("Account created successfully");
          navigate("/login");
        },
        onError: () => {
          setError("Cannot create account. Username may already exist.");
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>REGISTER</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-destructive text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3" id="register-form">
          <Input ref={nameRef} placeholder="Name" autoFocus />
          <Input ref={usernameRef} placeholder="Username" />
          <Input ref={bioRef} placeholder="Bio" />
          <Input ref={passwordRef} type="password" placeholder="Password" />
          <Button
            type="submit"
            className="w-full"
            disabled={register.isPending}
          >
            {register.isPending ? "Creating account..." : "Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
