import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export default function Notification({ message, type }: NotificationProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-emerald-300 bg-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-800/30 p-4 shadow-xs",
          {
            "border-red-300 dark:bg-red-950/2 dark:border-red-800/30 ":
              type === "error",
            "border-blue-300 dark:bg-blue-950/2 dark:border-blue-800/30":
              type === "info",
            "border-yellow-300 dark:bg-yellow-950/2 dark:border-yellow-800/30":
              type === "warning",
          }
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "rounded-full bg-emerald-200 dark:bg-emerald-900/50 p-1",
              {
                "bg-red-200 dark:bg-red-900/50": type === "error",
                "bg-blue-200 dark:bg-blue-900/50": type === "info",
                "bg-yellow-200 dark:bg-yellow-900/50": type === "warning",
              }
            )}
          >
            <CheckCircle2
              className={cn("h-4 w-4 text-emerald-700 dark:text-emerald-400", {
                "text-red-700 dark:text-red-400": type === "error",
                "text-blue-700 dark:text-blue-400": type === "info",
                "text-yellow-700 dark:text-yellow-400": type === "warning",
              })}
            />
          </div>
          <p
            className={cn(
              "text-sm font-medium text-emerald-900 dark:text-emerald-200",
              {
                "text-red-900 dark:text-red-200": type === "error",
                "text-blue-900 dark:text-blue-200": type === "info",
                "text-yellow-900 dark:text-yellow-200": type === "warning",
              }
            )}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
