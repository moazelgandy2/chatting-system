"use client";

import { Sparkles, Expand, Gauge, BadgeInfo } from "lucide-react";
import { useState } from "react";
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
  const t = useTranslations();

  const metrics: Metric[] = [
    { label: "accepted", value: "420", trend: 10 },
    { label: "edited", value: "35", trend: 70 },
    { label: "rejected", value: "10", trend: 83 },
  ];

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
          >
            {t("chat.quota.viewDetails")}
            <Expand className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
