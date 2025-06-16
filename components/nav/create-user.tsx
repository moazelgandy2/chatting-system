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

import { MessageSquare, UserPlus } from "lucide-react";
import { UserForm } from "../create-user-form";
import { UserFormType } from "@/forms/create-user.schema";
import { useCreateUser } from "@/hooks/use-create-user";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function UserFormDialog() {
  const t = useTranslations("chat.userFormDialog");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreateUser();

  const handleSubmit = async (data: UserFormType) => {
    setError(null);
    try {
      await mutateAsync(data);
      setOpen(false);
    } catch (e: any) {
      setError(e?.message || t("error"));
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
            <UserPlus className="w-3 h-3" />
            <span>{t("addUser")}</span>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            {t("createUser")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <UserForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}
