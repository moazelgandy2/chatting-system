import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export const EndOfHistoryIndicator = ({
  className,
}: {
  className?: string;
}) => {
  const t = useTranslations("chat.messageArea");

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-6 mb-4 text-sm text-muted-foreground animate-in fade-in-50",
        className
      )}
    >
      <div className="w-full max-w-xs border-t border-dashed border-muted-foreground/30 mb-3"></div>
      <span>{t("beginningOfConversation")}</span>
    </div>
  );
};
