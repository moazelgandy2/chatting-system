import { ClientPackageItem } from "./packages";

export type ChatData = {
  id: number;
  name: string;
  description: string;
  client_id: number;
  created_at: string | null;
  updated_at: string | null;
};

export type ChatResponse = {
  status: boolean;
  errorNum: number;
  message: string;
  data: ChatData[];
};

export type SingleChatResponse = {
  status: boolean;
  errorNum: number;
  message: string;
  data: ChatData;
};

export type ChatMessageSender = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MediaFile = {
  url: string;
  type: string;
  name?: string;
};

export type ChatMessage = {
  id: number;
  chat_id: number;
  sender_id: number;
  message: string;
  file_path: string | null;
  created_at: string;
  updated_at: string;
  client_package_item_id: number | null;
  client_package_item?: ClientPackageItem | null;
  sender: ChatMessageSender;
  media_files?: any[]; // Raw file data from API
  media?: MediaFile[]; // Processed URLs for display
};

export type ChatMessagesApiResponse = {
  status: boolean;
  errorNum: number;
  message: string;
  data: {
    current_page: number;
    per_page: number;
    total: number;
    data: ChatMessage[];
  };
};

// WebSocket event types
export type NewMessageEventData = {
  id: number;
  chat_id: string | number;
  sender_id: string | number;
  message: string;
  media_files?: any[];
  created_at: string;
};

export type WebSocketMessageEvent = {
  event: string;
  data: NewMessageEventData | string;
  channel: string;
};
