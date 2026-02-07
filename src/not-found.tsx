import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <h1 className="text-6xl font-heading text-primary tracking-widest">
        404
      </h1>
      <p className="text-muted-foreground">Page not found</p>
      <Button variant="outline" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </div>
  );
}
