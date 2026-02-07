import { useAuth } from "@/lib/use-auth";
import type React from "react";
import { Navigate } from "react-router-dom";
import { TronReticle } from "./tron/TronReticle";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <TronReticle size="lg" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Initializing...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
