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

import { MessageCirclePlus, UserPlus } from "lucide-react";
import { UserForm } from "../create-user-form";
import { UserFormType } from "@/forms/create-user.schema";
import { useCreateUser } from "@/hooks/use-create-user";
import {
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { ChatForm } from "../create-chat-form";
import { useCreateChat } from "@/hooks/use-chat";

export function ChatFormDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreateChat();

  const handleSubmit = async (data: { client_id: number; name: string }) => {
    setError(null);
    try {
      await mutateAsync({
        client_id: data.client_id,
        name: data.name,
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
        <SidebarMenuSubItem>
          <SidebarMenuSubButton className="cursor-pointer">
            <MessageCirclePlus className="w-3 h-3" />
            <span>Add Chat</span>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
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
