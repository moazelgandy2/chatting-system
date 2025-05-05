"use client";

import { ChevronRight, Loader2, UserIcon, type LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link, { useLinkStatus } from "next/link";

function LinkStatus() {
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

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      icon: LucideIcon;
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
          >
            <SidebarMenuItem className="relative">
              <SidebarMenuButton
                asChild
                tooltip={item.title}
              >
                <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer">
                  <item.icon />
                  <span>{item.title}</span>
                </CollapsibleTrigger>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />

                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <subItem.icon className="w-2 h-2" />
                              <span>{subItem.title}</span>
                              <LinkStatus />
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
