"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
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
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { createData } from "@/data";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const locale = useLocale();
  const t = useTranslations();
  const data = createData(t);

  const side = React.useMemo(
    () => (locale === "ar" ? "right" : "left"),
    [locale]
  );

  return (
    <Sidebar
      side={side}
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
              <Link href="/">
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
              </Link>
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
