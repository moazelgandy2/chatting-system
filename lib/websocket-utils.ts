import { WEBSOCKET_CONFIG } from "./websocket-config";

/**
 * WebSocket message types for type safety
 */
export interface WebSocketMessage {
  event: string;
  data?: any;
  channel?: string;
  timestamp?: number;
}

/**
 * Create a standardized WebSocket message
 */
export function createWebSocketMessage(
  event: string,
  data?: any,
  channel?: string
): WebSocketMessage {
  return {
    event,
    data,
    channel,
    timestamp: Date.now(),
  };
}

/**
 * Create a subscription message for a channel
 */
export function createSubscribeMessage(channel: string): WebSocketMessage {
  return createWebSocketMessage(WEBSOCKET_CONFIG.EVENTS.SUBSCRIBE, { channel });
}

/**
 * Create an unsubscription message for a channel
 */
export function createUnsubscribeMessage(channel: string): WebSocketMessage {
  return createWebSocketMessage(WEBSOCKET_CONFIG.EVENTS.UNSUBSCRIBE, {
    channel,
  });
}

/**
 * Create a ping message
 */
export function createPingMessage(): WebSocketMessage {
  return createWebSocketMessage(WEBSOCKET_CONFIG.EVENTS.PING);
}

/**
 * Validate if a message is a valid WebSocket message
 */
export function isValidWebSocketMessage(
  message: any
): message is WebSocketMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    typeof message.event === "string"
  );
}

/**
 * Parse WebSocket message safely
 */
export function parseWebSocketMessage(data: string): WebSocketMessage | null {
  try {
    const parsed = JSON.parse(data);
    return isValidWebSocketMessage(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Serialize WebSocket message
 */
export function serializeWebSocketMessage(message: WebSocketMessage): string {
  return JSON.stringify(message);
}

/**
 * Check if a WebSocket is in a ready state
 */
export function isWebSocketReady(ws: WebSocket | null): boolean {
  return ws !== null && ws.readyState === WebSocket.OPEN;
}

/**
 * Get WebSocket ready state as string
 */
export function getWebSocketReadyState(ws: WebSocket | null): string {
  if (!ws) return "null";

  switch (ws.readyState) {
    case WebSocket.CONNECTING:
      return "connecting";
    case WebSocket.OPEN:
      return "open";
    case WebSocket.CLOSING:
      return "closing";
    case WebSocket.CLOSED:
      return "closed";
    default:
      return "unknown";
  }
}

/**
 * Create a channel name for chat
 */
export function createChatChannelName(chatId: string): string {
  return WEBSOCKET_CONFIG.CHANNELS.CHAT(chatId);
}

/**
 * Create a channel name for user
 */
export function createUserChannelName(userId: string): string {
  return WEBSOCKET_CONFIG.CHANNELS.USER(userId);
}

/**
 * Extract chat ID from channel name
 */
export function extractChatIdFromChannel(channel: string): string | null {
  const match = channel.match(/^chat\.(.+)$/);
  return match ? match[1] : null;
}

/**
 * Extract user ID from channel name
 */
export function extractUserIdFromChannel(channel: string): string | null {
  const match = channel.match(/^user\.(.+)$/);
  return match ? match[1] : null;
}

/**
 * Calculate reconnection delay with exponential backoff
 */
export function calculateReconnectDelay(attempt: number): number {
  const delay =
    WEBSOCKET_CONFIG.RECONNECT.DELAY *
    Math.pow(WEBSOCKET_CONFIG.RECONNECT.BACKOFF_MULTIPLIER, attempt - 1);

  return Math.min(delay, WEBSOCKET_CONFIG.RECONNECT.MAX_DELAY);
}

/**
 * WebSocket event emitter for custom events
 */
export class WebSocketEventEmitter {
  private listeners: Map<string, Set<Function>> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(
            `Error in WebSocket event listener for ${event}:`,
            error
          );
        }
      });
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }
}

/**
 * Debounce function for WebSocket operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for WebSocket operations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Process media files from WebSocket message data
 */
export function processMediaFiles(
  mediaFiles: any[]
): { url: string; type: string; name?: string }[] {
  if (!mediaFiles || !Array.isArray(mediaFiles)) {
    return [];
  }

  return mediaFiles.map((file) => ({
    url: file.url || file.path || "",
    type: file.type || file.mime_type || "unknown",
    name: file.name || file.filename || undefined,
  }));
}

/**
 * Validate WebSocket message data for NewMessageEvent
 */
export function validateNewMessageData(data: any): boolean {
  return (
    data &&
    typeof data === "object" &&
    data.id &&
    data.chat_id &&
    data.sender_id &&
    data.message &&
    data.created_at
  );
}

/**
 * Extract sender information from WebSocket message or create default
 */
export function extractSenderInfo(data: any, defaultId?: number) {
  const senderId = parseInt(
    data.sender_id?.toString() || defaultId?.toString() || "0"
  );

  return {
    id: senderId,
    name: data.sender_name || data.sender?.name || "Unknown",
    email: data.sender_email || data.sender?.email || "",
    email_verified_at: data.sender?.email_verified_at || null,
    created_at: data.created_at,
    updated_at: data.created_at,
  };
}
