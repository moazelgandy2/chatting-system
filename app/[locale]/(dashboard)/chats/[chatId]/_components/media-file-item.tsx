"use client";

import { memo } from "react";
import { Download, ZoomIn, FileText } from "lucide-react"; // Added FileText for generic files
import { Button } from "@/components/ui/button";
import { MediaFile } from "@/types/chats";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import CustomVideoPlayer from "./custom-video-player"; // Import the custom video player

// Enhanced Media File Component with improved hover states and animations
const MediaFileItem = ({
  mediaFile,
  onImageClick,
}: {
  mediaFile: MediaFile;
  onImageClick: (url: string, name: string) => void;
}) => {
  const t = useTranslations("chat.media");
  const isImage =
    mediaFile.type?.startsWith("image/") ||
    (mediaFile.url &&
      mediaFile.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null);
  const isVideo =
    mediaFile.type?.startsWith("video/") ||
    (mediaFile.url && mediaFile.url.match(/\.(mp4|webm|ogg)$/i) !== null);
  const isPdf =
    mediaFile.type === "application/pdf" ||
    (mediaFile.url && mediaFile.url.match(/\.pdf$/i) !== null);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click event from bubbling up (e.g. to image zoom)
    try {
      const response = await fetch(mediaFile.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = mediaFile.name || "downloaded_file";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download media:", error);
      // Optionally, show a notification to the user
    }
  };

  const handleImageZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageClick(mediaFile.url, mediaFile.name || "image");
  };

  return (
    <div
      className={cn(
        "relative group flex flex-col items-center justify-center border rounded-lg shadow-sm transition-all duration-300 ease-in-out transform hover:shadow-xl hover:-translate-y-1.5 overflow-hidden",
        "bg-card dark:bg-card/90 border-border/70 dark:border-border/60",
        (isImage || isVideo || isPdf) && "w-full aspect-video", // Apply to images, videos, and PDFs
        isImage && "cursor-pointer",
        !isImage && !isVideo && !isPdf && "w-48 h-48 cursor-default" // Fallback for other file types
      )}
      onClick={isImage ? handleImageZoom : undefined}
      onKeyDown={
        isImage
          ? (e) => e.key === "Enter" && handleImageZoom(e as any)
          : undefined
      }
      tabIndex={isImage ? 0 : -1}
      aria-label={
        isImage
          ? t("viewImage", { name: mediaFile.name || t("unnamedImage") })
          : mediaFile.name || t("unnamedFile")
      }
    >
      {isImage ? (
        <div className="relative w-64 h-64 overflow-hidden rounded-sm group-hover:scale-105 transition-transform duration-300 ease-out">
          <Image
            src={mediaFile.url}
            alt={mediaFile.name || t("imageAlt", { default: "Uploaded image" })}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-out aspect-video content-center group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 ease-out flex items-center justify-center">
            <ZoomIn className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out transform scale-75 group-hover:scale-100" />
          </div>
        </div>
      ) : isVideo ? (
        <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-sm">
          <CustomVideoPlayer
            src={mediaFile.url}
            title={mediaFile.name || t("videoPlayer")}
          />
        </div>
      ) : isPdf ? (
        <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
          <iframe
            src={mediaFile.url}
            title={mediaFile.name || t("pdfPreview")}
            className="w-full h-full border-0"
            // sandbox="allow-scripts allow-same-origin" // Consider sandboxing for security if PDFs are from untrusted sources
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-4 w-full h-full bg-muted/20 group-hover:bg-muted/30 transition-colors duration-200">
          <FileText className="h-16 w-16 text-muted-foreground/70 mb-3 group-hover:text-muted-foreground transition-colors duration-200" />
          <p
            className="text-sm font-semibold text-foreground/90 truncate w-full px-2 group-hover:text-foreground transition-colors duration-200"
            title={mediaFile.name || t("file")}
          >
            {mediaFile.name || t("file")}
          </p>
          {mediaFile.type && (
            <p className="text-xs text-muted-foreground/80 mt-1 group-hover:text-muted-foreground transition-colors duration-200">
              {mediaFile.type}
            </p>
          )}
        </div>
      )}

      {/* Download button - styled for better appeal and consistency */}
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownload} // handleDownload now includes stopPropagation
        className={cn(
          "absolute top-2.5 right-2.5 h-9 w-9 p-0 rounded-full shadow-md transition-all duration-200 ease-out",
          "bg-background/80 hover:bg-primary hover:text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "dark:bg-neutral-800/80 dark:hover:bg-primary dark:text-white dark:hover:text-primary-foreground",
          isImage
            ? "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transform-gpu"
            : "opacity-90 hover:opacity-100 scale-100 hover:scale-105"
        )}
        aria-label={t("downloadFile", {
          name: mediaFile.name || t("unnamedFile"),
        })}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default memo(MediaFileItem);
