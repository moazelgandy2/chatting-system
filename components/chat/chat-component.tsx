/**
 * Example Component: Real-time Chat with WebSocket Integration
 *
 * This component demonstrates how to use the enhanced WebSocket system
 * for real-time chat message updates.
 */

import React from "react";
import { useChatWebSocket } from "@/hooks/use-chat-websocket";
import { useChat } from "@/hooks/use-chat";

interface ChatComponentProps {
  chatId: string;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({ chatId }) => {
  // Use the chat WebSocket hook for real-time updates
  const { status: wsStatus } = useChatWebSocket({
    chatId,
    enabled: true,
    showNotifications: false, // Set to true to show connection notifications
  });
  const { data: chatData, isLoading, error } = useChat(chatId);

  if (isLoading) {
    return <div className="p-4">Loading chat messages...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading chat: {error.message}
      </div>
    );
  }

  const messages = chatData?.data?.data || [];

  return (
    <div className="flex flex-col h-full">
      {/* Connection Status Indicator */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              wsStatus === "connected"
                ? "bg-green-500"
                : wsStatus === "connecting"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-600">
            {wsStatus === "connected"
              ? "Connected"
              : wsStatus === "connecting"
              ? "Connecting..."
              : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {message.sender.name}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </div>
              <div className="bg-white border rounded-lg p-3 shadow-sm">
                <p className="text-gray-800">{message.message}</p>

                {/* Display media files if present */}
                {message.media && message.media.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.media.map((media, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {media.type}
                        </span>
                        {media.name && (
                          <span className="text-sm text-gray-600">
                            {media.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
