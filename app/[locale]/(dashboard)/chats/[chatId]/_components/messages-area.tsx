"use client";

import { memo, useState, forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MediaFile } from "@/types/chats";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import UserAvatar from "./user-avatar";
import ClientPackageItemStatus from "./client-package-item-status";
import { ClientPackageItem } from "@/types/packages";
import ImageExpansionModal, {
  ExpandedImageState,
} from "./image-expansion-modal";
import MediaFileItem from "./media-file-item";
import { useAuth } from "@/hooks/useAuth";

export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "agent";
  senderName?: string;
  timestamp: Date;
  media?: MediaFile[];
  client_package_item_id?: number | null;
  client_package_item?: ClientPackageItem | null;
};

// Helper function to determine if messages should be grouped
const shouldGroupMessage = (
  currentMessage: MessageType,
  previousMessage: MessageType | null,
  timeDiffThreshold: number = 300000 // 5 minutes in milliseconds
): boolean => {
  if (!previousMessage) return false;

  const timeDiff =
    new Date(currentMessage.timestamp).getTime() -
    new Date(previousMessage.timestamp).getTime();
  return (
    currentMessage.sender === previousMessage.sender &&
    timeDiff < timeDiffThreshold
  );
};

export const MessagesArea = forwardRef<
  HTMLDivElement,
  {
    message: MessageType | string;
    name: string;
    role: "admin" | "team" | "client";
    appearAnimation?: boolean;
    previousMessage?: MessageType | null;
    isGrouped?: boolean;
  }
>(
  (
    {
      message,
      name,
      role,
      appearAnimation = true,
      previousMessage = null,
      isGrouped = false,
    },
    ref
  ) => {
    const t = useTranslations("chat.messageArea");
    const [expandedImage, setExpandedImage] = useState<ExpandedImageState>({
      isOpen: false,
      imageUrl: "",
      imageName: "",
    });

    const handleImageClick = (url: string, name: string) => {
      setExpandedImage({
        isOpen: true,
        imageUrl: url,
        imageName: name,
      });
    };
    const { session } = useAuth();

    const closeExpandedImage = () => {
      setExpandedImage({
        isOpen: false,
        imageUrl: "",
        imageName: "",
      });
    };

    // Handle string messages (simple text responses)
    if (typeof message === "string") {
      return (
        <>
          <motion.div
            initial={
              appearAnimation ? { opacity: 0, y: 20, scale: 0.95 } : false
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            className={cn("flex items-start gap-3 mb-3", isGrouped && "mb-1")}
          >
            {" "}
            {!isGrouped && (
              <div className="ring-2 ring-border/20 rounded-full">
                <UserAvatar
                  role={role}
                  userName={name}
                />
              </div>
            )}
            <div
              className={cn(
                "flex flex-col gap-1 max-w-[85%]",
                isGrouped && "ml-12" // Assuming avatar + gap is roughly 48px (12 * 4 units)
              )}
            >
              {!isGrouped && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="text-xs font-medium text-muted-foreground"
                >
                  {t("agent")}
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="p-3 rounded-xl bg-card text-sm shadow-sm border border-border/50 hover:shadow-md transition-shadow duration-200"
              >
                {message}
              </motion.div>
            </div>
          </motion.div>
          <ImageExpansionModal
            {...expandedImage}
            onClose={closeExpandedImage}
          />
        </>
      );
    }

    const isUser = message.sender === "user";

    // Add safety check for message structure
    if (!message || typeof message !== "object" || !message.sender) {
      console.error("Invalid message structure:", message);
      return null;
    }

    // Determine if this message should be grouped with the previous one
    const shouldGroup = previousMessage
      ? shouldGroupMessage(message, previousMessage)
      : false;
    const finalIsGrouped = isGrouped || shouldGroup;

    return (
      <>
        <motion.div
          ref={ref}
          initial={
            appearAnimation
              ? {
                  opacity: 0,
                  y: 20,
                  scale: 0.95,
                }
              : false
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: appearAnimation ? 0.1 : 0,
          }}
          className={cn(
            "flex items-start gap-2 group",
            finalIsGrouped ? "mb-0.5" : "mb-2.5",
            isUser ? "flex-row-reverse" : "",
            "hover:bg-accent/20 rounded-lg p-1.5 transition-colors duration-200"
          )}
        >
          {" "}
          {!finalIsGrouped && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3, type: "spring" }}
              className="ring-2 ring-border/20 group-hover:ring-primary/30 transition-all duration-200 rounded-full"
            >
              <UserAvatar
                role={role}
                userName={name}
              />
            </motion.div>
          )}
          <div
            className={cn(
              "flex flex-col gap-1 max-w-[85%]",
              isUser ? "items-end" : "items-start",
              finalIsGrouped && (isUser ? "mr-12" : "ml-12")
            )}
          >
            {!finalIsGrouped && (
              <motion.div
                initial={{ opacity: 0, x: isUser ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-xs font-medium text-muted-foreground"
              >
                {isUser ? t("you") : message.senderName || t("agent")}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className={cn(
                "p-2.5 rounded-xl text-sm shadow-sm transition-all duration-200 hover:shadow-md",
                isUser
                  ? "bg-primary text-primary-foreground border border-primary/20"
                  : "bg-card text-foreground border border-border/50"
              )}
            >
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
              {/* Enhanced Media Files Display */}
              {message.media && message.media.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="w-full space-y-1.5 mt-2" // Ensure this container takes full width
                >
                  {message.media.map((mediaFile, index) => (
                    <MediaFileItem
                      key={`${message.id}-media-${index}`}
                      mediaFile={mediaFile}
                      onImageClick={handleImageClick}
                    />
                  ))}
                </motion.div>
              )}{" "}
              {/* Client Package Item Status Display */}
              {(message.client_package_item ||
                message.client_package_item_id) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="mt-2"
                >
                  <ClientPackageItemStatus
                    role={session?.user.role}
                    clientPackageItem={message.client_package_item}
                    isCompact={true}
                  />
                </motion.div>
              )}
            </motion.div>

            {!finalIsGrouped && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="text-xs text-muted-foreground px-1"
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Image Expansion Modal */}
        <ImageExpansionModal
          {...expandedImage}
          onClose={closeExpandedImage}
        />
      </>
    );
  }
);

MessagesArea.displayName = "MessagesArea";

export const MemoizedMessagesArea = memo(MessagesArea);

// Export the grouping helper for use in parent components
export { shouldGroupMessage };
