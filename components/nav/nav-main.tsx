"use client";

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useLinkStatus } from "next/link";
import { PackagesNavItem } from "./packages-nav-item";
import { ChatsNavItem } from "./chats-nav-item";
import { AdminNav } from "./admin-nav";
import { useAuth } from "@/hooks/useAuth";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronRight, UserIcon } from "lucide-react";

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
  const { session } = useAuth();
  return (
    <SidebarGroup>
      {session?.user.role === "admin" && (
        <>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
          <SidebarMenu>
            <AdminNav />
          </SidebarMenu>
        </>
      )}
      <SidebarMenu>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <ChatsNavItem />
        {session?.user.role === "admin" && <PackagesNavItem />}
      </SidebarMenu>
    </SidebarGroup>
  );
}
