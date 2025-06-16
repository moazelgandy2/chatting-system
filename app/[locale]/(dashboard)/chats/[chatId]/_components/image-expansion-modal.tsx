"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";

export interface ExpandedImageState {
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
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal close
                    handleDownload();
                  }}
                  className="h-10 px-4 bg-background/50 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label={t("download", { default: "Download image" })}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t("download", { default: "Download" })}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent modal close
                    onClose();
                  }}
                  className="h-10 w-10 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 hover:scale-105 active:scale-95"
                  aria-label={t("closeModal", {
                    default: "Close image preview",
                  })}
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
              className="relative w-full h-full max-w-[90vw] max-h-[calc(100vh-12rem)] group" // Adjusted for better responsiveness
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking on image
            >
              <Image
                src={imageUrl}
                alt={imageName || "Expanded image"}
                layout="fill"
                objectFit="contain" // Changed to contain to ensure full image visibility
                className="rounded-xl shadow-2xl ring-1 ring-border/20"
                priority
                draggable={false}
              />
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

export default ImageExpansionModal;
