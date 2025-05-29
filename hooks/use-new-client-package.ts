"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getDetailedClientPackage } from "@/actions/assign-package";
import { getItemTypes } from "@/actions/package-items";
import { EnhancedPackageItem } from "@/types/new-client-package";
import { ItemType } from "@/types/item-types";

const CLIENT_PACKAGE_QUERY_KEY = "clientPackage";
const ITEM_TYPES_QUERY_KEY = "itemTypes";

/**
 * Hook to fetch client package data using the existing working API endpoint
 */
export function useNewClientPackage(packageId: string) {
  return useQuery({
    queryKey: [CLIENT_PACKAGE_QUERY_KEY, packageId],
    queryFn: () => getDetailedClientPackage(parseInt(packageId)),
    enabled: !!packageId,
  });
}

/**
 * Hook to fetch item types using the existing working API endpoint
 */
export function useNewItemTypes() {
  return useQuery({
    queryKey: [ITEM_TYPES_QUERY_KEY],
    queryFn: getItemTypes,
  });
}

/**
 * Hook that combines client package data with item types to provide enhanced package items
 * with item type names mapped from type_id
 */
export function useEnhancedClientPackage(packageId: string) {
  const {
    data: clientPackageData,
    isLoading: isLoadingPackage,
    error: packageError,
  } = useNewClientPackage(packageId);
  const {
    data: itemTypesData,
    isLoading: isLoadingTypes,
    error: typesError,
  } = useNewItemTypes();

  const enhancedData = useMemo(() => {
    console.log("useEnhancedClientPackage - Processing data:", {
      packageId,
      clientPackageData,
      itemTypesData,
      packageError,
      typesError,
      isLoadingPackage,
      isLoadingTypes,
    });

    // Return null if still loading
    if (isLoadingPackage || isLoadingTypes) {
      console.log("Still loading data, returning null");
      return null;
    }

    // If there are errors, return null (component will handle error display)
    if (packageError || typesError) {
      console.error("Error in data fetching:", { packageError, typesError });
      return null;
    }

    // Defensive checks for data structure
    if (!clientPackageData?.data || !itemTypesData?.data) {
      console.log("Missing data:", {
        hasClientPackageData: !!clientPackageData?.data,
        hasItemTypesData: !!itemTypesData?.data,
      });
      return null;
    }

    // Check if package has package_items in the package object
    if (
      !clientPackageData.data.package?.package_items ||
      !Array.isArray(clientPackageData.data.package.package_items)
    ) {
      console.log(
        "Missing or invalid package items:",
        clientPackageData.data.package?.package_items
      );
      return null;
    }

    // Create item types map for quick lookup
    const itemTypesMap = new Map<number, string>();
    itemTypesData.data.forEach((itemType: ItemType) => {
      itemTypesMap.set(itemType.id, itemType.name);
    });

    console.log("Item types map:", Object.fromEntries(itemTypesMap));

    // Enhance package items with item type names
    const enhancedPackageItems: EnhancedPackageItem[] =
      clientPackageData.data.package.package_items.map((item: any) => ({
        ...item,
        item_type_name:
          itemTypesMap.get(item.type_id) || `Unknown Type (${item.type_id})`,
      }));

    console.log("Enhanced package items:", enhancedPackageItems);

    // Return enhanced data structure that the component expects
    return {
      ...clientPackageData.data,
      package_items: enhancedPackageItems, // This is what the component expects
      original_package: clientPackageData.data.package, // Keep original package data for reference
    };
  }, [
    clientPackageData,
    itemTypesData,
    packageError,
    typesError,
    isLoadingPackage,
    isLoadingTypes,
  ]);
  return {
    data: enhancedData,
    isLoading: isLoadingPackage || isLoadingTypes,
    error: packageError || typesError,
    itemTypes: itemTypesData?.data || [],
  };
}
