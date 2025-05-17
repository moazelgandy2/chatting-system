import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import UserAvatar from "./user-avatar";
import { forwardRef, memo } from "react";

export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "agent";
  senderName?: string;
  timestamp: Date;
};

export const MessagesArea = forwardRef<
  HTMLDivElement,
  {
    message: MessageType | string;
    name: string;
    role: "admin" | "team" | "client";
    isLoading?: boolean;
    appearAnimation?: boolean;
  }
>(({ message, name, role, isLoading, appearAnimation = true }, ref) => {
  const t = useTranslations("chat.messageArea");

  if (typeof message === "string") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 mb-4",
          appearAnimation && "animate-in fade-in-50"
        )}
      >
        <UserAvatar
          role={role}
          userName={name}
        />
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
      ref={ref}
      className={cn(
        "flex items-start gap-3 mb-4 p-1",
        appearAnimation ? "animate-in fade-in-50" : "",
        isUser ? "flex-row-reverse" : ""
      )}
    >
      <UserAvatar
        role={role}
        userName={name}
      />
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className="text-xs font-medium text-muted-foreground">
          {isUser ? t("you") : message.senderName || t("agent")}
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
});

MessagesArea.displayName = "MessagesArea";

// Wrap in memo to prevent unnecessary re-renders
export const MemoizedMessagesArea = memo(MessagesArea);
