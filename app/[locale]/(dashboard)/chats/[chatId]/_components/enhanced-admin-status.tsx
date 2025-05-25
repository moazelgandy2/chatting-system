"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Calendar,
  Activity,
  AlertCircle,
  TrendingUp,
  Eye,
  Settings,
} from "lucide-react";
import { useAssignedPackages } from "@/hooks/use-assign-package";
import { ClientLimitsDialog } from "./client-limits-dialog";
import { usePackage } from "@/hooks/use-package";
import { Skeleton } from "@/components/ui/skeleton";

interface EnhancedAdminStatusProps {
  chatId: string;
  clientId?: number;
  messageCount?: number;
}

export function EnhancedAdminStatus({
  chatId,
  clientId,
  messageCount = 0,
}: EnhancedAdminStatusProps) {
  const t = useTranslations();
  const { data: assignedPackagesResponse, isLoading } =
    useAssignedPackages(chatId);
  const assignedPackages = Array.isArray(assignedPackagesResponse?.data)
    ? assignedPackagesResponse.data
    : assignedPackagesResponse?.data
    ? [assignedPackagesResponse.data]
    : [];
  const activePackage = assignedPackages.find((pkg) => pkg.status === "active");

  const { data: packageResponse, isLoading: packageLoading } = usePackage(
    activePackage?.package_id || 0
  );

  const packageData = packageResponse?.data;

  // Calculate summary stats
  const stats = useMemo(() => {
    return {
      totalPackages: assignedPackages.length,
      activePackages: assignedPackages.filter((pkg) => pkg.status === "active")
        .length,
      messageCount,
      clientId: clientId || "N/A",
    };
  }, [assignedPackages, messageCount, clientId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <CardTitle className="text-sm">
              {t("dashboard.adminStatus", { default: "Admin Status" })}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <CardTitle className="text-sm">
                {t("dashboard.adminStatus", { default: "Admin Status" })}
              </CardTitle>
            </div>
            <Badge
              variant="outline"
              className="text-xs"
            >
              {t("dashboard.chatId", { default: "Chat" })} #{chatId}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-2 bg-primary/5 rounded-lg">
              <div className="text-lg font-bold text-primary">
                {stats.totalPackages}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("dashboard.totalPackages", { default: "Packages" })}
              </div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {stats.activePackages}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("dashboard.activePackages", { default: "Active" })}
              </div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {stats.messageCount}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("dashboard.messages", { default: "Messages" })}
              </div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">
                {stats.clientId}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("dashboard.clientId", { default: "Client ID" })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Package Details */}
      {activePackage && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-green-600" />
                <CardTitle className="text-sm">
                  {t("dashboard.activePackage", { default: "Active Package" })}
                </CardTitle>
              </div>
              <Badge
                variant="default"
                className="text-xs"
              >
                {t("package.status.active", { default: "Active" })}
              </Badge>
            </div>
            {packageData?.description && (
              <CardDescription className="text-xs">
                {packageData.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {packageLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : packageData ? (
              <>
                {/* Package Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{packageData.name}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t("dashboard.assigned", { default: "Assigned" })}:{" "}
                        {format(new Date(activePackage.created_at), "MMM dd")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {packageData.package_items?.length || 0}{" "}
                        {t("dashboard.items", { default: "items" })}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <ClientLimitsDialog
                    chatId={chatId}
                    clientPackageId={activePackage.id}
                    packageItems={packageData.package_items || []}
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        {t("dashboard.manageLimits", { default: "Limits" })}
                      </Button>
                    }
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  {t("dashboard.packageLoadError", {
                    default: "Failed to load package details",
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* All Packages Summary */}
      {assignedPackages.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {t("dashboard.packagesSummary", { default: "Packages Summary" })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {assignedPackages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        pkg.status === "active" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <span>
                      {t("dashboard.package", { default: "Package" })} #
                      {pkg.package_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        pkg.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs px-1 py-0"
                    >
                      {pkg.status}
                    </Badge>
                    <span className="text-muted-foreground">
                      {format(new Date(pkg.created_at), "MMM dd")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Packages State */}
      {assignedPackages.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-sm font-medium mb-1">
              {t("dashboard.noPackages", { default: "No Packages Assigned" })}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {t("dashboard.noPackagesDescription", {
                default: "This client doesn't have any packages assigned yet.",
              })}
            </p>
            <div className="text-xs text-muted-foreground">
              {t("dashboard.assignPackageHint", {
                default: "Use the 'Assign Package' button to get started.",
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
