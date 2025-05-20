"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { useLinkStatus } from "next/link";
import { PackagesNavItem } from "./packages-nav-item";
import { ChatsNavItem } from "./chats-nav-item";
import { UserFormDialog } from "./create-user";
import { ChatFormDialog } from "./create-chat";
import { AdminNav } from "./admin-nav";
import { AssignTeamDialog } from "./assign-team";

export function LinkStatus() {
  const { pending } = useLinkStatus();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!pending) {
      setProgress(0);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [pending]);

  return pending ? (
    <div className="absolute bottom-0 left-0 right-0 w-full">
      <Progress value={progress} />
    </div>
  ) : null;
}

export function NavMain() {
  const [selectedChatId, setSelectedChatId] = useState(1);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        <AdminNav />
      </SidebarMenu>
      <SidebarMenu>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <ChatsNavItem />
        <PackagesNavItem />
      </SidebarMenu>
    </SidebarGroup>
  );
}
