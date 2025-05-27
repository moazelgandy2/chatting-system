"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Package, ShoppingCart, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAvailableItemTypes } from "@/hooks/use-available-item-types";
import { useClientPackageItems } from "@/hooks/use-client-package-items";
import { useAssignedPackages } from "@/hooks/use-assign-package";

interface PackageOnlySelectorProps {
  chatId: string | number;
  onSelectionChange: (selection: {
    isItem: boolean;
    itemType?: string;
    packageItemId?: string;
    clientPackageId?: string;
  }) => void;
  disabled?: boolean;
  className?: string;
}

export function PackageOnlySelector({
  chatId,
  onSelectionChange,
  disabled = false,
  className,
}: PackageOnlySelectorProps) {
  const [selectedItemType, setSelectedItemType] = useState<string>("");
  const [selectedPackageItemId, setSelectedPackageItemId] =
    useState<string>("");

  // Fetch assigned packages for the chat
  const { data: assignedPackages, isLoading: isLoadingPackages } =
    useAssignedPackages(chatId.toString());

  // Get the client package ID from assigned packages
  const clientPackageId = assignedPackages?.data?.id?.toString();

  // Fetch available item types based on client limits
  const { data: availableItemTypes, isLoading: isLoadingTypes } =
    useAvailableItemTypes(clientPackageId || "");

  // Fetch client package items for specific item selection
  const { data: packageItems, isLoading: isLoadingItems } =
    useClientPackageItems(clientPackageId || "");

  // Filter package items by selected type
  const filteredPackageItems = useMemo(() => {
    if (!packageItems || !Array.isArray(packageItems) || !selectedItemType)
      return [];
    return packageItems.filter(
      (item: any) => item.item_type === selectedItemType
    );
  }, [packageItems, selectedItemType]); // Debug logging
  console.log("PackageOnlySelector Debug:", {
    chatId,
    clientPackageId,
    assignedPackagesRaw: assignedPackages,
    assignedPackagesData: assignedPackages?.data,
    availableItemTypes,
    packageItems,
    filteredPackageItems,
    selectedItemType,
    isLoadingTypes,
    isLoadingItems,
  });

  const handleItemTypeChange = (value: string) => {
    setSelectedItemType(value);
    setSelectedPackageItemId(""); // Reset package item selection

    onSelectionChange({
      isItem: true,
      itemType: value, // Send the type name directly
      clientPackageId: clientPackageId,
    });
  };

  const handlePackageItemChange = (value: string) => {
    setSelectedPackageItemId(value);

    onSelectionChange({
      isItem: true,
      itemType: selectedItemType,
      packageItemId: value,
      clientPackageId: clientPackageId,
    });
  };

  if (isLoadingPackages) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading packages...
          </span>
        </CardContent>
      </Card>
    );
  }
  if (!assignedPackages?.data) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-6">
          <AlertCircle className="w-6 h-6 text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            No packages assigned to this chat
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Assigned Package Info */}
      <div className="space-y-4 p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">
            Package Selection
          </h3>
        </div>
        {/* Assigned Package Display */}
        <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
          <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Assigned Package
          </h4>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Package #{assignedPackages.data.package_id}</span>
            <Badge
              variant="secondary"
              className="text-xs"
            >
              {assignedPackages.data.status}
            </Badge>
          </div>
        </div>{" "}
        <div className="space-y-4">
          {/* Item Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Item Type</Label>
            {isLoadingTypes ? (
              <div className="flex items-center gap-2 p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading available item types...
                </span>
              </div>
            ) : availableItemTypes && availableItemTypes.length > 0 ? (
              <Select
                value={selectedItemType}
                onValueChange={handleItemTypeChange}
                disabled={disabled}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select item type..." />
                </SelectTrigger>
                <SelectContent>
                  {availableItemTypes.map((type: any) => (
                    <SelectItem
                      key={type.id}
                      value={type.name}
                    >
                      <Badge
                        variant="outline"
                        className="capitalize"
                      >
                        {type.name}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                No item types available for this package
              </div>
            )}{" "}
          </div>

          {/* Specific Package Item Selection */}
          {selectedItemType && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Specific Package Item
              </Label>
              {isLoadingItems ? (
                <div className="flex items-center gap-2 p-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Loading package items...
                  </span>
                </div>
              ) : filteredPackageItems.length > 0 ? (
                <Select
                  value={selectedPackageItemId}
                  onValueChange={handlePackageItemChange}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select specific package item..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPackageItems.map((item: any) => (
                      <SelectItem
                        key={item.id}
                        value={item.id.toString()}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">
                            {item.content || `Item #${item.id}`}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Status: {item.status}</span>
                            <span>•</span>
                            <span>Package Item ID: {item.package_item_id}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  No package items available for this item type
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Optional: Select a specific package item, or leave empty to use
                just the item type
              </p>
            </div>
          )}

          {/* Selection Summary */}
          {selectedItemType && (
            <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-medium text-primary mb-2">
                Selection Summary
              </h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Package ID: {assignedPackages.data.package_id}</div>
                <div>
                  Item Type:{" "}
                  <Badge
                    variant="outline"
                    className="text-xs"
                  >
                    {selectedItemType}
                  </Badge>
                </div>
                {selectedPackageItemId && (
                  <div>Package Item ID: {selectedPackageItemId}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
