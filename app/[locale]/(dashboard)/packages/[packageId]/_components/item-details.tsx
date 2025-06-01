"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContentItem, Submission, SubmissionStatus } from "@/types";
import StatusTabs from "./status-tab";
import SubmissionCard from "./submission-card";
import { X, Info, Filter, SortDesc } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ItemDetailDrawerProps {
  item: ContentItem | null;
  onClose: () => void;
  isOpen: boolean;
}

const ItemDetailDrawer = ({ item, onClose, isOpen }: ItemDetailDrawerProps) => {
  const t = useTranslations("package");
  const [activeStatus, setActiveStatus] = useState<SubmissionStatus | "all">(
    "all"
  );

  if (!item) return null;

  const filteredSubmissions =
    activeStatus === "all"
      ? item.submissions
      : item.submissions.filter(
          (submission) => submission.status === activeStatus
        );

  const getCounts = () => {
    const counts = {
      all: item.submissions.length,
      accepted: 0,
      rejected: 0,
      edited: 0,
    };

    item.submissions.forEach((submission) => {
      counts[submission.status]++;
    });

    return counts;
  };
  const statusInfo: { [key in SubmissionStatus | "all"]: string } = {
    all: t("itemDetails.all"),
    accepted: t("itemDetails.accepted"),
    rejected: t("itemDetails.rejected"),
    edited: t("itemDetails.edited"),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 w-full sm:w-1/2 h-full bg-background border-l border-border shadow-xl z-50 overflow-hidden flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold flex items-center">
                    {item.type}{" "}
                    <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {item.totalAllowed - item.used} {t("details.remaining")}
                    </span>
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                  <div className="text-sm mt-2 flex items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="flex flex-col items-center px-3 py-1 bg-muted rounded-md">
                        <span className="text-xs text-muted-foreground">
                          {t("details.used")}
                        </span>
                        <span className="font-medium">{item.used}</span>
                      </div>
                      <div className="flex flex-col items-center px-3 py-1 bg-muted rounded-md">
                        <span className="text-xs text-muted-foreground">
                          {t("details.total")}
                        </span>
                        <span className="font-medium">{item.totalAllowed}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label={t("itemDetails.close")}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-border">
              <StatusTabs
                activeStatus={activeStatus}
                setActiveStatus={setActiveStatus}
                counts={getCounts()}
              />
            </div>

            <div className="p-4">
              {" "}
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertTitle className="text-sm font-medium">
                  {activeStatus === "all"
                    ? t("itemDetails.items")
                    : t(`quota.${activeStatus}`)}
                </AlertTitle>
                <AlertDescription className="text-xs">
                  {statusInfo[activeStatus]}
                </AlertDescription>
              </Alert>
            </div>

            <div className="px-4 flex-grow overflow-auto">
              {" "}
              {filteredSubmissions.length > 0 && (
                <div className="flex justify-between items-center mb-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Filter size={12} />
                    <span>
                      {filteredSubmissions.length} {t("itemDetails.items")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <SortDesc size={12} />
                    <span>{t("itemDetails.newestFirst")}</span>
                  </div>
                </div>
              )}
              <AnimatePresence mode="wait">
                <ScrollArea className="h-60 pe-4">
                  <motion.div
                    key={activeStatus}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {filteredSubmissions.length > 0 ? (
                      filteredSubmissions.map((submission, index) => (
                        <SubmissionCard
                          key={submission.id}
                          submission={submission}
                          index={index}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                          <Info
                            size={24}
                            className="opacity-50"
                          />
                        </div>{" "}
                        <p className="text-sm font-medium">
                          {t("itemDetails.noSubmissions", {
                            status:
                              activeStatus !== "all"
                                ? t(`quota.${activeStatus}`)
                                : "",
                          })}
                        </p>
                        <p className="text-xs mt-1">
                          {t("itemDetails.tryChangingFilter")}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </ScrollArea>
              </AnimatePresence>
              <div className="h-4"></div> {/* Bottom spacing */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ItemDetailDrawer;
