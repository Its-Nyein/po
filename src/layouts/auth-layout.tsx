import { Navigate, Outlet } from "react-router-dom";
import { TronGrid3D } from "@/components/tron/TronGrid3D";
import { TronScanlines } from "@/components/tron/TronScanlines";
import { useAuth } from "@/lib/use-auth";
import { TronReticle } from "@/components/tron/TronReticle";

export function AuthLayout() {
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

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="fixed inset-0 -z-10 opacity-40">
        <TronGrid3D showParticles showHorizon />
      </div>

      <div
        className="fixed inset-0 -z-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom, var(--tron-dim) 0%, transparent 50%), linear-gradient(to bottom, var(--background) 0%, var(--background) 100%)",
        }}
      />

      <TronScanlines intensity="light" />

      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading text-primary tracking-[0.3em] mb-2">
            PO
          </h1>
          <p className="text-sm text-muted-foreground tracking-wider">
            Social Network
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
