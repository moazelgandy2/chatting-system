"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientPackage } from "@/actions/package-items";

const CLIENT_PACKAGE_QUERY_KEY = "clientPackage";

export function useClientPackage(clientPackageId: string) {
  return useQuery({
    queryKey: [CLIENT_PACKAGE_QUERY_KEY, clientPackageId],
    queryFn: () => getClientPackage({ clientPackageId }),
    enabled: !!clientPackageId,
  });
}
