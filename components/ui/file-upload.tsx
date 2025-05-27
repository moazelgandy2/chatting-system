"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Paperclip,
  X,
  Upload,
  File,
  Image,
  Video,
  FileText,
  Music,
  Archive,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  files,
  onFilesChange,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedFileTypes = ["*"],
  className,
  disabled = false,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create preview URLs for images
  useEffect(() => {
    const newPreviewUrls: Record<string, string> = {};

    files.forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        const key = `${file.name}-${index}`;
        if (!previewUrls[key]) {
          newPreviewUrls[key] = URL.createObjectURL(file);
        }
      }
    });

    if (Object.keys(newPreviewUrls).length > 0) {
      setPreviewUrls((prev) => ({ ...prev, ...newPreviewUrls }));
    }

    // Cleanup URLs when component unmounts or files change
    return () => {
      Object.values(newPreviewUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  // Cleanup preview URLs when files are removed
  useEffect(() => {
    const currentFileKeys = files.map((file, index) => `${file.name}-${index}`);
    const urlsToRevoke: string[] = [];

    Object.keys(previewUrls).forEach((key) => {
      if (!currentFileKeys.includes(key)) {
        urlsToRevoke.push(previewUrls[key]);
      }
    });

    if (urlsToRevoke.length > 0) {
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          if (!currentFileKeys.includes(key)) {
            delete updated[key];
          }
        });
        return updated;
      });
    }
  }, [files, previewUrls]);

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith("image/"))
      return <Image className="w-5 h-5 text-blue-500" />;
    if (type.startsWith("video/"))
      return <Video className="w-5 h-5 text-purple-500" />;
    if (type.startsWith("audio/"))
      return <Music className="w-5 h-5 text-green-500" />;
    if (type.includes("pdf") || type.includes("document"))
      return <FileText className="w-5 h-5 text-red-500" />;
    if (type.includes("zip") || type.includes("rar"))
      return <Archive className="w-5 h-5 text-orange-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File) => {
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)}`;
    }

    if (acceptedFileTypes[0] !== "*") {
      const isValidType = acceptedFileTypes.some((type) =>
        file.type.match(type.replace("*", ".*"))
      );
      if (!isValidType) {
        return `File type not supported. Accepted types: ${acceptedFileTypes.join(
          ", "
        )}`;
      }
    }

    return null;
  };

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const validFiles: File[] = [];
      const errors: string[] = [];

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else if (files.length + validFiles.length < maxFiles) {
          validFiles.push(file);
        } else {
          errors.push(`Maximum ${maxFiles} files allowed`);
        }
      });

      if (errors.length > 0) {
        console.error("File upload errors:", errors);
        // You can replace this with a toast notification
      }

      if (validFiles.length > 0) {
        onFilesChange([...files, ...validFiles]);
      }
    },
    [files, maxFiles, onFilesChange]
  );
  const removeFile = (index: number) => {
    const fileKey = `${files[index].name}-${index}`;

    // Cleanup preview URL if it exists
    if (previewUrls[fileKey]) {
      URL.revokeObjectURL(previewUrls[fileKey]);
      setPreviewUrls((prev) => {
        const updated = { ...prev };
        delete updated[fileKey];
        return updated;
      });
    }

    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* File Drop Area */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Drop files here or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} files, up to {formatFileSize(maxFileSize)} each
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept={acceptedFileTypes.join(",")}
        onChange={handleFileSelect}
        disabled={disabled}
      />{" "}
      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Selected Files ({files.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file, index) => {
              const fileKey = `${file.name}-${index}`;
              const isImage = file.type.startsWith("image/");
              const previewUrl = previewUrls[fileKey];

              return (
                <Card
                  key={fileKey}
                  className="p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      {/* File Icon or Image Preview */}
                      <div className="flex-shrink-0">
                        {isImage && previewUrl ? (
                          <div className="relative">
                            <img
                              src={previewUrl}
                              alt={file.name}
                              className="w-12 h-12 object-cover rounded-md border"
                            />
                            <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-md">
                            {getFileIcon(file)}
                          </div>
                        )}
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                        {isImage && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Image • Click to preview
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      disabled={disabled}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress[file.name] !== undefined && (
                    <div className="mt-3">
                      <Progress
                        value={uploadProgress[file.name]}
                        className="h-1"
                      />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Quick File Attach Button Component
export function FileAttachButton({
  onFilesSelect,
  disabled = false,
  className,
}: {
  onFilesSelect: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelect(Array.from(e.target.files));
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className={cn("h-8 w-8 p-0", className)}
      >
        <Paperclip className="w-4 h-4" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled}
      />
    </>
  );
}
