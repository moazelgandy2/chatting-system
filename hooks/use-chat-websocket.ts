import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket, WebSocketStatus } from "./use-websocket";
import { useWebSocketNotifications } from "./use-websocket-notifications";
import { WEBSOCKET_CONFIG } from "@/lib/websocket-config";
import { validateNewMessageData } from "@/lib/websocket-utils";
import { CHATS_QUERY_KEY } from "@/hooks/use-chats";
import { NewMessageEventData, WebSocketMessageEvent } from "@/types/chats";

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
  showNotifications = false, // Disabled by default to prevent UI spam
}: UseChatWebSocketConfig): UseChatWebSocketReturn {
  const queryClient = useQueryClient();

  // Debounce query invalidation to prevent excessive refetching
  const invalidationTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedInvalidateQueries = useCallback(() => {
    if (invalidationTimeoutRef.current) {
      clearTimeout(invalidationTimeoutRef.current);
    }

    invalidationTimeoutRef.current = setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: [CHATS_QUERY_KEY, chatId],
      });
    }, 500); // 500ms debounce
  }, [queryClient, chatId]);
  const handleMessage = useCallback(
    (data: WebSocketMessageEvent) => {
      console.log("new event");
      console.log("WebSocket message received in chat:", data);

      try {
        // Revalidate messages on any WebSocket event received
        debouncedInvalidateQueries();

        // Handle NewMessageEvent specifically for additional logging
        if (
          data.event === WEBSOCKET_CONFIG.EVENTS.NEW_MESSAGE_EVENT &&
          data.data
        ) {
          const messageData = data.data as NewMessageEventData;

          // Validate message data structure
          if (validateNewMessageData(messageData)) {
            // Check if this message is for the current chat
            if (
              messageData.chat_id &&
              messageData.chat_id.toString() === chatId
            ) {
              console.log("New message for current chat:", messageData);
            }
          } else {
            console.warn("Invalid message data received:", messageData);
          }
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
    },
    [chatId, debouncedInvalidateQueries]
  );
  const handleOpen = useCallback(() => {
    console.log(`Connected to chat ${chatId}`);

    // Invalidate queries to fetch any missed messages when connecting/reconnecting
    queryClient.invalidateQueries({
      queryKey: [CHATS_QUERY_KEY, chatId],
    });
  }, [chatId, queryClient]);

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
    close: () => {
      // Clear any pending invalidation timeout
      if (invalidationTimeoutRef.current) {
        clearTimeout(invalidationTimeoutRef.current);
      }
      close();
    },
  };
}
