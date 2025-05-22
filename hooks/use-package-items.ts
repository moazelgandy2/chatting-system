import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPackageItem,
  getItemTypes,
  storePackageAllowedItems,
} from "@/actions/package-items";
import { PackageItemFormType } from "@/forms/create-package-item.schema";
import { showNotification } from "@/lib/show-notification";
import { useTranslations } from "next-intl";
import { createPackageItemType } from "@/actions/package-items-types";

const PACKAGE_ITEMS_QUERY_KEY = "itemTypes";
export function useItemTypes() {
  return useQuery({
    queryKey: [PACKAGE_ITEMS_QUERY_KEY],
    queryFn: getItemTypes,
  });
}

export const useCreatePackageItemType = () => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (data: { name: string }) => createPackageItemType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PACKAGE_ITEMS_QUERY_KEY],
      });
      showNotification(
        t("package.form.success.create_package_type"),
        "success"
      );
    },
  });
};
export function useCreatePackageItem() {
  const queryClient = useQueryClient();
  const t = useTranslations();
  return useMutation({
    mutationFn: (data: PackageItemFormType) => createPackageItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PACKAGE_ITEMS_QUERY_KEY"] });
      showNotification(
        t("package.form.success.create_package_item", {
          default: "Package Item created successfully!",
        }),
        "success"
      );
    },
  });
}

export function useStorePackageAllowedItems() {
  const queryClient = useQueryClient();
  const t = useTranslations();
  return useMutation({
    mutationFn: (data: { package_item_id: number; allowed_count: number }) =>
      storePackageAllowedItems(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PACKAGE_ITEMS_QUERY_KEY"] });
      showNotification(
        t("package.form.success.store_package_allowed_items", {
          default: "Package allowed items stored successfully!",
        }),
        "success"
      );
    },
  });
}
