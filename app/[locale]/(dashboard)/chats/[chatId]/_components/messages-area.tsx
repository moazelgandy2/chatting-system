import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import UserAvatar from "./user-avatar";

export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
};

export const MessagesArea = ({
  message,
}: {
  message: MessageType | string;
}) => {
  const t = useTranslations("chat.messageArea");

  if (typeof message === "string") {
    return (
      <div className="flex items-start gap-3 mb-4 animate-in fade-in-50">
        <UserAvatar />
        <div className="flex flex-col gap-1 max-w-[80%]">
          <div className="text-xs font-medium text-muted-foreground">
            {t("agent")}
          </div>
          <div className="p-3 rounded-lg bg-muted text-sm">{message}</div>
        </div>
      </div>
    );
  }

  const isUser = message.sender === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3 mb-4 animate-in fade-in-50 p-1",
        isUser ? "flex-row-reverse" : ""
      )}
    >
      <UserAvatar />
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className="text-xs font-medium text-muted-foreground">
          {isUser ? t("you") : t("agent")}
        </div>
        <div
          className={cn(
            "p-3 rounded-lg text-sm",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {message.content}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
