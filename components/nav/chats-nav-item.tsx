"use client";

import { ChevronRight, Loader2, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { useChats } from "@/hooks/use-chats";
import { ChatData } from "@/types/chats";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
          <MessageSquare />
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
  const hasChats = !chatsError && chats && chats.length > 0;
  const t = useTranslations("chat");
  if (chatsLoading) {
    return <ChatsNavItemSkeleton />;
  }

  if (chatsError && !hasChats) {
    return null;
  }

  return (
    <Collapsible
      asChild
      defaultOpen
    >
      <SidebarMenuItem className="relative">
        <SidebarMenuButton
          asChild
          tooltip={t("available.title")}
        >
          <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer">
            <MessageSquare />
            <span>{t("available.title")}</span>
          </CollapsibleTrigger>
        </SidebarMenuButton>
        <CollapsibleTrigger asChild>
          <SidebarMenuAction className="data-[state=open]:rotate-90">
            <ChevronRight />
            <span className="sr-only">Toggle</span>
          </SidebarMenuAction>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {hasChats ? (
              chats.map((chat: ChatData) => (
                <SidebarMenuSubItem key={chat.id}>
                  <SidebarMenuSubButton asChild>
                    <Link
                      href={`/chats/${chat.id}`}
                      prefetch={false}
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat #{chat.id}</span>
                      <LinkStatus />
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))
            ) : (
              <div className="py-2 text-center text-xs text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t("available.noResults")}</span>
              </div>
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
