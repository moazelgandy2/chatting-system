import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWebSocket, WebSocketStatus } from "./use-websocket";
import { useChatRevalidate } from "./use-chat";
import { useWebSocketNotifications } from "./use-websocket-notifications";
import { WEBSOCKET_CONFIG } from "@/lib/websocket-config";

interface UseChatWebSocketConfig {
  chatId: string;
  enabled?: boolean;
  showNotifications?: boolean;
}

interface UseChatWebSocketReturn {
  status: WebSocketStatus;
  reconnect: () => void;
  close: () => void;
}

export function useChatWebSocket({
  chatId,
  enabled = true,
  showNotifications = false,
}: UseChatWebSocketConfig): UseChatWebSocketReturn {
  const router = useRouter();
  const revalidate = useChatRevalidate(chatId);
  const handleMessage = useCallback(
    (data: any) => {
      // Handle different types of messages here
      if (
        data.event === WEBSOCKET_CONFIG.EVENTS.MESSAGE ||
        data.event === WEBSOCKET_CONFIG.EVENTS.CHAT_MESSAGE ||
        data.event === "chat.message"
      ) {
        // New message received, refresh the chat
        router.refresh();
        revalidate();
      }
      // Add more message type handling as needed
    },
    [router, revalidate]
  );

  const handleOpen = useCallback(() => {
    console.log(`Connected to chat ${chatId}`);
  }, [chatId]);

  const handleClose = useCallback(() => {
    console.log(`Disconnected from chat ${chatId}`);
  }, [chatId]);

  const handleError = useCallback(
    (error: Event) => {
      console.error(`WebSocket error for chat ${chatId}:`, error);
    },
    [chatId]
  );
  const { status, reconnect, close } = useWebSocket({
    url: WEBSOCKET_CONFIG.DEFAULT_URL,
    channels: enabled ? [WEBSOCKET_CONFIG.CHANNELS.CHAT(chatId)] : [],
    onMessage: handleMessage,
    onOpen: handleOpen,
    onClose: handleClose,
    onError: handleError,
    reconnectAttempts: WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS,
    reconnectDelay: WEBSOCKET_CONFIG.RECONNECT.DELAY,
  });
  // Optional notifications for connection status
  useWebSocketNotifications({
    status,
    enabled: showNotifications,
    onReconnect: reconnect,
    customMessages: {
      connected: `Connected to chat ${chatId}`,
      disconnected: `Disconnected from chat ${chatId}`,
      reconnecting: `Reconnecting to chat ${chatId}...`,
    },
  });

  return {
    status,
    reconnect,
    close,
  };
}
