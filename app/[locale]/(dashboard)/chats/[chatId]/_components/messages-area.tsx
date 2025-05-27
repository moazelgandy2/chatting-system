"use client";

import { memo, useState, forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaFile } from "@/types/chats";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import UserAvatar from "./user-avatar";

export type MessageType = {
  id: string;
  content: string;
  sender: "user" | "agent";
  senderName?: string;
  timestamp: Date;
  media?: MediaFile[];
};

interface ExpandedImageState {
  isOpen: boolean;
  imageUrl: string;
  imageName: string;
}

// Enhanced Image Expansion Modal Component with improved theming and interactions
const ImageExpansionModal = ({
  isOpen,
  imageUrl,
  imageName,
  onClose,
}: ExpandedImageState & { onClose: () => void }) => {
  const t = useTranslations("chat.imageModal");

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = imageName || "image";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-lg dark:bg-background/95"
          onClick={onClose}
          style={{ backdropFilter: "blur(12px)" }}
        >
          {/* Enhanced header bar with proper theming */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 z-20 bg-card/90 backdrop-blur-md border-b border-border"
          >
            <div className="flex items-center justify-between p-6">
              <motion.h3
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-xl font-semibold truncate mr-4 text-foreground"
              >
                {imageName || t("defaultTitle", { default: "Image Preview" })}
              </motion.h3>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="h-10 px-4 bg-background/50 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t("download", { default: "Download" })}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced image container with responsive scaling */}
          <div className="flex items-center justify-center h-full pt-24 pb-12 px-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.1,
              }}
              className="relative max-w-[90vw] max-h-[85vh] group"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageUrl}
                alt={imageName || "Expanded image"}
                className="w-full h-full object-contain rounded-xl shadow-2xl ring-1 ring-border/20 transition-transform duration-300 group-hover:scale-[1.02]"
                loading="eager"
                draggable={false}
              />

              {/* Loading state overlay */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="absolute inset-0 bg-muted/50 rounded-xl flex items-center justify-center backdrop-blur-sm"
              >
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </motion.div>
            </motion.div>
          </div>

          {/* Click outside hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-muted-foreground text-sm bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50"
          >
            {t("clickOutsideToClose", {
              default: "Click outside or press ESC to close",
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Media File Component with improved hover states and animations
const MediaFileComponent = ({
  mediaFile,
  onImageClick,
}: {
  mediaFile: MediaFile;
  onImageClick: (url: string, name: string) => void;
}) => {
  const t = useTranslations("chat.media");
  const isImage = mediaFile.type?.startsWith("image/");

  if (isImage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
        className="relative group cursor-pointer rounded-lg overflow-hidden bg-muted/50"
        onClick={() => onImageClick(mediaFile.url, mediaFile.name || "Image")}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative overflow-hidden rounded-lg ring-1 ring-border/20 group-hover:ring-border/40 transition-all duration-300">
          <img
            src={mediaFile.url}
            alt={mediaFile.name || "Image"}
            className="max-w-xs max-h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Enhanced hover overlay with smooth animations */}
          <motion.div
            initial={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="bg-white/20 backdrop-blur-sm rounded-full p-3"
            >
              <ZoomIn className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>

          {/* Enhanced image name overlay */}
          {mediaFile.name && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3"
            >
              <p className="text-white text-xs font-medium truncate">
                {mediaFile.name}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  // Enhanced non-image media files with better theming
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 p-4 bg-card rounded-lg max-w-xs hover:bg-accent/50 transition-all duration-200 border border-border/50 hover:border-border group"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-foreground">
          {mediaFile.name || t("unknownFile", { default: "Unknown File" })}
        </p>
        <p className="text-xs text-muted-foreground">
          {mediaFile.type || t("unknownType", { default: "Unknown type" })}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(mediaFile.url, "_blank")}
        className="h-9 w-9 p-0 flex-shrink-0 hover:bg-primary/10 hover:text-primary transition-all duration-200 group-hover:scale-110"
      >
        <Download className="h-4 w-4" />
      </Button>
    </motion.div>
  );
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
    isLoading?: boolean;
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
      isLoading,
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
              <div className="ring-2 ring-border/20">
                <UserAvatar
                  role={role}
                  userName={name}
                />
              </div>
            )}
            <div
              className={cn(
                "flex flex-col gap-1 max-w-[85%]",
                isGrouped && "ml-12"
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
            "flex items-start gap-3 group",
            finalIsGrouped ? "mb-1" : "mb-4",
            isUser ? "flex-row-reverse" : "",
            "hover:bg-accent/20 rounded-lg p-2 transition-colors duration-200"
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
                "p-3 rounded-xl text-sm shadow-sm transition-all duration-200 hover:shadow-md",
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
                  className="space-y-2 mt-3"
                >
                  {message.media.map((mediaFile, index) => (
                    <MediaFileComponent
                      key={`${message.id}-media-${index}`}
                      mediaFile={mediaFile}
                      onImageClick={handleImageClick}
                    />
                  ))}
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
