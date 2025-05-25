"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { storeClientLimits, ClientLimitData } from "@/actions/client-limits";
import { showNotification } from "@/lib/show-notification";
import { useTranslations } from "next-intl";
import { PACKAGES_QUERY_KEY } from "./use-packages";

export const CLIENT_LIMITS_QUERY_KEY = "clientLimits";

export function useStoreClientLimits() {
  const queryClient = useQueryClient();
  const t = useTranslations();

  return useMutation({
    mutationFn: (data: ClientLimitData) => storeClientLimits(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLIENT_LIMITS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      showNotification(
        t("clientLimits.stored", {
          default: "Client limits stored successfully!",
        }),
        "success"
      );
    },
    onError: (error: Error) => {
      showNotification(
        error.message ||
          t("clientLimits.error", {
            default: "Failed to store client limits",
          }),
        "error"
      );
      console.error("Error storing client limits:", error);
    },
  });
}
