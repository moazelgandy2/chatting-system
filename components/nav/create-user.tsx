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

import { UserPlus } from "lucide-react";
import { UserForm } from "../create-user-form";
import { UserFormType } from "@/forms/creat-user.schema";
import { useCreateUser } from "@/hooks/use-create-user";
import { SidebarMenu, SidebarMenuButton } from "../ui/sidebar";

export function UserFormDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreateUser();

  const handleSubmit = async (data: UserFormType) => {
    setError(null);
    try {
      await mutateAsync(data);
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
        <SidebarMenuButton className="cursor-pointer transition-all duration-300">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            Create User
          </DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user account.
          </DialogDescription>
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
