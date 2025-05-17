"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchChat } from "@/actions/chats";
import { ChatMessagesApiResponse } from "@/types/chats";
import { CHATS_QUERY_KEY } from "@/hooks/use-chats";

export function useChat(chatId: string | number, page: number = 1) {
  const query = useQuery<ChatMessagesApiResponse>({
    queryKey: [CHATS_QUERY_KEY, chatId, page],
    queryFn: () => fetchChat(chatId.toString(), page),
    enabled: !!chatId,
  });

  return {
    ...query,
    mutate: query.refetch,
  };
}
