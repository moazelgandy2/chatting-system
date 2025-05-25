"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ChatDeleteDialogProps {
  chatId: string;
  onDeleteChat: (chatId: string) => void;
}

export const ChatDeleteDialog = ({
  chatId,
  onDeleteChat,
}: ChatDeleteDialogProps) => {
  const t = useTranslations();

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-red-600 rounded-3xl hover:bg-red-700 cursor-pointer">
          <Trash2 className=" h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("package.available.confirmDelete")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("package.available.deleteWarning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("package.available.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDeleteChat(chatId.toString())}
            className="bg-red-600 hover:bg-red-700"
          >
            {t("package.available.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
