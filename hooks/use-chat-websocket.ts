import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useWebSocket, WebSocketStatus } from "./use-websocket";
import { useChatRevalidate } from "./use-chat";
import { useWebSocketNotifications } from "./use-websocket-notifications";
import { WEBSOCKET_CONFIG } from "@/lib/websocket-config";
import {
  processMediaFiles,
  validateNewMessageData,
  extractSenderInfo,
} from "@/lib/websocket-utils";
import { CHATS_QUERY_KEY } from "@/hooks/use-chats";
import {
  ChatMessage,
  ChatMessagesApiResponse,
  NewMessageEventData,
  WebSocketMessageEvent,
} from "@/types/chats";

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
  const router = useRouter();
  const queryClient = useQueryClient();
  const revalidate = useChatRevalidate(chatId);
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
      console.log("WebSocket message received in chat:", data);

      try {
        // Handle different types of messages here
        if (
          data.event === WEBSOCKET_CONFIG.EVENTS.MESSAGE ||
          data.event === WEBSOCKET_CONFIG.EVENTS.CHAT_MESSAGE ||
          data.event === WEBSOCKET_CONFIG.EVENTS.NEW_MESSAGE_EVENT ||
          data.event === "chat.message"
        ) {
          // Handle NewMessageEvent specifically
          if (
            data.event === WEBSOCKET_CONFIG.EVENTS.NEW_MESSAGE_EVENT &&
            data.data
          ) {
            const messageData = data.data as NewMessageEventData;

            // Validate message data structure
            if (!validateNewMessageData(messageData)) {
              console.warn("Invalid message data received:", messageData);
              return;
            }

            // Check if this message is for the current chat
            if (
              messageData.chat_id &&
              messageData.chat_id.toString() === chatId
            ) {
              console.log("New message for current chat:", messageData);

              // Update all pages of the chat query cache optimistically
              queryClient.setQueriesData(
                { queryKey: [CHATS_QUERY_KEY, chatId] },
                (oldData: ChatMessagesApiResponse | undefined) => {
                  if (!oldData || !oldData.data) return oldData;

                  // Process media files and sender information
                  const processedMediaFiles = processMediaFiles(
                    messageData.media_files || []
                  );
                  const senderInfo = extractSenderInfo(messageData);

                  // Create a proper ChatMessage object from the websocket data
                  const newMessage: ChatMessage = {
                    id: messageData.id,
                    chat_id: parseInt(messageData.chat_id.toString()),
                    sender_id: parseInt(messageData.sender_id.toString()),
                    message: messageData.message,
                    file_path: null,
                    created_at: messageData.created_at,
                    updated_at: messageData.created_at,
                    client_package_item_id: null,
                    sender: senderInfo,
                    media_files: messageData.media_files || [],
                    media: processedMediaFiles,
                  };

                  // Check if message already exists to avoid duplicates
                  const messageExists = oldData.data.data.some(
                    (msg) => msg.id === newMessage.id
                  );

                  if (!messageExists) {
                    return {
                      ...oldData,
                      data: {
                        ...oldData.data,
                        data: [...oldData.data.data, newMessage],
                        total: oldData.data.total + 1,
                      },
                    };
                  }
                  return oldData;
                }
              );

              // Use debounced invalidation to prevent excessive refetching
              debouncedInvalidateQueries();
            }
          }

          // For other message types, just refresh
          router.refresh();
          revalidate();
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error);
      }
      // Add more message type handling as needed
    },
    [router, revalidate, queryClient, chatId, debouncedInvalidateQueries]
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
    close: () => {
      // Clear any pending invalidation timeout
      if (invalidationTimeoutRef.current) {
        clearTimeout(invalidationTimeoutRef.current);
      }
      close();
    },
  };
}
