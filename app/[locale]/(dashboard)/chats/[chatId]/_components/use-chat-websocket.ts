"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type WebSocketStatus = "connected" | "disconnected" | "connecting";

interface UseChatWebSocketProps {
  chatId: string;
  onNewMessage: () => void;
}

export function useChatWebSocket({
  chatId,
  onNewMessage,
}: UseChatWebSocketProps) {
  const [wsConnectionStatus, setWsConnectionStatus] =
    useState<WebSocketStatus>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();

  useEffect(() => {
    const ws = new WebSocket(`ws://ws.droplo.cloud/app/980e9rlf318lalrzdks4`);
    wsRef.current = ws;

    console.log("WebSocket connection established");

    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setWsConnectionStatus("connected");
      ws.send(
        JSON.stringify({
          event: "pusher:subscribe",
          data: {
            channel: `chat.${chatId}`,
          },
        })
      );
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setWsConnectionStatus("disconnected");
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message received:", JSON.parse(event.data));
      console.log("Here");
      router.refresh();
      onNewMessage();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(`{"event":"ping"}`);
      }
    }, 29000);

    return () => {
      clearInterval(pingInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [chatId, onNewMessage, router]);

  return { wsConnectionStatus };
}
