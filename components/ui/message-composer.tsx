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
  const [packageSelection, setPackageSelection] = useState({
    isItem: false,
    itemType: "",
    packageItemId: "",
    clientPackageId: "",
  });
  const [filePreviewUrls, setFilePreviewUrls] = useState<
    Record<string, string>
  >({});

  const inputRef = useRef<HTMLInputElement>(null);
  const sendMessageMutation = useSendMessageWithFiles(chatId, page, senderId);

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
    const fileKey = `${files[index].name}-${index}`;

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
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Message Input */}
      <div className="flex gap-2 justify-between  items-end w-full">
        <div className="flex-1 space-y-2 w-full">
          {/* Quick File Preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.slice(0, 3).map((file, index) => {
                const fileKey = `${file.name}-${index}`;
                const isImage = file.type.startsWith("image/");
                const previewUrl = filePreviewUrls[fileKey];

                return (
                  <div
                    key={fileKey}
                    className="relative group"
                  >
                    {isImage && previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3 h-3 text-white" />
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="absolute -top-1 -right-1 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-xs flex items-center gap-1 pr-1"
                      >
                        <FileText className="w-3 h-3" />
                        {file.name.length > 15
                          ? `${file.name.slice(0, 15)}...`
                          : file.name}
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
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
                          maxFileSize={50 * 1024 * 1024} // 50MB
                        />
                      </TabsContent>{" "}
                      <TabsContent
                        value="package"
                        className="mt-2"
                      >
                        {packageSelection.isItem ? (
                          <PackageOnlySelector
                            chatId={chatId}
                            onSelectionChange={handlePackageSelectionChange}
                            disabled={disabled || sendMessageMutation.isPending}
                          />
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <Package className="w-6 h-6 mx-auto mb-1.5 opacity-50" />
                            <p className="text-xs">
                              Enable "Include Package Item" toggle above
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
