"use client";
import React from "react";
import { motion } from "framer-motion";
import { Package } from "@/types";
import { Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PackageHeaderProps {
  packageData: Package;
}

const PackageHeader = ({ packageData }: PackageHeaderProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalItems = packageData.items.reduce(
    (acc, item) => acc + item.totalAllowed,
    0
  );
  const totalUsed = packageData.items.reduce((acc, item) => acc + item.used, 0);
  const usagePercentage = Math.round((totalUsed / totalItems) * 100);

  // Calculate days remaining if active
  let timeRemaining = "";
  let daysRemaining = 0;
  if (packageData.status === "active") {
    const now = new Date();
    const end = new Date(packageData.endDate);
    daysRemaining = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    timeRemaining = `${daysRemaining} days remaining`;
  }

  const isLowOnTime = packageData.status === "active" && daysRemaining <= 10;

  return (
    <motion.div
      className="glass-card rounded-lg p-6 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center mb-2">
            <h1 className="text-2xl font-bold mr-3">{packageData.name}</h1>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center ${
                packageData.status === "active"
                  ? "bg-green-500/20 text-green-500"
                  : "bg-amber-500/20 text-amber-500"
              }`}
            >
              {packageData.status === "active" ? (
                <>
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 mr-1" />
                  Expired
                </>
              )}
            </span>
          </div>
          <p className="text-muted-foreground mb-4">
            Client:{" "}
            <span className="font-medium">{packageData.clientName}</span>
          </p>

          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-6 gap-y-2">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
                Start:{" "}
                <span className="text-foreground">
                  {formatDate(packageData.startDate)}
                </span>
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
                End:{" "}
                <span className="text-foreground">
                  {formatDate(packageData.endDate)}
                </span>
              </span>
            </div>
            {timeRemaining && (
              <div
                className={`flex items-center font-medium ${
                  isLowOnTime ? "text-amber-400" : "text-primary"
                }`}
              >
                {isLowOnTime && <AlertTriangle className="w-4 h-4 mr-1" />}
                {timeRemaining}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <div className="flex flex-col gap-4 items-center">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {totalUsed}
                </div>
                <div className="text-xs text-muted-foreground">Used</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {totalItems - totalUsed}
                </div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-muted-foreground">
                  {totalItems}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Usage</span>
                <span>{usagePercentage}%</span>
              </div>
              <Progress
                value={usagePercentage}
                className="h-2"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PackageHeader;
