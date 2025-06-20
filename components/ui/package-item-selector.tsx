"use client";

import { useState, useMemo, useEffect } from "react";
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
import {
  useEnhancedClientPackage,
  useNewItemTypes,
} from "@/hooks/use-new-client-package";
import { useAssignedPackages } from "@/hooks/use-assign-package";
import { ItemType } from "@/types/item-types";
import { EnhancedPackageItem } from "@/types/new-client-package";

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

  // Fetch assigned packages for the chat
  const { data: assignedPackages, isLoading: isLoadingPackages } =
    useAssignedPackages(chatId.toString());

  // Get the client package ID from assigned packages
  const clientPackageId = assignedPackages?.data?.id?.toString();

  // Fetch item types using new API
  const { data: itemTypes, isLoading: isLoadingTypes } = useNewItemTypes();

  // Fetch enhanced client package data using new API
  const {
    data: enhancedPackageData,
    isLoading: isLoadingItems,
    error: packageDataError,
  } = useEnhancedClientPackage(clientPackageId || "");

  // Enhanced debug logging for new data flow
  console.log("PackageOnlySelector Enhanced Debug:", {
    chatId,
    clientPackageId,
    assignedPackagesRaw: assignedPackages,
    assignedPackagesData: assignedPackages?.data,
    itemTypes,
    enhancedPackageData,
    packageDataError,
    selectedItemType,
    isLoadingTypes,
    isLoadingItems,
    isLoadingPackages,
  }); // Get available item types that have items in the package
  const availableItemTypes = useMemo(() => {
    // Add more defensive checks
    if (
      !enhancedPackageData?.package_items ||
      !Array.isArray(enhancedPackageData.package_items)
    ) {
      console.log(
        "No package items available or not an array:",
        enhancedPackageData?.package_items
      );
      return [];
    }

    if (!itemTypes?.data || !Array.isArray(itemTypes.data)) {
      console.log("No item types available or not an array:", itemTypes?.data);
      return [];
    } // Get unique type IDs from package items
    const typeIdsInPackage = [
      ...new Set(
        enhancedPackageData.package_items.map(
          (item: EnhancedPackageItem) => item.type_id
        )
      ),
    ];

    console.log("Type IDs in package:", typeIdsInPackage);
    console.log("Available item types:", itemTypes.data); // Filter item types to only include those with items in the package
    const filtered = itemTypes.data.filter((type: ItemType) =>
      typeIdsInPackage.includes(type.id)
    );
    console.log("Filtered available item types:", filtered);

    return filtered;
  }, [enhancedPackageData?.package_items, itemTypes]);
  // Remove the auto-selection logic and package item change handler since we only need type selection
  const handleItemTypeChange = (value: string) => {
    console.log("Item type selected:", {
      selectedType: value,
      previousType: selectedItemType,
      clientPackageId,
    });

    setSelectedItemType(value);

    // Find the item type ID from the selected type name
    const selectedItemTypeObj = itemTypes?.data?.find(
      (type: ItemType) => type.name === value
    );
    const selectedTypeId = selectedItemTypeObj?.id;

    // Find the corresponding package item with matching type_id
    let packageItemId: string | undefined = undefined;
    if (selectedTypeId && enhancedPackageData?.package_items) {
      const correspondingPackageItem = enhancedPackageData.package_items.find(
        (item: EnhancedPackageItem) => item.type_id === selectedTypeId
      );
      packageItemId = correspondingPackageItem?.id?.toString();
    }

    console.log("Package item resolution:", {
      selectedType: value,
      selectedTypeId,
      correspondingPackageItemId: packageItemId,
      availablePackageItems: enhancedPackageData?.package_items?.map(
        (item: EnhancedPackageItem) => ({
          id: item.id,
          type_id: item.type_id,
          item_type_name: item.item_type_name,
        })
      ),
    });

    // Immediately notify parent with the item type selection and package item ID
    onSelectionChange({
      isItem: true,
      itemType: value,
      packageItemId: packageItemId,
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
  if (packageDataError) {
    console.error("Package data error:", packageDataError);
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-6">
          <AlertCircle className="w-6 h-6 text-destructive" />
          <div className="ml-2 text-sm">
            <span className="text-destructive">Error loading package data</span>
            <div className="text-xs text-muted-foreground mt-1">
              {packageDataError.message}
            </div>
            <div className="text-xs text-muted-foreground">
              Check console for more details
            </div>
          </div>
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
          {enhancedPackageData && (
            <div className="mt-2 text-xs text-muted-foreground">
              <div>Client Package ID: {enhancedPackageData.id}</div>
              <div>
                Total Items: {enhancedPackageData.package_items?.length || 0}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Item Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Item Type</Label>{" "}
            {isLoadingTypes || isLoadingItems ? (
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
                  {availableItemTypes.map((type: ItemType) => (
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
            ) : enhancedPackageData ? (
              <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                No item types available for this package
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                Package data not loaded yet
              </div>
            )}
          </div>{" "}
          {/* Selection Summary */}
          {selectedItemType && (
            <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-medium text-primary mb-2">
                Selection Summary
              </h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Package ID: {assignedPackages.data.package_id}</div>
                <div>Client Package ID: {clientPackageId}</div>
                <div>
                  Selected Item Type:{" "}
                  <Badge
                    variant="outline"
                    className="text-xs"
                  >
                    {selectedItemType}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="default"
                    className="text-xs"
                  >
                    ✓ Type selected - ready to send
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
