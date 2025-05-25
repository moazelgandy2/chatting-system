"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Package,
  Clock,
  MessageCircle,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAssignedPackages } from "@/hooks/use-assign-package";
import { useChat } from "@/hooks/use-chat";

interface AdminStatusProps {
  chatId: string;
}

export function AdminStatus({ chatId }: AdminStatusProps) {
  const t = useTranslations();
  const { data: assignedPackagesResponse, isLoading: isLoadingPackages } =
    useAssignedPackages(chatId);
  const { data: chatResponse, isLoading: isLoadingChat } = useChat(chatId, 1);

  const assignedPackage = assignedPackagesResponse?.data;
  const chatData = chatResponse?.data;

  if (isLoadingPackages || isLoadingChat) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("adminStatus.loading", { default: "Loading status..." })}
      </div>
    );
  }
  const getPackageStatus = () => {
    if (!assignedPackage) {
      return {
        status: "none",
        text: t("adminStatus.noPackage", { default: "No Package" }),
        variant: "secondary" as "secondary",
        icon: <AlertCircle className="h-3 w-3" />,
      };
    }

    return {
      status: assignedPackage.status,
      text:
        assignedPackage.status === "active"
          ? t("adminStatus.activePackage", { default: "Active Package" })
          : t("adminStatus.inactivePackage", { default: "Inactive Package" }),
      variant: (assignedPackage.status === "active"
        ? "default"
        : "secondary") as "default" | "secondary",
      icon:
        assignedPackage.status === "active" ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <AlertCircle className="h-3 w-3" />
        ),
    };
  };

  const packageStatus = getPackageStatus();
  const messageCount = chatData?.data?.length || 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          {t("adminStatus.chatId", { default: "Chat" })} #{chatId}
        </span>
      </div>

      <div className="h-4 w-px bg-border" />

      <Badge
        variant={packageStatus.variant}
        className="gap-1 text-xs"
      >
        {packageStatus.icon}
        {packageStatus.text}
      </Badge>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <MessageCircle className="h-4 w-4" />
        <span>
          {messageCount} {t("adminStatus.messages", { default: "messages" })}
        </span>
      </div>

      {assignedPackage && (
        <>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>
              {t("adminStatus.packageId", { default: "Package" })} #
              {assignedPackage.package_id}
            </span>
          </div>
        </>
      )}

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="text-xs">
          {new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
