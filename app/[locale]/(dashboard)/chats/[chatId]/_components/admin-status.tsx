"use client";

import { Badge } from "@/components/ui/badge";
import {
  User,
  Package,
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
  const assignedPackages = Array.isArray(assignedPackagesResponse?.data)
    ? assignedPackagesResponse.data
    : assignedPackagesResponse?.data
    ? [assignedPackagesResponse.data]
    : [];
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
    if (assignedPackages.length === 0) {
      return {
        status: "none",
        text: t("adminStatus.noPackage", { default: "No Package" }),
        variant: "secondary" as "secondary",
        icon: <AlertCircle className="h-3 w-3" />,
      };
    }

    const activePackages = assignedPackages.filter(
      (pkg) => pkg.status === "active"
    );
    if (activePackages.length > 0) {
      return {
        status: "active",
        text: t("adminStatus.activePackage", { default: "Active Package" }),
        variant: "default" as const,
        icon: <CheckCircle className="h-3 w-3" />,
      };
    }
    return {
      status: assignedPackages[0]?.status || "inactive",
      text: t("adminStatus.inactivePackage", { default: "Inactive Package" }),
      variant: "secondary" as "secondary",
      icon: <AlertCircle className="h-3 w-3" />,
    };
  };
  const packageStatus = getPackageStatus();
  const messageCount = chatData?.total || 0;

  return (
    <div className="space-y-3">
      {/* Simple Status Bar */}
      <div className="flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {messageCount}{" "}
              {t("adminStatus.messages", { default: "messages" })}
            </span>
          </div>
          {assignedPackages.length > 0 && (
            <>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {assignedPackages.length}{" "}
                  {t("adminStatus.packages", { default: "packages" })}
                </span>
              </div>
            </>
          )}{" "}
          {assignedPackages[0]?.client_id && (
            <>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {t("adminStatus.clientId", { default: "Client" })} #
                  {assignedPackages[0].client_id}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
