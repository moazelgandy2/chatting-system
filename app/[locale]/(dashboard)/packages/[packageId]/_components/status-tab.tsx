"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SubmissionStatus } from "@/types";
import { CheckCircle, X, RotateCw, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface StatusTabsProps {
  activeStatus: SubmissionStatus | "all";
  setActiveStatus: (status: SubmissionStatus | "all") => void;
  counts: {
    all: number;
    accepted: number;
    rejected: number;
    edited: number;
    [key: string]: number; // Add index signature
  };
}

const StatusTabs = ({
  activeStatus,
  setActiveStatus,
  counts,
}: StatusTabsProps) => {
  const t = useTranslations("package");
  const tabs: {
    value: SubmissionStatus | "all";
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: "all" as const, label: t("itemDetails.items"), icon: null },
    {
      value: "accepted" as const,
      label: t("quota.accepted"),
      icon: <CheckCircle className="w-3 h-3" />,
    },
    {
      value: "rejected" as const,
      label: t("quota.rejected"),
      icon: <X className="w-3 h-3" />,
    },
    {
      value: "edited" as const,
      label: t("quota.edited"),
      icon: <RotateCw className="w-3 h-3" />,
    },
  ];

  return (
    <div className="flex overflow-x-auto no-scrollbar gap-4 border-b border-border pb-2 mb-4">
      {tabs.map((tab) => (
        <motion.button
          key={tab.value}
          onClick={() => setActiveStatus(tab.value)}
          className={cn(
            "relative justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0",
            activeStatus === tab.value
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          whileHover={{ scale: activeStatus !== tab.value ? 1.03 : 1 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="flex items-center">
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
          </span>
          <span
            className={cn(
              "text-xs rounded-full px-2 py-0.5 flex items-center justify-center",
              activeStatus === tab.value ? "bg-primary/20" : "bg-muted"
            )}
          >
            {counts[tab.value as keyof typeof counts]}
          </span>
          {activeStatus === tab.value && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
              layoutId="activeTab"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default StatusTabs;
