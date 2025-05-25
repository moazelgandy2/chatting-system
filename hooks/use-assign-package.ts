"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignPackage,
  AssignPackageData,
  getAssignedPackages,
} from "@/actions/assign-package";
import { showNotification } from "@/lib/show-notification";
import { useTranslations } from "next-intl";
import { PACKAGES_QUERY_KEY } from "./use-packages";
import { AssignedPackageResponse } from "@/types/packages";

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
  return useQuery<AssignedPackageResponse>({
    queryKey: [PACKAGES_QUERY_KEY, "assigned", chatId],
    queryFn: () => getAssignedPackages(chatId),
    enabled: !!chatId,
  });
}
