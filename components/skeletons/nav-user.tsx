"use client";

import { ChevronsUpDown } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavUserSkeleton() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Skeleton className="h-8 w-8 rounded-lg" />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center justify-between flex-row-reverse gap-2 truncate text-sm leading-tight">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="w-24 h-3 mt-1" />
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* The dropdown content is not rendered in skeleton state */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
