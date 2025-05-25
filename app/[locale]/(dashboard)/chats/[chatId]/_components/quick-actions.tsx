"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RefreshCw,
  Download,
  FileText,
  BarChart3,
  Settings2,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { showNotification } from "@/lib/show-notification";

interface QuickActionsProps {
  chatId: string;
}

export function QuickActions({ chatId }: QuickActionsProps) {
  const t = useTranslations();
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExportChat = async () => {
    setIsExporting(true);
    try {
      // Simulate export action
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showNotification(
        t("quickActions.exportSuccess", {
          default: "Chat data exported successfully!",
        }),
        "success"
      );
    } catch (error) {
      showNotification(
        t("quickActions.exportError", {
          default: "Failed to export chat data.",
        }),
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh action
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleGenerateReport = () => {
    showNotification(
      t("quickActions.reportGenerated", {
        default: "Chat analytics report is being prepared.",
      }),
      "info"
    );
  };

  const quickActions = [
    {
      icon: <RefreshCw className="h-4 w-4" />,
      label: t("quickActions.refresh", { default: "Refresh" }),
      description: t("quickActions.refreshDesc", {
        default: "Reload chat data",
      }),
      onClick: handleRefreshData,
      loading: isRefreshing,
      variant: "outline" as const,
    },
    {
      icon: <Download className="h-4 w-4" />,
      label: t("quickActions.export", { default: "Export" }),
      description: t("quickActions.exportDesc", {
        default: "Download chat data",
      }),
      onClick: handleExportChat,
      loading: isExporting,
      variant: "outline" as const,
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      label: t("quickActions.analytics", { default: "Analytics" }),
      description: t("quickActions.analyticsDesc", {
        default: "View chat metrics",
      }),
      onClick: handleGenerateReport,
      loading: false,
      variant: "outline" as const,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-orange-500" />
        <h4 className="text-sm font-medium">
          {t("quickActions.title", { default: "Quick Actions" })}
        </h4>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            size="sm"
            onClick={action.onClick}
            disabled={action.loading}
            className="justify-start h-auto p-3 bg-card hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              {action.loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                action.icon
              )}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{action.label}</span>
                <span className="text-xs text-muted-foreground">
                  {action.description}
                </span>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
