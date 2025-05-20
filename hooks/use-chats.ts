"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchChats } from "@/actions/chats";
import { ChatResponse } from "@/types/chats";

export const CHATS_QUERY_KEY = "chats";

export function useChats() {
  return useQuery<ChatResponse>({
    queryKey: [CHATS_QUERY_KEY],
    queryFn: fetchChats,
  });
}

export function useChatsRevalidate() {
  const queryClient = useQueryClient();
  const revalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [CHATS_QUERY_KEY],
    });
  };

  return revalidate;
}
