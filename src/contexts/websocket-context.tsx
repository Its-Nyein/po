import {
  useWebSocket,
  type TypingUsers,
  type WebSocketReturn,
} from "@/hooks/use-websocket";
import { createContext, useContext, type ReactNode } from "react";

const WebSocketContext = createContext<WebSocketReturn | undefined>(undefined);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const ws = useWebSocket();
  return (
    <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
  );
}

const defaultReturn: WebSocketReturn = {
  typingUsers: {} as TypingUsers,
  sendTyping: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export function useWebSocketContext(): WebSocketReturn {
  const context = useContext(WebSocketContext);
  return context ?? defaultReturn;
}
