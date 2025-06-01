"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignPackage,
  AssignPackageData,
  getAssignedPackages,
  getDetailedClientPackage,
  updateClientPackageItemStatus,
  acceptClientPackageItem,
  editClientPackageItem,
  declineClientPackageItem,
} from "@/actions/assign-package";
import { showNotification } from "@/lib/show-notification";
import { useTranslations } from "next-intl";
import { PACKAGES_QUERY_KEY } from "./use-packages";
import { CHATS_QUERY_KEY } from "./use-chats";
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
      status: "pending" | "accepted" | "completed" | "declined" | "delivered";
      notes?: string;
    }) => updateClientPackageItemStatus(clientPackageItemId, status, notes),
    onSuccess: () => {
      // Invalidate multiple query keys for comprehensive revalidation
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });

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

export function useAcceptClientPackageItem() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (clientPackageItemId: number) =>
      acceptClientPackageItem(clientPackageItemId),
    onSuccess: () => {
      // Invalidate multiple query keys for comprehensive revalidation
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });

      showNotification(
        t("package.itemAccepted", {
          default: "Item accepted successfully!",
        }),
        "success"
      );
    },
    onError: (error: Error) => {
      showNotification(
        error.message ||
          t("package.itemAcceptError", {
            default: "Failed to accept item",
          }),
        "error"
      );
    },
  });
}

export function useEditClientPackageItem() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (clientPackageItemId: number) =>
      editClientPackageItem(clientPackageItemId),
    onSuccess: () => {
      // Invalidate multiple query keys for comprehensive revalidation
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });

      showNotification(
        t("package.itemEditRequested", {
          default: "Edit requested successfully!",
        }),
        "success"
      );
    },
    onError: (error: Error) => {
      showNotification(
        error.message ||
          t("package.itemEditError", {
            default: "Failed to request edit",
          }),
        "error"
      );
    },
  });
}

export function useDeclineClientPackageItem() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (clientPackageItemId: number) =>
      declineClientPackageItem(clientPackageItemId),
    onSuccess: () => {
      // Invalidate multiple query keys for comprehensive revalidation
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });

      showNotification(
        t("package.itemDeclined", {
          default: "Item declined successfully!",
        }),
        "success"
      );
    },
    onError: (error: Error) => {
      showNotification(
        error.message ||
          t("package.itemDeclineError", {
            default: "Failed to decline item",
          }),
        "error"
      );
    },
  });
}
