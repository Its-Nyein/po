import { PasswordInput } from "@/components/password-input";
import { TronReticle } from "@/components/tron/TronReticle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/use-auth";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !password) {
      setError("Username and password required.");
      return;
    }

    const success = await login(username, password);
    if (success) {
      toast.success("Login successful");
      navigate("/");
    } else {
      setError("Incorrect username or password");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>LOGIN</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-destructive text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3" id="login-form">
          <Input ref={usernameRef} placeholder="Username" autoFocus />
          <PasswordInput ref={passwordRef} placeholder="Password" />
          <Button type="submit" className="w-full" disabled={isLoading}>
            Login
          </Button>
          {isLoading && (
            <div className="flex flex-col items-center gap-2 pt-2">
              <TronReticle size="md" />
              <p className="text-xs text-primary/70 font-heading tracking-widest uppercase animate-pulse">
                Authenticating...
              </p>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
