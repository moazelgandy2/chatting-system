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
import { Switch } from "@/components/ui/switch";
import { Loader2, Package, ShoppingCart, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClientPackageItems } from "@/hooks/use-client-package-items";
import { useAssignedPackages } from "@/hooks/use-assign-package";

interface PackageItemSelectorProps {
  clientId: string | number;
  onSelectionChange: (selection: {
    isItem: boolean;
    itemType?: string;
    packageItemId?: string;
    clientPackageId?: string;
  }) => void;
  disabled?: boolean;
  className?: string;
}

export function PackageItemSelector({
  clientId,
  onSelectionChange,
  disabled = false,
  className,
}: PackageItemSelectorProps) {
  const [isItem, setIsItem] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<string>("");
  const [selectedPackageItemId, setSelectedPackageItemId] =
    useState<string>("");
  const [selectedClientPackageId, setSelectedClientPackageId] =
    useState<string>("");

  // Fetch assigned packages for the client
  const { data: assignedPackages, isLoading: isLoadingPackages } =
    useAssignedPackages(clientId.toString());

  // Fetch package items for the selected client package
  const { data: packageItems, isLoading: isLoadingItems } =
    useClientPackageItems(selectedClientPackageId);
  // Get unique item types from package items
  const itemTypes = useMemo(() => {
    if (!packageItems?.data) return [];
    const types = new Set(packageItems.data.map((item: any) => item.item_type));
    return Array.from(types) as string[];
  }, [packageItems]);
  // Filter package items by selected type
  const filteredPackageItems = useMemo(() => {
    if (!packageItems?.data || !selectedItemType) return [];
    return packageItems.data.filter(
      (item: any) => item.item_type === selectedItemType
    );
  }, [packageItems, selectedItemType]);

  const handleIsItemChange = (checked: boolean) => {
    setIsItem(checked);
    setSelectedItemType("");
    setSelectedPackageItemId("");
    setSelectedClientPackageId("");

    onSelectionChange({
      isItem: checked,
    });
  };

  const handleClientPackageChange = (value: string) => {
    setSelectedClientPackageId(value);
    setSelectedItemType("");
    setSelectedPackageItemId("");

    onSelectionChange({
      isItem,
      clientPackageId: value,
    });
  };

  const handleItemTypeChange = (value: string) => {
    setSelectedItemType(value);
    setSelectedPackageItemId("");

    onSelectionChange({
      isItem,
      itemType: value,
      clientPackageId: selectedClientPackageId,
    });
  };

  const handlePackageItemChange = (value: string) => {
    setSelectedPackageItemId(value);

    onSelectionChange({
      isItem,
      itemType: selectedItemType,
      packageItemId: value,
      clientPackageId: selectedClientPackageId,
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
            No packages assigned to this client
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="w-5 h-5 text-primary" />
          Package Item Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Item Toggle - Made more prominent */}
        <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                htmlFor="is-item"
                className="text-base font-semibold flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-primary" />
                Send Package Item
              </Label>
              <p className="text-sm text-muted-foreground">
                Toggle this to include a package item with your message
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  isItem ? "text-primary" : "text-muted-foreground"
                )}
              >
                {isItem ? "Enabled" : "Disabled"}
              </span>
              <Switch
                id="is-item"
                checked={isItem}
                onCheckedChange={handleIsItemChange}
                disabled={disabled}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </div>

        {/* Package Selection */}
        {isItem && (
          <div className="space-y-4 p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">
                Package Selection
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Client Package</Label>
                <Select
                  value={selectedClientPackageId}
                  onValueChange={handleClientPackageChange}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-full border-primary/30 focus:border-primary">
                    <SelectValue placeholder="Select a package..." />
                  </SelectTrigger>{" "}
                  <SelectContent>
                    <SelectItem
                      key={assignedPackages.data.id}
                      value={assignedPackages.data.id.toString()}
                    >
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
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Item Type Selection */}
              {selectedClientPackageId && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Item Type</Label>
                  {isLoadingItems ? (
                    <div className="flex items-center gap-2 p-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Loading items...
                      </span>
                    </div>
                  ) : itemTypes.length > 0 ? (
                    <Select
                      value={selectedItemType}
                      onValueChange={handleItemTypeChange}
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select item type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {itemTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                          >
                            <Badge
                              variant="outline"
                              className="capitalize"
                            >
                              {type}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      No items found in this package
                    </div>
                  )}
                </div>
              )}

              {/* Specific Item Selection */}
              {selectedItemType && filteredPackageItems.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Package Item</Label>
                  <Select
                    value={selectedPackageItemId}
                    onValueChange={handlePackageItemChange}
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select specific item..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPackageItems.map((item: any) => (
                        <SelectItem
                          key={item.id}
                          value={item.id.toString()}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{item.content}</span>
                            <span className="text-xs text-muted-foreground">
                              Status: {item.status}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Selection Summary */}
              {isItem &&
                (selectedClientPackageId ||
                  selectedItemType ||
                  selectedPackageItemId) && (
                  <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                    <h4 className="text-sm font-medium text-primary mb-2">
                      Selection Summary
                    </h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {selectedClientPackageId && (
                        <div>Package ID: {selectedClientPackageId}</div>
                      )}
                      {selectedItemType && (
                        <div>
                          Item Type:{" "}
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {selectedItemType}
                          </Badge>
                        </div>
                      )}
                      {selectedPackageItemId && (
                        <div>Item ID: {selectedPackageItemId}</div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
