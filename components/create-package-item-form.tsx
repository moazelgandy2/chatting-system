"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { toast } from "sonner";
import { useCreatePackageItem } from "@/hooks/use-create-package-item";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
// Assuming you have a hook to get the current user's ID
// import { useAuth } from "@/hooks/useAuth";

const packageItemFormSchema = z.object({
  status: z.string().min(1), // Assuming status is a string, adjust validation as needed
  notes: z.string().optional(),
});

type PackageItemFormType = z.infer<typeof packageItemFormSchema>;

interface PackageItemFormProps {
  packageId: number;
  itemTypeId: number;
  onPackageItemCreated: () => void;
  onBack: () => void;
}

export function PackageItemForm({
  packageId,
  itemTypeId,
  onPackageItemCreated,
  onBack,
}: PackageItemFormProps) {
  const t = useTranslations();
  // const { user } = useAuth(); // Assuming useAuth provides the current user
  // const created_by = user?.id; // Get the user ID
  const created_by = 1; // TODO: Replace with actual user ID from auth hook

  const {
    mutateAsync: createPackageItemMutate,
    isPending: isCreatingPackageItem,
  } = useCreatePackageItem();

  const form = useForm<PackageItemFormType>({
    resolver: zodResolver(packageItemFormSchema),
    defaultValues: {
      status: "pending", // Default status as per your API example
      notes: "",
    },
  });

  const handleCreatePackageItemSubmit = async (data: PackageItemFormType) => {
    if (!created_by) {
      toast.error("User not authenticated."); // Handle case where user ID is not available
      return;
    }
    try {
      await createPackageItemMutate({
        package_id: packageId,
        type_id: itemTypeId,
        status: data.status,
        notes: data.notes || "",
        created_by: created_by,
      });
      toast.success(t("packageItem.createdSuccessfully")); // Assuming you'll add this key
      onPackageItemCreated();
    } catch (error: any) {
      console.error("[ERROR_CREATING_PACKAGE_ITEM_FORM]", error);
      toast.error(error?.message || t("common.error"));
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>{t("create.packageItemTitle")}</DialogTitle>
        <DialogDescription>
          {t("create.packageItemDescription")}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreatePackageItemSubmit)}
          className="space-y-6 py-4"
        >
          {/* Status Field (can be a select/dropdown) */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("packageItem.status")}</FormLabel>{" "}
                {/* Assuming packageItem.status key */}
                <FormControl>
                  <Input
                    {...field}
                    // This could be a select or radio group for predefined statuses
                    placeholder="Enter status (e.g., pending)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes Field */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("create.itemNotes")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("create.itemNotesPlaceholder")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isCreatingPackageItem}
          >
            {isCreatingPackageItem ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.creating")}
              </>
            ) : (
              t("create.createPackageItemButton")
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            {t("create.back")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
