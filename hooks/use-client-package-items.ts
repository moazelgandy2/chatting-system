"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientPackageItems } from "@/actions/package-items";

const CLIENT_PACKAGE_ITEMS_QUERY_KEY = "clientPackageItems";

export function useClientPackageItems(clientPackageId: string) {
  return useQuery({
    queryKey: [CLIENT_PACKAGE_ITEMS_QUERY_KEY, clientPackageId],
    queryFn: () => getClientPackageItems({ clientPackageId }),
    enabled: !!clientPackageId,
  });
}
