"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Menu, User, Package, MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ManageClientLimits } from "./manage-client-limits";
import { QuickActions } from "./quick-actions";
import { AssignPackageDialog } from "./assign-package-dialog";
import { ChatDeleteDialog } from "./chat-delete-dialog";
import { useAssignedPackages } from "@/hooks/use-assign-package";
import Card05 from "./quota-details-card";

interface MobileAdminDrawerProps {
  chatId: string;
  onDeleteChat: (id: string) => Promise<void>;
}

export function MobileAdminDrawer({
  chatId,
  onDeleteChat,
}: MobileAdminDrawerProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const { data: assignedPackagesResponse } = useAssignedPackages(chatId);
  const assignedPackage = assignedPackagesResponse?.data;

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="md:hidden fixed top-4 right-4 z-50 shadow-lg bg-background/95 backdrop-blur-sm"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">
            {t("adminPanel.openMobile", { default: "Open admin panel" })}
          </span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-[85vh]">
        <DrawerHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-left">
                {t("adminPanel.title", { default: "Admin Panel" })}
              </DrawerTitle>
              <DrawerDescription className="text-left">
                {t("adminPanel.description", {
                  default: "Manage packages, limits, and chat settings",
                })}
              </DrawerDescription>
            </div>

            <div className="flex items-center gap-2">
              {assignedPackage && (
                <Badge
                  variant={
                    assignedPackage.status === "active"
                      ? "default"
                      : "secondary"
                  }
                >
                  <Package className="h-3 w-3 mr-1" />
                  {assignedPackage.status === "active"
                    ? t("adminStatus.active", { default: "Active" })
                    : t("adminStatus.inactive", { default: "Inactive" })}
                </Badge>
              )}
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Chat Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">
                {t("adminPanel.chatInfo", { default: "Chat Information" })}
              </h3>
            </div>
            <div className="bg-card rounded-lg p-3 border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("adminPanel.chatId", { default: "Chat ID" })}
                </span>
                <span className="font-mono">#{chatId}</span>
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-semibold">
                {t("adminPanel.clientDetails", { default: "Client Details" })}
              </h3>
            </div>
            <Card05 />
          </div>

          {/* Package Management */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-orange-500" />
              <h3 className="text-sm font-semibold">
                {t("adminPanel.packageManagement", {
                  default: "Package Management",
                })}
              </h3>
            </div>
            <ManageClientLimits chatId={chatId} />
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <QuickActions chatId={chatId} />
          </div>

          {/* Admin Actions */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm font-semibold text-destructive">
              {t("adminPanel.dangerZone", { default: "Admin Actions" })}
            </h3>
            <div className="flex flex-col gap-2">
              {" "}
              <AssignPackageDialog
                chatId={chatId}
                trigger={
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    {t("assignPackage.buttonText", {
                      default: "Assign Package",
                    })}
                  </Button>
                }
              />
              <Button
                variant="destructive"
                size="sm"
                className="w-full justify-start"
                onClick={() => onDeleteChat(chatId)}
              >
                <X className="h-4 w-4 mr-2" />
                {t("deleteChat.buttonText", { default: "Delete Chat" })}
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
