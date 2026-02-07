import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/use-auth";

const WS_URL =
  import.meta.env.VITE_WS_URL || "ws://localhost:8000/api/v1/ws/subscribe";

export function useWebSocket() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      const token = localStorage.getItem("token");
      if (token) {
        ws.send(JSON.stringify({ token }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event) {
          queryClient.invalidateQueries({ queryKey: [data.event] });
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [user, queryClient]);
}
