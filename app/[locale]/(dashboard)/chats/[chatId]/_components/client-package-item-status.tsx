"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Check,
  X,
  Clock,
  RotateCw,
  Truck,
  Package,
  AlertCircle,
  Edit3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useUpdateClientPackageItemStatus } from "@/hooks/use-assign-package";
import { ClientPackageItem } from "@/types/packages";

interface ClientPackageItemStatusProps {
  clientPackageItem?: ClientPackageItem | null;
  isCompact?: boolean;
}

const ClientPackageItemStatus = ({
  clientPackageItem: propClientPackageItem,
  isCompact = false,
}: ClientPackageItemStatusProps) => {
  const t = useTranslations("package");
  const updateStatusMutation = useUpdateClientPackageItemStatus();

  // Use only the provided prop, no API fetching
  const clientPackageItem = propClientPackageItem;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
          textColor: "text-blue-500",
          icon: <Clock className="w-3 h-3" />,
          label: t("status.pending", { default: "Pending" }),
        };
      case "in_progress":
        return {
          bgColor: "bg-amber-500/20",
          borderColor: "border-amber-500/30",
          textColor: "text-amber-500",
          icon: <RotateCw className="w-3 h-3" />,
          label: t("status.inProgress", { default: "In Progress" }),
        };
      case "completed":
        return {
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30",
          textColor: "text-green-500",
          icon: <Check className="w-3 h-3" />,
          label: t("status.completed", { default: "Completed" }),
        };
      case "declined":
        return {
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
          textColor: "text-red-500",
          icon: <X className="w-3 h-3" />,
          label: t("status.declined", { default: "Declined" }),
        };
      case "delivered":
        return {
          bgColor: "bg-purple-500/20",
          borderColor: "border-purple-500/30",
          textColor: "text-purple-500",
          icon: <Truck className="w-3 h-3" />,
          label: t("status.delivered", { default: "Delivered" }),
        };
      default:
        return {
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/30",
          textColor: "text-gray-500",
          icon: <AlertCircle className="w-3 h-3" />,
          label: t("status.unknown", { default: "Unknown" }),
        };
    }
  };
  const handleStatusUpdate = async (
    newStatus:
      | "pending"
      | "in_progress"
      | "completed"
      | "declined"
      | "delivered",
    notes?: string
  ) => {
    if (!clientPackageItem) {
      console.error("Cannot update status: No client package item available");
      return;
    }

    try {
      await updateStatusMutation.mutateAsync({
        clientPackageItemId: clientPackageItem.id,
        status: newStatus,
        notes,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // No data state
  if (!clientPackageItem) {
    return null;
  }

  const statusConfig = getStatusConfig(clientPackageItem.status);
  if (isCompact) {
    return (
      <div className="flex flex-col space-y-2 p-2 rounded-md bg-card/80 border border-border/30 hover:border-border/50 hover:shadow-sm transition-all duration-200">
        {/* Header with type and status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-primary/70" />
            <span className="text-xs font-medium text-foreground/80 truncate">
              {clientPackageItem.item_type ||
                t("packageItem.unknown", { default: "Item" })}
            </span>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-xs flex items-center gap-1 px-1.5 py-0.5 h-5",
              statusConfig.bgColor,
              statusConfig.textColor,
              statusConfig.borderColor
            )}
          >
            {statusConfig.icon}
            <span className="text-[10px]">{statusConfig.label}</span>
          </Badge>
        </div>

        {/* Item content - only shown if available */}
        {clientPackageItem.content && (
          <div className="text-xs text-foreground/70 line-clamp-2">
            {clientPackageItem.content}
          </div>
        )}

        {/* Action buttons - only for actionable statuses */}
        {(clientPackageItem.status === "pending" ||
          clientPackageItem.status === "completed") && (
          <div className="flex flex-wrap gap-1 pt-1">
            {" "}
            {clientPackageItem.status === "pending" && (
              <>
                {" "}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStatusUpdate("in_progress")}
                  disabled={updateStatusMutation.isPending}
                  className="h-6 text-[10px] px-1.5"
                >
                  <Check className="w-3 h-3 mr-0.5" />
                  {t("actions.accept", { default: "Accept" })}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    handleStatusUpdate("in_progress", "Requested edits")
                  }
                  disabled={updateStatusMutation.isPending}
                  className="h-6 text-[10px] px-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                >
                  <Edit3 className="w-3 h-3 mr-0.5" />
                  {t("actions.requestEdit", { default: "Edit" })}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStatusUpdate("declined")}
                  disabled={updateStatusMutation.isPending}
                  className="h-6 text-[10px] px-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-3 h-3 mr-0.5" />
                  {t("actions.reject", { default: "Reject" })}
                </Button>
              </>
            )}
            {clientPackageItem.status === "completed" && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleStatusUpdate("delivered")}
                disabled={updateStatusMutation.isPending}
                className="h-6 text-[10px] px-2"
              >
                <Truck className="w-3 h-3 mr-1" />
                {t("actions.markDelivered", { default: "Delivered" })}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("border", statusConfig.borderColor)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {t("packageItem.title", { default: "Package Item" })}
              </span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-xs flex items-center gap-1",
                statusConfig.bgColor,
                statusConfig.textColor,
                statusConfig.borderColor
              )}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Item Details */}
            <div className="space-y-2">
              <div className="text-sm">
                {" "}
                <span className="text-muted-foreground">Type: </span>
                <Badge
                  variant="secondary"
                  className="text-xs"
                >
                  {clientPackageItem.item_type || "Unknown"}
                </Badge>
              </div>

              {clientPackageItem.client_note && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Notes: </span>
                  <span className="text-foreground">
                    {clientPackageItem.client_note}
                  </span>
                </div>
              )}

              {clientPackageItem.content && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Content: </span>
                  <span className="text-foreground">
                    {clientPackageItem.content}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons - Only show for pending status */}
            {clientPackageItem.status === "pending" && (
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleStatusUpdate("in_progress")}
                  disabled={updateStatusMutation.isPending}
                  className="text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  {t("actions.accept", { default: "Accept" })}
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusUpdate("declined")}
                  disabled={updateStatusMutation.isPending}
                  className="text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  {t("actions.reject", { default: "Reject" })}
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleStatusUpdate("in_progress", "Requested edits")
                  }
                  disabled={updateStatusMutation.isPending}
                  className="text-xs"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  {t("actions.requestEdit", { default: "Request Edit" })}
                </Button>
              </div>
            )}

            {/* Mark as Delivered button for completed items */}
            {clientPackageItem.status === "completed" && (
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleStatusUpdate("delivered")}
                  disabled={updateStatusMutation.isPending}
                  className="text-xs"
                >
                  <Truck className="w-3 h-3 mr-1" />
                  {t("actions.markDelivered", { default: "Mark as Delivered" })}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientPackageItemStatus;
