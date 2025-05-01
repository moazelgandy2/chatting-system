"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  ImageIcon,
  LifeBuoy,
  Map,
  MessageSquare,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Chats",
      url: "#",
      icon: MessageSquare,
      isActive: true,
      items: [
        {
          title: "Chat 1",
          url: "#",
        },
        {
          title: "Chat 2",
          url: "#",
        },
        {
          title: "Chat 3",
          url: "#",
        },
      ],
    },
    {
      title: "Media",
      url: "#",
      icon: ImageIcon,
      isActive: true,
      items: [
        {
          title: "Package 1",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="inset"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
            >
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg border text-sidebar-primary-foreground">
                  <Image
                    src={"/logo.png"}
                    alt="Logo"
                    width={46}
                    height={46}
                    className="size-6"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Marketopia</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full px-2">
          <NavMain items={data.navMain} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
        />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
