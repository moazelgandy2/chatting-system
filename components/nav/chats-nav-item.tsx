"use client";

import {
  ChevronRight,
  Loader2,
  MessageSquare,
  MessageSquareOff,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useChats } from "@/hooks/use-chats";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteChat } from "@/hooks/use-chat";
import { ChatData } from "@/types/chats";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { LinkStatus } from "@/components/nav/nav-main";

export function ChatsNavItemSkeleton() {
  const t = useTranslations("chat");

  return (
    <SidebarMenuItem className="relative">
      <SidebarMenuButton tooltip={t("available.title")}>
        <div className="flex items-center gap-2 cursor-default">
          <MessageSquare className="w-4 h-4" />
          <span>{t("available.title")}</span>
        </div>
      </SidebarMenuButton>
      <div className="py-2 pl-8">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-2 py-1.5"
            >
              <div className="h-3 w-3 rounded-full bg-muted-foreground/20 animate-pulse" />
              <div className="h-3.5 w-24 rounded-md bg-muted-foreground/20 animate-pulse" />
            </div>
          ))}
      </div>
    </SidebarMenuItem>
  );
}

export function ChatsNavItem() {
  const { mutate } = useDeleteChat();
  const {
    data: chatsResponse,
    isLoading: chatsLoading,
    isError: chatsError,
  } = useChats();
  const chats = chatsResponse?.data || [];
  const t = useTranslations();
  const hasChats = !chatsError && chats && chats.length > 0;

  if (chatsLoading) {
    return <ChatsNavItemSkeleton />;
  }

  if (chatsError || !hasChats) {
    return (
      <SidebarMenuItem className="relative">
        <SidebarMenuButton tooltip={t("chat.available.noChats")}>
          <div className="flex items-center gap-2 cursor-default">
            <MessageSquareOff className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {t("chat.available.noChats")}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible defaultOpen={false}>
      <SidebarMenuItem className="relative">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={t("chat.available.title")}
            className="flex items-center w-full gap-2 text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>{t("chat.available.title")}</span>
            </div>
            <SidebarMenuAction className="ml-auto transition-transform duration-200 data-[state=open]:rotate-90">
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">Toggle</span>
            </SidebarMenuAction>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {hasChats ? (
              chats.map((chat: ChatData) => (
                <SidebarMenuItem
                  key={chat.id}
                  className="relative group"
                >
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href={`/chats/${chat.id}`}>
                        <MessageSquare className="w-3 h-3" />
                        <span className="truncate">{chat.name}</span>
                        <LinkStatus />
                      </Link>
                    </SidebarMenuSubButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction className="opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">More</span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600 hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-700/50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>{t("chat.available.delete")}</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("chat.available.confirmDelete")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("chat.available.deleteWarning")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("chat.available.cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => mutate(chat.id.toString())}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t("chat.available.confirm")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuSubItem>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="py-2 text-center text-xs text-muted-foreground">
                {t("chat.available.noChats")}
              </div>
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
