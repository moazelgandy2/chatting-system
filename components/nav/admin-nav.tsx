"use client";

import { ChevronRight, MessageSquare } from "lucide-react";
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
} from "../ui/sidebar";
import { UserFormDialog } from "./create-user";
import { ChatFormDialog } from "./create-chat";
import { AssignTeamDialog } from "./assign-team";

export const AdminNav = () => {
  return (
    <Collapsible defaultOpen>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <CollapsibleTrigger className="flex items-center w-full gap-2 text-left cursor-pointer">
            <MessageSquare className="h-4 w-4" />
            <span>Settings</span>
          </CollapsibleTrigger>
        </SidebarMenuButton>
        <CollapsibleTrigger asChild>
          <SidebarMenuAction className="data-[state=open]:rotate-90">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Toggle Admin Section</span>
          </SidebarMenuAction>
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
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};
