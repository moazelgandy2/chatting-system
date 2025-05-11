"use client";

import React from "react";
import { motion } from "framer-motion";
import { Submission } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Calendar,
  Eye,
  RotateCw,
  Check,
  X,
  Clock,
  Download,
  Star,
} from "lucide-react";

interface SubmissionCardProps {
  submission: Submission;
  index: number;
}

const SubmissionCard = ({ submission, index }: SubmissionCardProps) => {
  const t = useTranslations("package");
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30",
          textColor: "text-green-500",
          icon: <Check className="w-3 h-3 mr-1" />,
          tooltip: t("itemDetails.accepted"),
        };
      case "rejected":
        return {
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
          textColor: "text-red-500",
          icon: <X className="w-3 h-3 mr-1" />,
          tooltip: t("itemDetails.rejected"),
        };
      case "edited":
        return {
          bgColor: "bg-amber-500/20",
          borderColor: "border-amber-500/30",
          textColor: "text-amber-500",
          icon: <RotateCw className="w-3 h-3 mr-1" />,
          tooltip: t("itemDetails.edited"),
        };
      case "pending":
        return {
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
          textColor: "text-blue-500",
          icon: <Clock className="w-3 h-3 mr-1" />,
          tooltip: "Awaiting review",
        };
      default:
        return {
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500/30",
          textColor: "text-gray-500",
          icon: null,
          tooltip: "Unknown status",
        };
    }
  };

  const statusConfig = getStatusConfig(submission.status);

  return (
    <motion.div
      className={cn(
        "glass-card rounded-lg p-4 mb-3 border group hover:border-border/50 transition-colors",
        statusConfig.borderColor
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex gap-3">
        <div className="relative flex-shrink-0 w-16 h-16 bg-muted rounded-md overflow-hidden border border-border shadow-sm">
          <img
            src={submission.thumbnailUrl}
            alt={submission.title}
            className="w-full h-full object-cover"
          />
          {submission.featured && (
            <div className="absolute top-0 right-0 bg-amber-500/90 p-0.5 rounded-bl-md">
              <Star className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm line-clamp-1">
              {submission.title}
            </h3>{" "}
            <div
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium capitalize flex items-center",
                statusConfig.bgColor,
                statusConfig.textColor
              )}
            >
              {statusConfig.icon}
              {t(`quota.${submission.status}`)}
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
            {submission.description}
          </p>

          <div className="flex items-center justify-between mt-2">
            {" "}
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(submission.dateSubmitted).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </div>
            <div className="flex gap-2">
              <button className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors px-2 py-0.5 rounded-full bg-primary/10 shadow-sm">
                <Eye className="w-3 h-3" />
                {t("itemDetails.view") || "View"}
              </button>
              {submission.status === "accepted" && (
                <button className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors px-2 py-0.5 rounded-full bg-primary/10 shadow-sm">
                  <Download className="w-3 h-3" />
                  {t("itemDetails.download") || "Download"}
                </button>
              )}{" "}
              {submission.status === "rejected" && (
                <button className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors px-2 py-0.5 rounded-full bg-primary/10 shadow-sm">
                  <RotateCw className="w-3 h-3" />
                  {t("itemDetails.resubmit") || "Resubmit"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubmissionCard;
