"use client";

import { useEffect } from "react";
import { WebSocketStatusIndicator } from "@/components/ui/websocket-status-indicator";
import { useChatWebSocket } from "@/hooks/use-chat-websocket";
import { cn } from "@/lib/utils";

interface ChatWebSocketManagerProps {
  chatId: string;
  enabled?: boolean;
  className?: string;
  showStatusIndicator?: boolean;
  statusIndicatorProps?: {
    showText?: boolean;
    className?: string;
  };
  onStatusChange?: (
    status: "connected" | "disconnected" | "connecting"
  ) => void;
}

export function ChatWebSocketManager({
  chatId,
  enabled = true,
  className,
  showStatusIndicator = false,
  statusIndicatorProps,
  onStatusChange,
}: ChatWebSocketManagerProps) {
  const { status, reconnect, close } = useChatWebSocket({
    chatId,
    enabled,
  });

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  useEffect(() => {
    // Cleanup on unmount or when disabled
    return () => {
      if (!enabled) {
        close();
      }
    };
  }, [enabled, close]);

  if (!showStatusIndicator) {
    return null;
  }

  return (
    <div className={cn("flex items-center", className)}>
      <WebSocketStatusIndicator
        status={status}
        onRetry={reconnect}
        {...statusIndicatorProps}
      />
    </div>
  );
}
