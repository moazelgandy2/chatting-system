import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface LoadErrorProps {
  onRetry: () => void;
  isInfiniteScroll?: boolean;
}

export const LoadError = ({
  onRetry,
  isInfiniteScroll = false,
}: LoadErrorProps) => {
  const t = useTranslations("chat.messageArea");

  return (
    <div
      className={`flex flex-col items-center justify-center py-3 ${
        isInfiniteScroll ? "mb-2" : "my-4"
      }`}
    >
      <div className="flex items-center gap-2 text-destructive text-sm mb-2">
        <AlertCircle className="h-4 w-4" />
        <span>
          {isInfiniteScroll ? t("errorLoadingMore") : t("errorLoadingMessages")}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={onRetry}
      >
        <RefreshCw className="h-3 w-3" />
        <span>{t("retry")}</span>
      </Button>
    </div>
  );
};
