"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPackages } from "@/actions/packages";
import { PackageResponse } from "@/types/packages";

export const PACKAGES_QUERY_KEY = "packages";

export function usePackages() {
  return useQuery<PackageResponse>({
    queryKey: [PACKAGES_QUERY_KEY],
    queryFn: fetchPackages,
  });
}
