"use client";

import { useQuery } from "@tanstack/react-query";
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
