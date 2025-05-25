"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignPackage,
  AssignPackageData,
  getAssignedPackages,
  getDetailedClientPackage,
  updateClientPackageItemStatus,
} from "@/actions/assign-package";
import { showNotification } from "@/lib/show-notification";
import { useTranslations } from "next-intl";
import { PACKAGES_QUERY_KEY } from "./use-packages";
import {
  AssignedPackagesListResponse,
  DetailedAssignedPackageResponse,
} from "@/types/packages";

export function useAssignPackage() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (data: AssignPackageData) => assignPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      showNotification(
        t("package.assigned", {
          default: "Package assigned successfully!",
        }),
        "success"
      );
    },
    onError: (error: Error) => {
      showNotification(
        error.message ||
          t("package.assignError", {
            default: "Failed to assign package",
          }),
        "error"
      );
    },
  });
}

export function useAssignedPackages(chatId: string) {
  return useQuery<AssignedPackagesListResponse>({
    queryKey: [PACKAGES_QUERY_KEY, "assigned", chatId],
    queryFn: () => getAssignedPackages(chatId),
    enabled: !!chatId,
  });
}

export function useDetailedClientPackage(clientPackageId?: number) {
  return useQuery<DetailedAssignedPackageResponse>({
    queryKey: [PACKAGES_QUERY_KEY, "detailed", clientPackageId],
    queryFn: () => getDetailedClientPackage(clientPackageId!),
    enabled: !!clientPackageId,
  });
}

export function useUpdateClientPackageItemStatus() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: ({
      clientPackageItemId,
      status,
      notes,
    }: {
      clientPackageItemId: number;
      status:
        | "pending"
        | "in_progress"
        | "completed"
        | "declined"
        | "delivered";
      notes?: string;
    }) => updateClientPackageItemStatus(clientPackageItemId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      showNotification(
        t("package.itemStatusUpdated", {
          default: "Item status updated successfully!",
        }),
        "success"
      );
    },
    onError: (error: Error) => {
      showNotification(
        error.message ||
          t("package.itemStatusUpdateError", {
            default: "Failed to update item status",
          }),
        "error"
      );
    },
  });
}
