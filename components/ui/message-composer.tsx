import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Send,
  Loader2,
  Paperclip,
  Package,
  X,
  MessageSquare,
  FileText,
  Settings,
  Image as ImageIcon,
  Eye,
  Plus,
  ImagePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUpload, FileAttachButton } from "@/components/ui/file-upload";
import { PackageOnlySelector } from "@/components/ui/package-item-selector";
import { useSendMessageWithFiles } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/useAuth";
import { Progress } from "@/components/ui/progress"; // Import Progress component

interface MessageComposerProps {
  chatId: string | number;
  senderId: number;
  clientId?: string | number;
  page?: number;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onMessageSent?: () => void;
}

export function MessageComposer({
  chatId,
  senderId,
  clientId,
  page = 1,
  disabled = false,
  placeholder = "Type your message...",
  className,
  onMessageSent,
}: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState<
    Record<string, number>
  >({}); // State for file upload progress
  const [packageSelection, setPackageSelection] = useState({
    isItem: false,
    itemType: "",
    packageItemId: "",
    clientPackageId: "",
  });
  const [filePreviewUrls, setFilePreviewUrls] = useState<
    Record<string, string>
  >({});
  const { session } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const sendMessageMutation = useSendMessageWithFiles(chatId, page, senderId);

  // Helper to generate a unique ID for a file
  const getFileId = (file: File): string => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  // Create preview URLs for images
  useEffect(() => {
    const newPreviewUrls: Record<string, string> = {};

    files.forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        const key = `${file.name}-${index}`;
        if (!filePreviewUrls[key]) {
          newPreviewUrls[key] = URL.createObjectURL(file);
        }
      }
    });

    if (Object.keys(newPreviewUrls).length > 0) {
      setFilePreviewUrls((prev) => ({ ...prev, ...newPreviewUrls }));
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

    Object.keys(filePreviewUrls).forEach((key) => {
      if (!currentFileKeys.includes(key)) {
        urlsToRevoke.push(filePreviewUrls[key]);
      }
    });

    if (urlsToRevoke.length > 0) {
      urlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
      setFilePreviewUrls((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          if (!currentFileKeys.includes(key)) {
            delete updated[key];
          }
        });
        return updated;
      });
    }
  }, [files, filePreviewUrls]);

  const hasContent = message.trim() || files.length > 0;
  const hasPackageSelection =
    packageSelection.isItem &&
    (packageSelection.itemType ||
      packageSelection.packageItemId ||
      packageSelection.clientPackageId);

  const handleSendMessage = useCallback(async () => {
    if (!hasContent || disabled) return;

    // Simulate progress updates for UI development
    const newFileUploadProgress: Record<string, number> = {};
    files.forEach((file) => {
      const fileId = getFileId(file);
      newFileUploadProgress[fileId] = 0; // Initialize progress
    });
    setFileUploadProgress(newFileUploadProgress);

    // Simulate actual upload and progress reporting
    for (const file of files) {
      const fileId = getFileId(file);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          setFileUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
        } else {
          clearInterval(interval);
        }
      }, 200); // Simulate progress update every 200ms
    }
    // End of simulation block

    const messageData = {
      message: message.trim(),
      media: files.length > 0 ? files : undefined,
      item_type: packageSelection.isItem
        ? packageSelection.itemType
        : undefined,
      package_item_id:
        packageSelection.isItem && packageSelection.packageItemId
          ? packageSelection.packageItemId
          : undefined,
      client_package_id: packageSelection.isItem
        ? packageSelection.clientPackageId
        : undefined,
      IsItem: packageSelection.isItem ? "1" : "0",
    };
    console.log("MessageComposer - Enhanced Send Message Debug:", {
      messageData,
      packageSelection,
      hasPackageSelection,
      packageItemIdPresent: !!messageData.package_item_id,
      packageItemIdValue: messageData.package_item_id,
      willSendPackageItemId:
        packageSelection.isItem && !!packageSelection.packageItemId,
      messageDataStringified: JSON.stringify(messageData, null, 2),
      timestamp: new Date().toISOString(),
    });

    try {
      await sendMessageMutation.mutateAsync(messageData); // Reset form
      setMessage("");
      setFiles([]);
      setFileUploadProgress({}); // Reset progress on send

      // Cleanup preview URLs
      Object.values(filePreviewUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
      setFilePreviewUrls({});
      setPackageSelection({
        isItem: false,
        itemType: "",
        packageItemId: "",
        clientPackageId: "",
      });
      setIsDialogOpen(false);

      onMessageSent?.();
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [
    hasContent,
    disabled,
    message,
    files,
    packageSelection,
    sendMessageMutation,
    onMessageSent,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handlePackageSelectionChange = useCallback(
    (selection: {
      isItem: boolean;
      itemType?: string;
      packageItemId?: string;
      clientPackageId?: string;
    }) => {
      console.log("MessageComposer - Enhanced Package Selection Change:", {
        previousSelection: packageSelection,
        newSelection: selection,
        hasPackageItemId: !!selection.packageItemId,
        packageItemIdValue: selection.packageItemId,
        isItemType: selection.isItem,
        itemType: selection.itemType,
        clientPackageId: selection.clientPackageId,
        timestamp: new Date().toISOString(),
      });

      setPackageSelection({
        isItem: selection.isItem,
        itemType: selection.itemType || "",
        packageItemId: selection.packageItemId || "",
        clientPackageId: selection.clientPackageId || "",
      });

      // Additional validation logging
      if (selection.isItem && !selection.packageItemId) {
        console.warn(
          "MessageComposer - WARNING: Package selection is item but no packageItemId provided:",
          selection
        );
      }

      if (selection.isItem && selection.packageItemId) {
        console.log(
          "MessageComposer - SUCCESS: Package item ID will be sent to server:",
          {
            packageItemId: selection.packageItemId,
            itemType: selection.itemType,
            clientPackageId: selection.clientPackageId,
          }
        );
      }
    },
    [packageSelection]
  );
  const handleQuickFileAttach = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    if (newFiles.length > 0) {
      setIsDialogOpen(true);
    }
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = files[index];
    const fileKey = `${fileToRemove.name}-${index}`;
    const fileId = getFileId(fileToRemove);

    // Cleanup preview URL if it exists
    if (filePreviewUrls[fileKey]) {
      URL.revokeObjectURL(filePreviewUrls[fileKey]);
      setFilePreviewUrls((prev) => {
        const updated = { ...prev };
        delete updated[fileKey];
        return updated;
      });
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileUploadProgress((prev) => {
      const updatedProgress = { ...prev };
      delete updatedProgress[fileId];
      return updatedProgress;
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Message Input */}
      <div className="flex gap-2 justify-between  items-end w-full">
        <div className="flex-1 space-y-2 w-full">
          {/* Quick File Preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded-md bg-muted/50">
              {files.slice(0, 3).map((file, index) => {
                const fileKey = `${file.name}-${index}`;
                const fileId = getFileId(file);
                const isImage = file.type.startsWith("image/");
                const previewUrl = filePreviewUrls[fileKey];
                const progress = fileUploadProgress[fileId];

                return (
                  <div
                    key={fileKey}
                    className="relative group w-16 h-16 flex flex-col items-center justify-center"
                  >
                    {isImage && previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={file.name}
                        className="w-full h-full object-cover rounded-md border"
                      />
                    ) : (
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    )}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute -top-1 -right-1 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {progress !== undefined && progress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 w-full px-0.5">
                        <Progress
                          value={progress}
                          className="h-1.5 w-full"
                        />
                      </div>
                    )}
                    {/* Overlay for image zoom/preview icon */}
                    {isImage && previewUrl && (
                      <div className="absolute inset-0 bg-black/30 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
              {files.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs"
                >
                  +{files.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Package Selection Preview */}
          {hasPackageSelection && (
            <div className="flex items-center gap-2">
              <Badge
                variant="default"
                className="text-xs flex items-center gap-1 w-fit"
              >
                <Package className="w-3 h-3" />
                Package Item Selected
              </Badge>
              {packageSelection.itemType && (
                <Badge
                  variant="outline"
                  className="text-xs"
                >
                  {packageSelection.itemType}
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-2 w-full">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || sendMessageMutation.isPending}
              className="flex-1"
            />

            {/* Quick Actions */}
            <div className="flex gap-1">
              {/* Advanced Options Dialog */}
              <Dialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
              >
                {" "}
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={disabled || sendMessageMutation.isPending}
                    className="h-8 w-8 p-0"
                    title="Attach files"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto p-4 sm:p-5">
                  {" "}
                  <DialogHeader className="pb-2">
                    <DialogTitle className="flex items-center gap-1.5 text-base">
                      <Paperclip className="w-4 h-4" />
                      Attach Files & Options
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    {/* IsItem Toggle - Compact version */}
                    <div className="p-2 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-between">
                      <div className="flex-1">
                        <Label
                          htmlFor="dialog-is-item"
                          className="text-sm font-medium flex items-center gap-1.5 cursor-pointer"
                        >
                          <Package className="w-3.5 h-3.5 text-primary" />
                          Include Package Item
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Include a package item with this message
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "text-xs font-medium transition-colors",
                            packageSelection.isItem
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          {packageSelection.isItem ? "On" : "Off"}
                        </span>
                        <Switch
                          id="dialog-is-item"
                          checked={packageSelection.isItem}
                          onCheckedChange={(checked) =>
                            handlePackageSelectionChange({ isItem: checked })
                          }
                          disabled={disabled || sendMessageMutation.isPending}
                          className="data-[state=checked]:bg-primary h-5"
                        />
                      </div>
                    </div>

                    <Tabs
                      defaultValue="files"
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 h-8">
                        <TabsTrigger
                          value="files"
                          className="flex items-center gap-1 text-xs px-2"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          Files ({files.length})
                        </TabsTrigger>
                        <TabsTrigger
                          value="package"
                          className="flex items-center gap-1 text-xs px-2"
                          disabled={!packageSelection.isItem}
                        >
                          <Package className="w-3.5 h-3.5" />
                          Package
                          {!packageSelection.isItem && " (Disabled)"}
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value="files"
                        className="mt-2"
                      >
                        <FileUpload
                          files={files}
                          onFilesChange={setFiles}
                          disabled={disabled || sendMessageMutation.isPending}
                          maxFiles={10}
                          maxFileSize={2024 * 1024 * 1024} // 2GB
                        />
                      </TabsContent>{" "}
                      <TabsContent
                        value="package"
                        className="mt-2"
                      >
                        {packageSelection.isItem &&
                        (session?.user.role == "admin" ||
                          session?.user.role == "team") ? (
                          <PackageOnlySelector
                            chatId={chatId}
                            onSelectionChange={handlePackageSelectionChange}
                            disabled={disabled || sendMessageMutation.isPending}
                          />
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <Package className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
                            <p className="text-xs">
                              {`Enable "Include Package Item" toggle above`}
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                  <DialogFooter className="mt-3 pt-2 border-t border-border/40">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      size="sm"
                      className="h-8 text-xs"
                    >
                      Done
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSendMessage}
          disabled={!hasContent || disabled || sendMessageMutation.isPending}
          size="icon"
          className="h-10 w-10"
        >
          {sendMessageMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Status Indicators */}
      {sendMessageMutation.isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Sending message...
        </div>
      )}
    </div>
  );
}

const FileUploadArea = ({
  files,
  setFiles, // Added setFiles to handle direct file input change
  onRemoveFile,
  filePreviewUrls,
  fileUploadProgress, // Receive progress state
  getFileId, // Receive getFileId helper
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onRemoveFile: (index: number) => void;
  filePreviewUrls: Record<string, string>;
  fileUploadProgress: Record<string, number>;
  getFileId: (file: File) => string;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label
          htmlFor="file-upload-dialog"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
        >
          <ImagePlus className="w-10 h-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag & drop files here, or click to select files
          </p>
          <input
            id="file-upload-dialog"
            type="file"
            className="sr-only"
            multiple
            onChange={handleFileChange}
          />
        </Label>
      </div>

      {files.length > 0 && (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          <h4 className="text-md font-medium">Selected Files:</h4>
          {files.map((file, index) => {
            const fileKey = `${file.name}-${index}`;
            const fileId = getFileId(file);
            const isImage = file.type.startsWith("image/");
            const previewUrl = filePreviewUrls[fileKey];
            const progress = fileUploadProgress[fileId];

            return (
              <Card
                key={fileKey}
                className="p-3 flex items-center gap-3 group hover:bg-muted/50 transition-colors"
              >
                {isImage && previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded-md border"
                  />
                ) : (
                  <FileText className="w-10 h-10 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(file.size / 1024)} KB
                  </p>
                  {progress !== undefined && progress < 100 && (
                    <div className="mt-1">
                      <Progress
                        value={progress}
                        className="h-1.5 w-full"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {progress.toFixed(0)}%
                      </p>
                    </div>
                  )}
                  {progress === 100 && (
                    <p className="text-xs text-green-600 dark:text-green-500">
                      Uploaded
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveFile(index)}
                  className="opacity-50 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
