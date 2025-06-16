"use client";

import {
  ChevronRight,
  MessageSquare,
  Package2Icon,
  Wrench,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "../ui/sidebar";
import { UserFormDialog } from "./create-user";
import { ChatFormDialog } from "./create-chat";
import { AssignTeamDialog } from "./assign-team";
import Link from "next/link";
import { ItemTypesNav } from "./item-types-nav";
import { useTranslations } from "next-intl";
import { LinkStatus } from "./nav-main";

export const AdminNav = () => {
  const t = useTranslations();
  return (
    <Collapsible
      className="group/collapsible"
      defaultOpen={true}
    >
      <SidebarMenuItem className="relative">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip="test">
            <Wrench />
            <span>{t("dashboard.navigation.admin.title")}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuItem>
              <ChatFormDialog />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <UserFormDialog />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <AssignTeamDialog />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <ItemTypesNav />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuSubButton className="cursor-pointer">
                <Link
                  className="w-full flex items-center gap-2"
                  href={"/packages"}
                >
                  <Package2Icon className="w-3 h-3" />
                  <span>{t("dashboard.navigation.admin.packages")}</span>
                  <LinkStatus />
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
