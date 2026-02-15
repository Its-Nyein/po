import { useAuth } from "@/lib/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL;
const RECONNECT_INTERVAL = 4000;
export type TypingUsers = Record<number, number>;

export interface WebSocketReturn {
  typingUsers: TypingUsers;
  sendTyping: (conversationId: number, recipientId: number) => void;
}

export function useWebSocket(): WebSocketReturn {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUsers>({});
  const typingTimersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>(
    {},
  );
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!user) return;

    function connect() {
      if (!mountedRef.current) return;

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
          console.log("[WS] received:", data);

          if (data.event === "typing" && data.conversationId && data.userId) {
            const convId = data.conversationId as number;
            const userId = data.userId as number;

            setTypingUsers((prev) => ({ ...prev, [convId]: userId }));

            if (typingTimersRef.current[convId]) {
              clearTimeout(typingTimersRef.current[convId]);
            }

            typingTimersRef.current[convId] = setTimeout(() => {
              setTypingUsers((prev) => {
                const next = { ...prev };
                delete next[convId];
                return next;
              });
              delete typingTimersRef.current[convId];
            }, 3000);

            return;
          }

          if (data.event) {
            queryClient.invalidateQueries({ queryKey: [data.event] });
          }
        } catch {
          console.log("[WS] parse error");
        }
      };

      ws.onclose = () => {
        if (wsRef.current !== ws) return;
        wsRef.current = null;
        if (mountedRef.current) {
          reconnectTimerRef.current = setTimeout(connect, RECONNECT_INTERVAL);
        }
      };

      ws.onerror = () => {
        console.log("[WS] onerror");
      };
    }

    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      for (const timer of Object.values(typingTimersRef.current)) {
        clearTimeout(timer);
      }
      typingTimersRef.current = {};
    };
  }, [user, queryClient]);

  const sendTyping = useCallback(
    (conversationId: number, recipientId: number) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.log("[WS] sendTyping skipped: ws not open", {
          exists: !!ws,
          readyState: ws?.readyState,
        });
        return;
      }
      console.log("[WS] sendTyping:", { conversationId, recipientId });
      ws.send(
        JSON.stringify({
          event: "typing",
          conversationId,
          recipientId,
        }),
      );
    },
    [],
  );

  return { typingUsers, sendTyping };
}
