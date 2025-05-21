"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import {
  packageItemFormSchema,
  PackageItemFormType,
} from "@/forms/create-package-item.schema";
import { toast } from "sonner";
import Notification from "@/components/kokonutui/notification";
import { useItemTypes } from "@/hooks/use-package-items";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CreatePackageItemForm = ({
  handleSubmit,
  isSubmitting,
  error,
  packageId,
  createdBy,
}: {
  handleSubmit: (values: PackageItemFormType) => void;
  isSubmitting: boolean;
  error: string | null;
  packageId: number;
  createdBy: number;
}) => {
  const t = useTranslations();
  const { data: itemTypes, isLoading: isLoadingItemTypes } = useItemTypes();
  console.log("packageId", packageId);
  console.log("createdBy", itemTypes, isLoadingItemTypes);
  const form = useForm<PackageItemFormType>({
    resolver: zodResolver(packageItemFormSchema),
    defaultValues: {
      package_id: packageId,
      type_id: undefined,
      status: "pending",
      notes: "",
      created_by: createdBy,
    },
  });

  const handleFormSubmit = async (data: PackageItemFormType) => {
    try {
      handleSubmit(data);
    } catch (e) {
      console.log("[ERROR_CREATING_PACKAGE_ITEM_FORM]", e);
      toast.custom(() => (
        <Notification
          message={error || "Something went wrong!"}
          type="error"
        />
      ));
    }
  };

  if (error) {
    toast.custom(() => (
      <Notification
        message={error}
        type="error"
      />
    ));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-8"
      >
        {/* package_id field (hidden or read-only) */}
        {/* type_id field (select) */}
        <FormField
          control={form.control}
          name="type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.itemType.title")}</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
                disabled={isLoadingItemTypes}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {itemTypes?.data.map((type: any) => (
                    <SelectItem
                      key={type.id}
                      value={type.id.toString()}
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* status field (hidden or default) */}
        {/* notes field (input) */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.notes.title")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* created_by field (hidden or read-only) */}
        <Button
          type="submit"
          disabled={isSubmitting || isLoadingItemTypes}
        >
          {isSubmitting ? t("form.submitting") : t("form.submit")}
        </Button>
      </form>
    </Form>
  );
};
