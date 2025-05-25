"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Settings,
  Plus,
  Loader2,
  Package,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ClientLimitsDialog } from "./client-limits-dialog";
import { useAssignedPackages } from "@/hooks/use-assign-package";
import { usePackage } from "@/hooks/use-package";
import { AssignedPackageData } from "@/types/packages";

interface AssignedPackageItemProps {
  chatId: string;
  assignedPackage: AssignedPackageData;
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
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">
              {t("common.loading", { default: "Loading..." })}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }
  const packageData = packageResponse?.data;
  if (!packageData) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              {t("package.notFound", { default: "Package not found" })}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <CardTitle className="text-base">{packageData.name}</CardTitle>
          </div>
          <Badge
            variant={
              assignedPackage.status === "active" ? "default" : "secondary"
            }
          >
            {assignedPackage.status}
          </Badge>
        </div>
        {packageData.description && (
          <p className="text-sm text-muted-foreground">
            {packageData.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2 flex-col items-center">
          <ClientLimitsDialog
            chatId={chatId}
            clientPackageId={assignedPackage.id}
            packageItems={packageData.package_items || []}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="w-full p-4"
              >
                <Settings className="w-4 h-4 mr-2" />
                {t("clientLimits.manageLimits", { default: "Manage Limits" })}
              </Button>
            }
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t("package.totalItems", { default: "Total Items" })}:
            </span>
            <span className="font-medium">
              {packageData.package_items?.length || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
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

  const assignedPackages = Array.isArray(assignedPackagesResponse?.data)
    ? assignedPackagesResponse.data
    : assignedPackagesResponse?.data
    ? [assignedPackagesResponse.data]
    : [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("clientLimits.loading", {
            default: "Loading assigned packages...",
          })}
        </div>
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("clientLimits.error", { default: "Failed to Load Packages" })}
          </h3>
          <p className="text-sm text-red-600">
            {t("clientLimits.errorDescription", {
              default:
                "There was an error loading the assigned packages. Please try again.",
            })}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!assignedPackages || assignedPackages.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t("clientLimits.noPackagesTitle", {
              default: "No Packages Assigned",
            })}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("clientLimits.noPackagesDescription", {
              default:
                "This client doesn't have any packages assigned yet. Assign a package first to manage limits.",
            })}
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-4 ">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">
          {t("clientLimits.assignedPackages", { default: "Assigned Packages" })}
        </h3>
        <Badge variant="outline">{assignedPackages.length}</Badge>
      </div>

      {assignedPackages.map((assignedPackage) => (
        <AssignedPackageItem
          key={assignedPackage.id}
          chatId={chatId}
          assignedPackage={assignedPackage}
        />
      ))}
    </div>
  );
}
