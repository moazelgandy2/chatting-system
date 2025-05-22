"use client";

import {
  ChevronRight,
  Loader2,
  MessageSquare,
  MessageSquareOff,
  MoreHorizontal,
  Trash2,
  UserIcon,
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
    <>
      <Collapsible
        asChild
        defaultOpen={true}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="test">
              <MessageSquare />
              <span>{t("chat.available.title")}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {hasChats ? (
                chats.map((chat: ChatData) => (
                  <SidebarMenuSubItem key={chat.id}>
                    <SidebarMenuSubButton>
                      <Link
                        className="w-full text-xs"
                        href={`/chats/${chat.id}`}
                      >
                        {chat.name}
                        <LinkStatus />
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
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
    </>
  );
}

{
  /* <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild>
                  <a href={"/packages"}>
                    <span>nav</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent> */
}
