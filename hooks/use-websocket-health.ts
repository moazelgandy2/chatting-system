import { useState, useEffect, useCallback } from "react";
import { WebSocketStatus } from "./use-websocket";

interface WebSocketHealth {
  isHealthy: boolean;
  latency: number | null;
  connectionUptime: number;
  reconnectCount: number;
  lastMessageTime: Date | null;
  messagesReceived: number;
  messagesSent: number;
}

interface UseWebSocketHealthConfig {
  status: WebSocketStatus;
  onHealthChange?: (health: WebSocketHealth) => void;
  pingInterval?: number;
}

export function useWebSocketHealth({
  status,
  onHealthChange,
  pingInterval = 30000,
}: UseWebSocketHealthConfig) {
  const [health, setHealth] = useState<WebSocketHealth>({
    isHealthy: false,
    latency: null,
    connectionUptime: 0,
    reconnectCount: 0,
    lastMessageTime: null,
    messagesReceived: 0,
    messagesSent: 0,
  });

  const [connectionStartTime, setConnectionStartTime] = useState<Date | null>(
    null
  );
  const [lastPingTime, setLastPingTime] = useState<Date | null>(null);

  // Track connection status changes
  useEffect(() => {
    if (status === "connected") {
      if (!connectionStartTime) {
        setConnectionStartTime(new Date());
      }
    } else if (status === "disconnected") {
      setConnectionStartTime(null);
      setLastPingTime(null);
      setHealth((prev) => ({
        ...prev,
        isHealthy: false,
        latency: null,
        connectionUptime: 0,
        reconnectCount: prev.reconnectCount + (prev.isHealthy ? 1 : 0),
      }));
    }
  }, [status, connectionStartTime]);

  // Update uptime periodically
  useEffect(() => {
    if (status !== "connected" || !connectionStartTime) return;

    const interval = setInterval(() => {
      const uptime = Date.now() - connectionStartTime.getTime();
      setHealth((prev) => ({
        ...prev,
        connectionUptime: uptime,
        isHealthy: status === "connected" && uptime > 1000, // Consider healthy after 1 second
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [status, connectionStartTime]);

  // Measure latency with ping/pong
  const measureLatency = useCallback(() => {
    if (status === "connected") {
      setLastPingTime(new Date());
      // Note: In a real implementation, you'd send a ping and measure the pong response
      // This is a simplified version
      setTimeout(() => {
        if (lastPingTime) {
          const latency = Date.now() - lastPingTime.getTime();
          setHealth((prev) => ({
            ...prev,
            latency,
          }));
        }
      }, 100); // Simulated latency
    }
  }, [status, lastPingTime]);

  // Periodic latency measurement
  useEffect(() => {
    if (status !== "connected") return;

    const interval = setInterval(measureLatency, pingInterval);
    return () => clearInterval(interval);
  }, [status, measureLatency, pingInterval]);

  // Track message counts
  const incrementMessagesSent = useCallback(() => {
    setHealth((prev) => ({
      ...prev,
      messagesSent: prev.messagesSent + 1,
    }));
  }, []);

  const incrementMessagesReceived = useCallback(() => {
    setHealth((prev) => ({
      ...prev,
      messagesReceived: prev.messagesReceived + 1,
      lastMessageTime: new Date(),
    }));
  }, []);

  // Notify about health changes
  useEffect(() => {
    onHealthChange?.(health);
  }, [health, onHealthChange]);

  // Reset counters when connection is established
  useEffect(() => {
    if (status === "connected" && connectionStartTime) {
      setHealth((prev) => ({
        ...prev,
        messagesReceived: 0,
        messagesSent: 0,
        lastMessageTime: null,
      }));
    }
  }, [status, connectionStartTime]);

  return {
    health,
    incrementMessagesSent,
    incrementMessagesReceived,
    measureLatency,
  };
}
