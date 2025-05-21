"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPackage } from "@/actions/packages";
import { SinglePackageResponse } from "@/types/packages";
import { PACKAGES_QUERY_KEY } from "@/hooks/use-packages";

export function usePackage(packageId: string | number) {
  return useQuery<SinglePackageResponse>({
    queryKey: [PACKAGES_QUERY_KEY, packageId],
    queryFn: () => fetchPackage(packageId.toString()),
    enabled: !!packageId,
  });
}

export function usePackageRevalidate(packageId: number) {
  const queryClient = useQueryClient();
  const revalidate = () => {
    queryClient.invalidateQueries({
      queryKey: [PACKAGES_QUERY_KEY, packageId],
    });
  };

  return revalidate;
}
