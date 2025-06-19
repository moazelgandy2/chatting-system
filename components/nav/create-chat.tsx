"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { MessageCirclePlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ChatForm } from "../create-chat-form";
import { useCreateChat } from "@/hooks/use-chat";
import { useTranslations } from "next-intl";
import { ChatFormType } from "@/forms/create-chat.schema";
import { CHATS_QUERY_KEY } from "@/hooks/use-chats";

export function ChatFormDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreateChat();
  const t = useTranslations("chat");
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSubmit = async (data: ChatFormType) => {
    setError(null);
    try {
      await mutateAsync({
        client_id: data.client_id,
        name: data.name,
        description: data.description,
      });

      await queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });
      router.refresh();
      setOpen(false);
    } catch (e: any) {
      setError(e?.message || t("createChatDialog.genericError"));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <MessageCirclePlus className="w-3 h-3" />
          <span>{t("chats.createNew")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            {t("createChatDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("createChatDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <ChatForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}
