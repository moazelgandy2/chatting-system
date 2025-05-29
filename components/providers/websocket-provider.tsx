"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  useWebSocket,
  WebSocketStatus,
  WebSocketReturn,
} from "@/hooks/use-websocket";
import { WEBSOCKET_CONFIG } from "@/lib/websocket-config";

interface WebSocketContextValue {
  globalWs: WebSocketReturn | null;
  isGlobalConnected: boolean;
  globalStatus: WebSocketStatus;
}

const WebSocketContext = createContext<WebSocketContextValue>({
  globalWs: null,
  isGlobalConnected: false,
  globalStatus: "disconnected",
});

interface WebSocketProviderProps {
  children: React.ReactNode;
  url?: string;
  enabled?: boolean;
}

export function WebSocketProvider({
  children,
  url = WEBSOCKET_CONFIG.DEFAULT_URL,
  enabled = true,
}: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);

  const globalWs = useWebSocket({
    url,
    onOpen: () => {
      setIsConnected(true);
      console.log("Global WebSocket connected");
    },
    onClose: () => {
      setIsConnected(false);
      console.log("Global WebSocket disconnected");
    },
    onError: (error) => {
      console.error("Global WebSocket error:", error);
    },
    reconnectAttempts: WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS,
    reconnectDelay: WEBSOCKET_CONFIG.RECONNECT.DELAY,
  });

  useEffect(() => {
    if (!enabled) {
      globalWs.close();
    }
  }, [enabled, globalWs]);

  return (
    <WebSocketContext.Provider
      value={{
        globalWs: enabled ? globalWs : null,
        isGlobalConnected: isConnected,
        globalStatus: globalWs.status,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useGlobalWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useGlobalWebSocket must be used within a WebSocketProvider"
    );
  }
  return context;
}
