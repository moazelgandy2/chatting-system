"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchChats } from "@/actions/chats";
import { ChatResponse } from "@/types/chats";

export const CHATS_QUERY_KEY = "chats";

export function useChats() {
  return useQuery<ChatResponse>({
    queryKey: [CHATS_QUERY_KEY],
    queryFn: fetchChats,
  });
}
