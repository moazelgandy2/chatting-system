"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PackageForm } from "@/components/create-package-form";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { PackagePlus } from "lucide-react";
import { PackageData } from "@/types/packages";
import { ItemTypeForm } from "@/components/create-item-type-form";
import { PackageItemForm } from "@/components/create-package-item-form";
import { X } from "lucide-react";

enum PackageCreationStep {
  Package = 1,
  ItemType = 2,
  PackageItem = 3,
}

export function PackageFormDialog() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(PackageCreationStep.Package);
  const [createdPackage, setCreatedPackage] = useState<PackageData | null>(
    null
  );
  const [selectedItemTypeId, setSelectedItemTypeId] = useState<number | null>(
    null
  );
  const [itemsAddedCount, setItemsAddedCount] = useState(0);
  const t = useTranslations();

  const handlePackageCreated = (packageData: PackageData) => {
    setCreatedPackage(packageData);
    setCurrentStep(PackageCreationStep.ItemType);
  };

  const handleItemTypeSelectedOrCreated = (itemTypeId: number) => {
    setSelectedItemTypeId(itemTypeId);
    setCurrentStep(PackageCreationStep.PackageItem);
  };

  const handlePackageItemCreated = () => {
    setItemsAddedCount((prevCount) => prevCount + 1);
    // After creating an item, go back to the ItemType step to add more
    setCurrentStep(PackageCreationStep.ItemType);
    setSelectedItemTypeId(null); // Reset selected item type for the next item
  };

  const handleFinishAddingItems = () => {
    // Close the dialog and reset state
    setOpen(false);
    setCurrentStep(PackageCreationStep.Package); // Reset
    setCreatedPackage(null); // Reset
    setSelectedItemTypeId(null); // Reset
    setItemsAddedCount(0); // Reset count
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => {
      if (prevStep === PackageCreationStep.PackageItem) {
        // If coming from PackageItem, go back to ItemType
        return PackageCreationStep.ItemType;
      } else if (prevStep === PackageCreationStep.ItemType) {
        // If coming from ItemType, go back to Package, and clear package data
        setCreatedPackage(null);
        return PackageCreationStep.Package;
      }
      // Otherwise, stay at the current step (or handle other steps if added later)
      return prevStep;
    });
  };

  // Close dialog and reset state if user clicks close button or outside
  const handleCloseDialog = (open: boolean) => {
    if (!open) {
      setOpen(false);
      setCurrentStep(PackageCreationStep.Package); // Reset
      setCreatedPackage(null); // Reset
      setSelectedItemTypeId(null); // Reset
      setItemsAddedCount(0); // Reset count
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case PackageCreationStep.Package:
        return (
          <PackageForm
            onSubmit={handlePackageCreated}
            onCancel={() => handleCloseDialog(false)}
          />
        );
      case PackageCreationStep.ItemType:
        return (
          <ItemTypeForm
            onItemTypeSelectedOrCreated={handleItemTypeSelectedOrCreated}
            onBack={handleBack}
          />
        );
      case PackageCreationStep.PackageItem:
        if (createdPackage && selectedItemTypeId !== null) {
          return (
            <PackageItemForm
              packageId={createdPackage.id}
              itemTypeId={selectedItemTypeId}
              onPackageItemCreated={handlePackageItemCreated}
              onBack={handleBack} // Back button goes to select Item Type
              onFinishAddingItems={handleFinishAddingItems} // New prop for finish button
              itemsAddedCount={itemsAddedCount} // Pass count to show finish button
            />
          );
        } else {
          // Should not happen if the flow is correct, but handle as a fallback
          return (
            <div>
              <DialogHeader>
                <DialogTitle>Error</DialogTitle>
                <DialogDescription>
                  Missing package or item type data.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Button onClick={() => handleCloseDialog(false)}>Close</Button>
              </div>
            </div>
          );
        }
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleCloseDialog}
    >
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PackagePlus className="w-4 h-4" />
          {t("create.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}
