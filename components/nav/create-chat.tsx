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

import { ChatForm } from "../create-chat-form";
import { useCreateChat } from "@/hooks/use-chat";
import { useTranslations } from "next-intl";

export function ChatFormDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreateChat();
  const t = useTranslations("chat");

  const handleSubmit = async (data: {
    client_id: number;
    name: string;
    description: string;
  }) => {
    setError(null);
    try {
      await mutateAsync({
        client_id: data.client_id,
        name: data.name,
        description: data.description,
      });
      setOpen(false);
    } catch (e: any) {
      setError(e?.message || "Something went wrong!");
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
            Create Chat
          </DialogTitle>
          <DialogDescription>
            Select a user to start a new chat.
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
