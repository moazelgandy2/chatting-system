export const WEBSOCKET_CONFIG = {
  // Default WebSocket URL - can be overridden by environment variable
  DEFAULT_URL:
    process.env.NEXT_PUBLIC_WEBSOCKET_URL ||
    "wss://ws.droplo.cloud/app/980e9rlf318lalrzdks4",

  // Ping interval to keep connection alive (29 seconds)
  PING_INTERVAL: 29000,

  // Reconnection settings
  RECONNECT: {
    MAX_ATTEMPTS: 5,
    DELAY: 2000, // Initial delay in milliseconds
    BACKOFF_MULTIPLIER: 1.5, // Exponential backoff multiplier
    MAX_DELAY: 30000, // Maximum delay between reconnection attempts
  },

  // Event types
  EVENTS: {
    PING: "ping",
    PONG: "pong",
    SUBSCRIBE: "pusher:subscribe",
    UNSUBSCRIBE: "pusher:unsubscribe",
    MESSAGE: "message",
    CHAT_MESSAGE: "chat.message",
    USER_JOINED: "user.joined",
    USER_LEFT: "user.left",
    TYPING_START: "typing.start",
    TYPING_STOP: "typing.stop",
  },

  // Channel patterns
  CHANNELS: {
    CHAT: (chatId: string) => `chat.${chatId}`,
    USER: (userId: string) => `user.${userId}`,
    GLOBAL: "global",
    ADMIN: "admin",
  },

  // Message size limits
  LIMITS: {
    MAX_MESSAGE_SIZE: 1024 * 1024, // 1MB
    MAX_QUEUE_SIZE: 100, // Maximum number of queued messages
  },

  // Timeout settings
  TIMEOUTS: {
    CONNECTION_TIMEOUT: 10000, // 10 seconds
    MESSAGE_TIMEOUT: 5000, // 5 seconds
    PING_TIMEOUT: 30000, // 30 seconds
  },

  // Development settings
  DEBUG: {
    ENABLED: process.env.NODE_ENV === "development",
    LOG_MESSAGES: process.env.NODE_ENV === "development",
    LOG_EVENTS: process.env.NODE_ENV === "development",
  },
} as const;

export type WebSocketEventType = keyof typeof WEBSOCKET_CONFIG.EVENTS;
export type WebSocketChannelType = keyof typeof WEBSOCKET_CONFIG.CHANNELS;
