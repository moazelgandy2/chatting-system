import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  isSmall?: boolean;
  className?: string;
}

export const LoadingIndicator = ({
  isSmall = false,
  className,
}: LoadingIndicatorProps) => {
  const t = useTranslations("chat.messageArea");

  if (isSmall) {
    return (
      <div className={cn("flex items-center justify-center py-1", className)}>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>{t("loadingMore")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex justify-center py-2 mb-2", className)}>
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{t("loadingMore")}</span>
      </div>
    </div>
  );
};
