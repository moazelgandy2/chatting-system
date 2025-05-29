"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { WebSocketStatus } from "@/hooks/use-websocket";

interface UseWebSocketNotificationsConfig {
  status: WebSocketStatus;
  enabled?: boolean;
  showConnectionToast?: boolean;
  showDisconnectionToast?: boolean;
  showReconnectionToast?: boolean;
  onReconnect?: () => void;
  customMessages?: {
    connected?: string;
    disconnected?: string;
    reconnecting?: string;
  };
}

export function useWebSocketNotifications({
  status,
  enabled = true,
  showConnectionToast = true,
  showDisconnectionToast = true,
  showReconnectionToast = true,
  onReconnect,
  customMessages = {},
}: UseWebSocketNotificationsConfig) {
  const previousStatusRef = useRef<WebSocketStatus>("disconnected");
  const hasShownInitialConnection = useRef(false);
  const currentToastRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const previousStatus = previousStatusRef.current;
    const isInitialConnection = !hasShownInitialConnection.current;

    // Dismiss previous toast if it exists
    if (currentToastRef.current) {
      toast.dismiss(currentToastRef.current);
      currentToastRef.current = null;
    }

    // Show appropriate notifications based on status changes
    if (status !== previousStatus) {
      switch (status) {
        case "connected":
          if (
            showConnectionToast &&
            (!isInitialConnection || previousStatus === "disconnected")
          ) {
            currentToastRef.current = toast.success(
              customMessages.connected || "Connected to server",
              {
                duration: 2000,
                description: "Real-time updates are now available",
              }
            );
          }
          hasShownInitialConnection.current = true;
          break;

        case "disconnected":
          if (showDisconnectionToast && !isInitialConnection) {
            currentToastRef.current = toast.error(
              customMessages.disconnected || "Disconnected from server",
              {
                duration: 5000,
                description: "Real-time updates are temporarily unavailable",
                action: onReconnect
                  ? {
                      label: "Retry",
                      onClick: onReconnect,
                    }
                  : undefined,
              }
            );
          }
          break;

        case "connecting":
          if (showReconnectionToast && previousStatus === "disconnected") {
            currentToastRef.current = toast.loading(
              customMessages.reconnecting || "Reconnecting to server...",
              {
                description: "Please wait while we restore the connection",
              }
            );
          }
          break;
      }
    }

    previousStatusRef.current = status;
  }, [
    status,
    enabled,
    showConnectionToast,
    showDisconnectionToast,
    showReconnectionToast,
    onReconnect,
    customMessages,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentToastRef.current) {
        toast.dismiss(currentToastRef.current);
      }
    };
  }, []);
}

// Alternative implementation using a component
interface WebSocketNotificationsProps extends UseWebSocketNotificationsConfig {
  children?: React.ReactNode;
}

export function WebSocketNotifications({
  children,
  ...config
}: WebSocketNotificationsProps) {
  useWebSocketNotifications(config);
  return children || null;
}
