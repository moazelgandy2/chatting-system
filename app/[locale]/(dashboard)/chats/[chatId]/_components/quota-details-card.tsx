"use client";

import { BadgeInfo, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface Metric {
  label: string;
  value: string;
  trend: number;
}

const METRIC_COLORS = {
  accepted: "#2CD758",
  edited: "#007AFF",
  rejected: "#FF2D55",
} as const;

export default function QuotaDetailsCard() {
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [isPopoutVisible, setIsPopoutVisible] = useState(false);
  const popoutRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations();

  const metrics: Metric[] = [
    { label: "accepted", value: "420", trend: 10 },
    { label: "edited", value: "35", trend: 70 },
    { label: "rejected", value: "10", trend: 83 },
  ];

  const togglePopout = () => {
    setIsPopoutVisible(!isPopoutVisible);
  };

  // Close popout when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoutRef.current &&
        !popoutRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopoutVisible(false);
      }
    };

    if (isPopoutVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopoutVisible]);

  return (
    <div className="flex justify-end w-full h-full">
      <div className="relative h-full w-full rounded-3xl p-4 bg-white dark:bg-black/5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
        <div className="flex text-lg items-center gap-2 mb-2">
          <div className="p-2 rounded-full flex justify-center items-center bg-zinc-100 dark:bg-zinc-800/50">
            <BadgeInfo className="w-5 h-5 text-[#FF2D55]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              {t("chat.quota.title")}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("chat.quota.details")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setIsHovering(metric.label)}
              onMouseLeave={() => setIsHovering(null)}
            >
              <div className="relative w-22 h-22">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-800/50" />
                <div
                  className={cn(
                    "absolute inset-0 rounded-full border-4 transition-all duration-500",
                    isHovering === metric.label && "scale-105"
                  )}
                  style={{
                    borderColor:
                      METRIC_COLORS[metric.label as keyof typeof METRIC_COLORS],
                    clipPath: `polygon(0 0, 100% 0, 100% ${metric.trend}%, 0 ${metric.trend}%)`,
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    {metric.value}
                  </span>
                </div>
              </div>
              <span className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t(`chat.quota.${metric.label}`)}
              </span>
              <span className="text-xs text-zinc-500">{metric.trend}%</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center mt-2">
          <Button
            className="cursor-pointer"
            size={"sm"}
            onClick={togglePopout}
            aria-expanded={isPopoutVisible}
            ref={buttonRef}
          >
            {t("chat.quota.viewDetails")}
            <ChevronDown
              className={cn(
                "ml-2 h-4 w-4 transition-transform duration-300",
                isPopoutVisible ? "transform rotate-180" : ""
              )}
            />
          </Button>
        </div>

        {/* Popout Card */}
        {isPopoutVisible && (
          <div
            className="fixed inset-0 bg-black/20 dark:bg-zinc-900/50 z-40 backdrop-blur-sm flex items-center justify-center"
            aria-modal="true"
            role="dialog"
          >
            <div
              ref={popoutRef}
              className={cn(
                "bg-white dark:bg-zinc-900 rounded-2xl shadow-xl z-50 p-6 max-w-xl w-[90%] border border-zinc-200 dark:border-zinc-800",
                "animate-in zoom-in-90 duration-300"
              )}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full flex justify-center items-center bg-zinc-100 dark:bg-zinc-800/50">
                    <BadgeInfo className="w-5 h-5 text-[#FF2D55]" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {t("chat.quota.detailedStats")}
                  </h3>
                </div>
                <button
                  onClick={() => setIsPopoutVisible(false)}
                  className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-500"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              {/* Main metrics visualization */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {metrics.map((metric) => (
                  <div
                    key={`popout-${metric.label}`}
                    className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-900 dark:text-white">
                        {t(`chat.quota.${metric.label}`)}
                      </span>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            METRIC_COLORS[
                              metric.label as keyof typeof METRIC_COLORS
                            ],
                        }}
                      />
                    </div>

                    <div className="mb-3 mt-6 relative h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "absolute top-0 left-0 h-full rounded-full",
                          "animate-in slide-in-from-left duration-500"
                        )}
                        style={{
                          width: `${metric.trend}%`,
                          backgroundColor:
                            METRIC_COLORS[
                              metric.label as keyof typeof METRIC_COLORS
                            ],
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                        {metric.value}
                      </span>
                      <span className="text-sm font-medium">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-1 rounded-full text-xs",
                            metric.trend > 50
                              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                              : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                          )}
                        >
                          {metric.trend}%
                          {metric.trend > 50 ? (
                            <svg
                              className="w-3 h-3 ml-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 5L20 13L18.59 14.41L13 8.83L13 19L11 19L11 8.83L5.41 14.41L4 13L12 5Z"
                                fill="currentColor"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-3 h-3 ml-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 19L4 11L5.41 9.59L11 15.17L11 5L13 5L13 15.17L18.59 9.59L20 11L12 19Z"
                                fill="currentColor"
                              />
                            </svg>
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional info */}
              <div className="bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-xl mb-4">
                <h4 className="text-sm font-medium mb-2 text-zinc-900 dark:text-white">
                  {t("chat.quota.usage")}
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t("chat.quota.expandedDescription")}
                </p>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => setIsPopoutVisible(false)}
                  size="sm"
                >
                  {t("chat.quota.close")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
