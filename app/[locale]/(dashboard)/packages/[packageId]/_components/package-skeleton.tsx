"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function PackageSkeleton() {
  return (
    <div className="container mx-auto px-4 max-w-6xl">
      {/* Header Skeleton */}
      <motion.div
        className="glass-card rounded-lg p-6 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="w-full md:w-1/2">
            <div className="flex items-center mb-2">
              <div className="h-8 w-48 bg-muted-foreground/20 rounded-md animate-pulse" />
              <div className="ml-3 h-6 w-20 bg-green-500/20 rounded-full animate-pulse" />
            </div>
            <div className="h-5 w-64 bg-muted-foreground/20 rounded-md animate-pulse mb-4" />
            <div className="flex flex-wrap gap-4">
              <div className="h-5 w-32 bg-muted-foreground/20 rounded-md animate-pulse" />
              <div className="h-5 w-32 bg-muted-foreground/20 rounded-md animate-pulse" />
              <div className="h-5 w-40 bg-muted-foreground/20 rounded-md animate-pulse" />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <div className="flex gap-6 items-center animate-pulse">
              <div className="flex flex-col gap-4 items-center">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i}>
                        <div className="h-8 w-12 bg-muted-foreground/20 rounded-md mx-auto mb-1" />
                        <div className="h-4 w-14 bg-muted-foreground/20 rounded-md mx-auto" />
                      </div>
                    ))}
                </div>
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <div className="h-4 w-12 bg-muted-foreground/20 rounded-md" />
                    <div className="h-4 w-8 bg-muted-foreground/20 rounded-md" />
                  </div>
                  <Progress
                    value={30}
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Section Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-48 bg-muted-foreground/20 rounded-md animate-pulse" />
          <div className="h-5 w-5 bg-muted-foreground/20 rounded-full animate-pulse" />
        </div>
        <div className="relative">
          <div className="h-9 w-56 bg-muted-foreground/20 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Items Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="relative rounded-lg border p-4 animate-pulse"
            >
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-muted-foreground/20 flex items-center justify-center mr-3">
                  <Package className="h-5 w-5 text-muted-foreground/30" />
                </div>
                <div className="flex-1">
                  <div className="h-5 w-24 bg-muted-foreground/20 rounded-md mb-2" />
                  <div className="h-4 w-full bg-muted-foreground/20 rounded-md mb-2" />
                  <div className="h-3 w-16 bg-muted-foreground/20 rounded-md" />
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full h-2.5 bg-muted-foreground/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-muted-foreground/30 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 80) + 10}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
