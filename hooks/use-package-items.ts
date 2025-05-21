import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPackageItem, getItemTypes } from "@/actions/package-items";
import { PackageItemFormType } from "@/forms/create-package-item.schema";
import { showNotification } from "@/lib/show-notification";
import { useTranslations } from "next-intl";

const PACKAGE_ITEMS_QUERY_KEY = "itemTypes";
export function useItemTypes() {
  return useQuery({
    queryKey: [PACKAGE_ITEMS_QUERY_KEY],
    queryFn: getItemTypes,
  });
}

export function useCreatePackageItem() {
  const queryClient = useQueryClient();
  const t = useTranslations();
  return useMutation({
    mutationFn: (data: PackageItemFormType) => createPackageItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PACKAGE_ITEMS_QUERY_KEY"] });
      showNotification(
        t("auth.form.success.create_user", {
          default: "User created successfully!",
        }),
        "success"
      );
    },
  });
}
