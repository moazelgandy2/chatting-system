"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPackages, deletePackage } from "@/actions/packages";
import { PackageResponse } from "@/types/packages";
import { showNotification } from "@/lib/show-notification";

export const PACKAGES_QUERY_KEY = "packages";

export function usePackages() {
  return useQuery<PackageResponse>({
    queryKey: [PACKAGES_QUERY_KEY],
    queryFn: fetchPackages,
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PACKAGES_QUERY_KEY] });
      // Assuming showNotification is available globally or imported
      if (typeof showNotification !== "undefined") {
        showNotification("Package deleted successfully!", "success");
      }
    },
    onError: (error: Error) => {
      // Assuming showNotification is available globally or imported
      if (typeof showNotification !== "undefined") {
        showNotification(error.message || "Failed to delete package", "error");
      }
      console.error("Error deleting package:", error);
    },
  });

  return mutation;
}
