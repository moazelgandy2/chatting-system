"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPackages,
  deletePackage,
  createPackage,
  fetchAdminPackages,
} from "@/actions/packages";
import { PackageResponse } from "@/types/packages";
import { showNotification } from "@/lib/show-notification";
import { useTranslations } from "next-intl";
import { PackageFormType } from "@/forms/create-package.schema";

export const PACKAGES_QUERY_KEY = "packages";
export const ADMIN_PACKAGES_QUERY_KEY = "adminPackages";

export function usePackages() {
  return useQuery<PackageResponse>({
    queryKey: [PACKAGES_QUERY_KEY],
    queryFn: fetchPackages,
  });
}

export function useAdminPackages() {
  return useQuery<PackageResponse>({
    queryKey: [ADMIN_PACKAGES_QUERY_KEY],
    queryFn: fetchAdminPackages,
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      if (typeof showNotification !== "undefined") {
        showNotification("Package deleted successfully!", "success");
      }
    },
    onError: (error: Error) => {
      if (typeof showNotification !== "undefined") {
        showNotification(error.message || "Failed to delete package", "error");
      }
      console.error("Error deleting package:", error);
    },
  });

  return { mutation, mutate: mutation.mutateAsync };
}

export function useCreatePackage() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (packageData: PackageFormType) =>
      createPackage({
        ...packageData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      showNotification(
        t("package.created", {
          default: "Package created successfully!",
        }),
        "success"
      );
    },
  });
}
