"use client";
import { useCreatePackageItemType } from "@/hooks/use-package-items";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar";
import { FileStack } from "lucide-react";
import { CreatePackageTypeForm } from "../create-package-type-form";
import { useState } from "react";
import { PackageTypeFormType } from "@/forms/create-package-type";

export const ItemTypesNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useCreatePackageItemType();
  const t = useTranslations("chat.itemTypesNav"); // Updated namespace

  const handleSubmit = (values: PackageTypeFormType) => {
    mutate(values, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <SidebarMenuSubItem>
          <SidebarMenuSubButton className="cursor-pointer">
            <FileStack className="w-3 h-3" />
            <span>{t("addPackageTypeButton")}</span>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("dialogTitle")}</DialogTitle>
          <DialogDescription>
            <p className="text-sm text-muted-foreground">
              {t("dialogDescription")}
            </p>
          </DialogDescription>
        </DialogHeader>
        <CreatePackageTypeForm
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
