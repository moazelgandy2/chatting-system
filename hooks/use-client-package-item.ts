"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientPackageItem } from "@/actions/client-package-item";
import { ClientPackageItem } from "@/types/packages";

const CLIENT_PACKAGE_ITEM_QUERY_KEY = "clientPackageItem";

export function useClientPackageItem(
  packageId?: number,
  packageItemId?: number
) {
  return useQuery<{ status: boolean; data: ClientPackageItem }>({
    queryKey: [CLIENT_PACKAGE_ITEM_QUERY_KEY, packageId, packageItemId],
    queryFn: () => getClientPackageItem(packageId!, packageItemId!),
    enabled: !!packageId && !!packageItemId,
  });
}
