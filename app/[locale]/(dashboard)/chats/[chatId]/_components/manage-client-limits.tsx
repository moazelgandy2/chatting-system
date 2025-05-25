"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Plus, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ClientLimitsDialog } from "./client-limits-dialog";
import { useAssignedPackages } from "@/hooks/use-assign-package";
import { usePackage } from "@/hooks/use-package";

interface AssignedPackageItemProps {
  chatId: string;
  assignedPackage: {
    id: number;
    package_id: number;
  };
}

function AssignedPackageItem({
  chatId,
  assignedPackage,
}: AssignedPackageItemProps) {
  const { data: packageResponse, isLoading } = usePackage(
    assignedPackage.package_id
  );
  const t = useTranslations();

  if (isLoading) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  const packageData = packageResponse?.data;
  if (!packageData) {
    return null;
  }
  return (
    <ClientLimitsDialog
      chatId={chatId}
      clientPackageId={assignedPackage.id}
      packageItems={packageData.package_items || []}
      trigger={
        <Button
          variant="outline"
          size="sm"
          className="gap-2 w-full justify-start bg-background hover:bg-muted/50 border-primary/20 hover:border-primary/40"
        >
          <Settings className="h-4 w-4 text-primary" />
          <div className="flex flex-col items-start">
            <span className="font-medium">{packageData.name}</span>
            <span className="text-xs text-muted-foreground">
              {packageData.package_items?.length || 0}{" "}
              {t("clientLimits.itemsCount", { default: "items" })}
            </span>
          </div>
        </Button>
      }
    />
  );
}

interface ManageClientLimitsProps {
  chatId: string;
}

export function ManageClientLimits({ chatId }: ManageClientLimitsProps) {
  const {
    data: assignedPackagesResponse,
    isLoading,
    isError,
  } = useAssignedPackages(chatId);
  const t = useTranslations();

  const assignedPackage = assignedPackagesResponse?.data;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("clientLimits.loading", { default: "Loading assigned packages..." })}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive">
        {t("clientLimits.error", {
          default: "Failed to load assigned packages",
        })}
      </div>
    );
  }
  if (!assignedPackage) {
    return (
      <div className="text-center py-8 px-4 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Settings className="h-6 w-6 text-muted-foreground" />
        </div>
        <h4 className="text-sm font-medium text-foreground mb-1">
          {t("clientLimits.noPackagesTitle", {
            default: "No Packages Assigned",
          })}
        </h4>
        <p className="text-xs text-muted-foreground mb-4">
          {t("clientLimits.noPackagesDescription", {
            default:
              "Assign a package to this chat to manage client limits and settings.",
          })}
        </p>
        <div className="text-xs text-muted-foreground">
          {t("clientLimits.assignHint", {
            default:
              "Use the 'Assign Package' button in the admin panel above.",
          })}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">
            {t("clientLimits.activePackage", { default: "Active Package" })}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          {t("clientLimits.packageId", { default: "ID" })}: {assignedPackage.id}
        </div>
      </div>

      <div className="bg-card border rounded-lg p-4 space-y-3">
        <AssignedPackageItem
          chatId={chatId}
          assignedPackage={assignedPackage}
        />

        <div className="text-xs text-muted-foreground pt-2 border-t">
          {t("clientLimits.manageHint", {
            default:
              "Click the package button above to configure edit and decline limits for each item type.",
          })}
        </div>
      </div>
    </div>
  );
}
