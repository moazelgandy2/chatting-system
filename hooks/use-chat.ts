"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchChat,
  sendMessage,
  sendMessageWithFiles,
  createChat,
  assignTeamToChat,
  deleteChat,
  SendMessageWithFilesData,
} from "@/actions/chats";
import { ChatMessagesApiResponse, ChatMessage } from "@/types/chats";
import { CHATS_QUERY_KEY } from "@/hooks/use-chats";
import { USERS_QUERY_KEY } from "./use-create-user";

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

export function useSendMessage(
  chatId: string | number,
  page: number = 1,
  senderId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (message: string) => sendMessage(chatId.toString(), message),
    onMutate: async (message: string) => {
      await queryClient.cancelQueries({
        queryKey: [CHATS_QUERY_KEY, chatId, page],
      });
      const previousMessages = queryClient.getQueryData<any>([
        CHATS_QUERY_KEY,
        chatId,
        page,
      ]);
      queryClient.setQueryData([CHATS_QUERY_KEY, chatId, page], (old: any) => {
        if (!old || !old.data || !Array.isArray(old.data.data)) return old;
        const optimisticMsg = {
          id: `optimistic-${Date.now()}`,
          message,
          sender_id: senderId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          sender: { name: "You" },
          media: [], // Empty media array for text-only messages
        };
        return {
          ...old,
          data: {
            ...old.data,
            data: [...old.data.data, optimisticMsg],
          },
        };
      });
      return { previousMessages };
    },
    onError: (err, message, context: any) => {
      queryClient.setQueryData(
        [CHATS_QUERY_KEY, chatId, page],
        context?.previousMessages
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [CHATS_QUERY_KEY, chatId, page],
      });
    },
  });
}

export function useSendMessageWithFiles(
  chatId: string | number,
  page: number = 1,
  senderId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<SendMessageWithFilesData, "senderId">) =>
      sendMessageWithFiles(chatId.toString(), {
        ...data,
        senderId: senderId.toString(),
      }),
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: [CHATS_QUERY_KEY, chatId, page],
      });
      const previousMessages = queryClient.getQueryData<any>([
        CHATS_QUERY_KEY,
        chatId,
        page,
      ]);

      // Create preview URLs for optimistic UI
      const optimisticMedia: any[] = [];
      const previewUrls: string[] = [];

      if (data.media && data.media.length > 0) {
        data.media.forEach((file, index) => {
          if (file.type.startsWith("image/")) {
            const previewUrl = URL.createObjectURL(file);
            previewUrls.push(previewUrl);
            optimisticMedia.push({
              url: previewUrl,
              type: file.type,
              name: file.name,
              isOptimistic: true, // Flag to identify preview URLs
            });
          } else {
            // For non-image files, we can't create a preview but still show the file
            optimisticMedia.push({
              url: "", // No preview for non-images
              type: file.type,
              name: file.name,
              isOptimistic: true,
            });
          }
        });
      }

      queryClient.setQueryData([CHATS_QUERY_KEY, chatId, page], (old: any) => {
        if (!old || !old.data || !Array.isArray(old.data.data)) return old;
        const optimisticMsg = {
          id: `optimistic-${Date.now()}`,
          message: data.message,
          sender_id: senderId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          sender: { name: "You" },
          media: optimisticMedia,
          _previewUrls: previewUrls, // Store URLs for cleanup
        };
        return {
          ...old,
          data: {
            ...old.data,
            data: [...old.data.data, optimisticMsg],
          },
        };
      });
      return { previousMessages, previewUrls };
    },
    onError: (err, data, context: any) => {
      // Clean up preview URLs on error
      if (context?.previewUrls) {
        context.previewUrls.forEach((url: string) => {
          URL.revokeObjectURL(url);
        });
      }

      queryClient.setQueryData(
        [CHATS_QUERY_KEY, chatId, page],
        context?.previousMessages
      );
    },
    onSettled: () => {
      // Clean up any remaining preview URLs
      const currentData = queryClient.getQueryData<any>([
        CHATS_QUERY_KEY,
        chatId,
        page,
      ]);
      if (currentData?.data?.data) {
        currentData.data.data.forEach((message: any) => {
          if (message._previewUrls) {
            message._previewUrls.forEach((url: string) => {
              URL.revokeObjectURL(url);
            });
          }
        });
      }

      queryClient.invalidateQueries({
        queryKey: [CHATS_QUERY_KEY, chatId, page],
      });
    },
  });
}

export function useChatRevalidate(chatId: string) {
  const queryClient = useQueryClient();
  const revalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [CHATS_QUERY_KEY, chatId],
    });
  };

  return revalidate;
}

export function useCreateChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      showNotification("Chat created successfully!", "success");
    },
  });
}

export function useAssignTeamToChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignTeamToChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });
      showNotification("Chat assigned successfully!", "success");
    },
  });
}

import { useTranslations } from "next-intl";
import { showNotification } from "@/lib/show-notification";

export function useDeleteChat() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });
      if (typeof showNotification !== "undefined") {
        showNotification(t("chat.notifications.deletedSuccess"), "success");
      }
    },
    onError: (error: Error) => {
      if (typeof showNotification !== "undefined") {
        showNotification(
          error.message || t("chat.notifications.deletedError"),
          "error"
        );
      }
      console.error("Error deleting chat:", error);
    },
  });

  return mutation;
}
