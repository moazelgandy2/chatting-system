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
import { useClientRemainingLimitsRevalidate } from "./use-client-remaining-limits";

export function useAssignPackage({ chatId }: { chatId: string }) {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const clientLimitsRevalidate = useClientRemainingLimitsRevalidate({
    chatId,
  });
  return useMutation({
    mutationFn: (data: AssignPackageData) => assignPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      clientLimitsRevalidate();

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

export function useUpdateClientPackageItemStatus({
  chatId,
}: {
  chatId: string;
}) {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const clientLimitsRevalidate = useClientRemainingLimitsRevalidate({
    chatId,
  });

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

      clientLimitsRevalidate();

      showNotification(
        t("package.itemStatusUpdated", {
          default: "Item status updated successfully!",
        }),
        "success"
      );
    },
    onError: (error: Error) => {
      console.error("Error updating item status:", error);
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

export function useAcceptClientPackageItem({ chatId }: { chatId: number }) {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const clientLimitsRevalidate = useClientRemainingLimitsRevalidate({
    chatId: String(chatId), // Convert number to string
  });

  return useMutation({
    mutationFn: (clientPackageItemId: number) =>
      acceptClientPackageItem(clientPackageItemId),
    onSuccess: (data) => {
      // Invalidate multiple query keys for comprehensive revalidation
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });
      clientLimitsRevalidate();

      showNotification(
        data?.message ||
          t("package.itemAccepted", {
            default: "Item accepted successfully!",
          }),
        "success"
      );
    },
    onError: (error: Error) => {
      const cause = error.cause as any;
      let finalMessage: string;

      if (cause && (cause.status === 429 || cause.statusCode === 429)) {
        finalMessage = t("package.maxAcceptReached", {
          default: "Maximum accept requests reached.",
        });
      } else if (cause && cause.message) {
        finalMessage = cause.message;
      } else {
        finalMessage =
          error.message ||
          t("package.itemAcceptError", { default: "Failed to accept item" });
      }
      showNotification(finalMessage, "error");
    },
  });
}

export function useEditClientPackageItem({ chatId }: { chatId: number }) {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const clientLimitsRevalidate = useClientRemainingLimitsRevalidate({
    chatId: String(chatId), // Convert number to string
  });
  return useMutation({
    mutationFn: (clientPackageItemId: number) =>
      editClientPackageItem(clientPackageItemId),
    onSuccess: (data) => {
      // Invalidate multiple query keys for comprehensive revalidation
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });
      clientLimitsRevalidate();

      showNotification(
        data?.message ||
          t("package.itemEditRequested", {
            default: "Edit requested successfully!",
          }),
        "success"
      );
    },
    onError: (error: Error) => {
      const cause = error.cause as any;
      let finalMessage: string;

      if (cause && (cause.status === 429 || cause.statusCode === 429)) {
        finalMessage = t("package.maxEditReached", {
          default: "Maximum edit requests reached.",
        });
      } else {
        // For this action, error.message already prefers cause.message if available
        finalMessage =
          error.message ||
          t("package.itemEditError", { default: "Failed to request edit" });
      }
      showNotification(finalMessage, "error");
    },
  });
}

export function useDeclineClientPackageItem({ chatId }: { chatId: number }) {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const clientLimitsRevalidate = useClientRemainingLimitsRevalidate({
    chatId: String(chatId), // Convert number to string
  });

  return useMutation({
    mutationFn: (clientPackageItemId: number) =>
      declineClientPackageItem(clientPackageItemId),
    onSuccess: (data) => {
      // Invalidate multiple query keys for comprehensive revalidation
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CHATS_QUERY_KEY] });
      clientLimitsRevalidate();

      showNotification(
        data?.message ||
          t("package.itemDeclined", {
            default: "Item declined successfully!",
          }),
        "success"
      );
    },
    onError: (error: Error) => {
      const cause = error.cause as any;
      let finalMessage: string;

      if (cause && (cause.status === 429 || cause.statusCode === 429)) {
        finalMessage = t("package.maxDeclineReached", {
          default: "Maximum decline requests reached.",
        });
      } else if (cause && cause.message) {
        finalMessage = cause.message;
      } else {
        finalMessage =
          error.message ||
          t("package.itemDeclineError", { default: "Failed to decline item" });
      }
      showNotification(finalMessage, "error");
    },
  });
}
