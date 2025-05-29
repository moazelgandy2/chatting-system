import { useEffect, useRef, useState, useCallback } from "react";
import { WEBSOCKET_CONFIG } from "@/lib/websocket-config";

export type WebSocketStatus = "connected" | "disconnected" | "connecting";

export interface WebSocketConfig {
  url: string;
  channels?: string[];
  pingInterval?: number;
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

export interface WebSocketReturn {
  status: WebSocketStatus;
  sendMessage: (message: any) => void;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  reconnect: () => void;
  close: () => void;
}

export function useWebSocket(config: WebSocketConfig): WebSocketReturn {
  const {
    url,
    channels = [],
    pingInterval = WEBSOCKET_CONFIG.PING_INTERVAL,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectAttempts = WEBSOCKET_CONFIG.RECONNECT.MAX_ATTEMPTS,
    reconnectDelay = WEBSOCKET_CONFIG.RECONNECT.DELAY,
  } = config;

  const [status, setStatus] = useState<WebSocketStatus>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const subscribedChannelsRef = useRef<Set<string>>(new Set());
  const isReconnectingRef = useRef(false);
  const lastDisconnectTimeRef = useRef<number>(0);
  const connectionStartTimeRef = useRef<number>(0);
  const consecutiveFailuresRef = useRef(0);

  const cleanup = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const startPingInterval = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    pingIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ event: WEBSOCKET_CONFIG.EVENTS.PING })
        );
      }
    }, pingInterval);
  }, [pingInterval]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected. Cannot send message:", message);
    }
  }, []);
  const subscribe = useCallback(
    (channel: string) => {
      subscribedChannelsRef.current.add(channel);
      sendMessage({
        event: WEBSOCKET_CONFIG.EVENTS.SUBSCRIBE,
        data: { channel },
      });
    },
    [sendMessage]
  );

  const unsubscribe = useCallback(
    (channel: string) => {
      subscribedChannelsRef.current.delete(channel);
      sendMessage({
        event: WEBSOCKET_CONFIG.EVENTS.UNSUBSCRIBE,
        data: { channel },
      });
    },
    [sendMessage]
  );
  const connect = useCallback(() => {
    try {
      cleanup();
      setStatus("connecting");
      connectionStartTimeRef.current = Date.now();

      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onopen = () => {
        console.log("WebSocket connection opened");
        setStatus("connected");
        reconnectCountRef.current = 0;
        isReconnectingRef.current = false;
        consecutiveFailuresRef.current = 0;

        // Re-subscribe to all channels
        subscribedChannelsRef.current.forEach((channel) => {
          subscribe(channel);
        });

        startPingInterval();
        onOpen?.();
      };
      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setStatus("disconnected");

        const now = Date.now();
        const connectionDuration = now - connectionStartTimeRef.current;
        lastDisconnectTimeRef.current = now;

        // Check if connection was stable (lasted longer than threshold)
        const wasStableConnection =
          connectionDuration > WEBSOCKET_CONFIG.TIMEOUTS.STABILITY_THRESHOLD;

        if (!wasStableConnection) {
          consecutiveFailuresRef.current++;
          console.log(
            `Unstable connection detected (${connectionDuration}ms). Consecutive failures: ${consecutiveFailuresRef.current}`
          );
        } else {
          consecutiveFailuresRef.current = 0;
        }

        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        onClose?.();

        // Prevent rapid reconnection attempts with debouncing
        if (isReconnectingRef.current) {
          return;
        }

        // Only attempt reconnection if we haven't exceeded the limit
        if (reconnectCountRef.current < reconnectAttempts) {
          isReconnectingRef.current = true;
          reconnectCountRef.current++;

          // Apply additional delay for unstable connections
          const baseDelay =
            reconnectDelay *
            Math.pow(
              WEBSOCKET_CONFIG.RECONNECT.BACKOFF_MULTIPLIER,
              reconnectCountRef.current - 1
            );
          const stabilityPenalty = consecutiveFailuresRef.current * 5000; // 5 seconds per consecutive failure
          const totalDelay = Math.min(
            baseDelay + stabilityPenalty,
            WEBSOCKET_CONFIG.RECONNECT.MAX_DELAY
          );

          console.log(
            `Attempting to reconnect in ${totalDelay}ms... (${reconnectCountRef.current}/${reconnectAttempts}) [Consecutive failures: ${consecutiveFailuresRef.current}]`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            // Double-check we still want to reconnect (prevent race conditions)
            if (
              Date.now() - lastDisconnectTimeRef.current >=
              totalDelay - 1000
            ) {
              isReconnectingRef.current = false;
              connect();
            }
          }, totalDelay);
        } else {
          console.log(
            "Max reconnection attempts reached. Stopping reconnection."
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);
          onMessage?.(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        onError?.(error);
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      setStatus("disconnected");
    }
  }, [
    url,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectAttempts,
    reconnectDelay,
    cleanup,
    startPingInterval,
    subscribe,
  ]);
  const reconnect = useCallback(() => {
    reconnectCountRef.current = 0;
    consecutiveFailuresRef.current = 0;
    isReconnectingRef.current = false;
    connect();
  }, [connect]);

  const close = useCallback(() => {
    reconnectCountRef.current = reconnectAttempts; // Prevent auto-reconnection
    cleanup();
    setStatus("disconnected");
  }, [cleanup, reconnectAttempts]);

  useEffect(() => {
    connect();

    // Subscribe to initial channels
    channels.forEach((channel) => {
      subscribedChannelsRef.current.add(channel);
    });

    return cleanup;
  }, []);

  return {
    status,
    sendMessage,
    subscribe,
    unsubscribe,
    reconnect,
    close,
  };
}
