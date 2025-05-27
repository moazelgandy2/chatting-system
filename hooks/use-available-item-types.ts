"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useClientPackage } from "./use-client-package";
import { getItemTypes } from "@/actions/package-items";

const ITEM_TYPES_QUERY_KEY = "itemTypes";

export function useItemTypes() {
  return useQuery({
    queryKey: [ITEM_TYPES_QUERY_KEY],
    queryFn: getItemTypes,
  });
}

export function useAvailableItemTypes(clientPackageId: string) {
  const { data: clientPackage, isLoading: isLoadingPackage } =
    useClientPackage(clientPackageId);
  const { data: allItemTypes, isLoading: isLoadingTypes } = useItemTypes();

  const availableItemTypes = useMemo(() => {
    if (!clientPackage?.data?.client_limits || !allItemTypes?.data) {
      return [];
    }

    // Extract unique item types from client_limits
    const limitItemTypes = clientPackage.data.client_limits.map(
      (limit: any) => limit.item_type
    );
    const uniqueLimitTypes = [...new Set(limitItemTypes)];

    // Match with actual item types from API to get full type information
    const matchedTypes = allItemTypes.data.filter(
      (itemType: any) =>
        uniqueLimitTypes.includes(itemType.name) ||
        uniqueLimitTypes.includes(itemType.id)
    );

    return matchedTypes;
  }, [clientPackage, allItemTypes]);

  return {
    data: availableItemTypes,
    isLoading: isLoadingPackage || isLoadingTypes,
    clientLimits: clientPackage?.data?.client_limits || [],
    error: null,
  };
}
