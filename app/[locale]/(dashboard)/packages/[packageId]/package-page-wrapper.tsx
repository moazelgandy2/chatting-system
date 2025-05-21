"use client";

import { usePackage } from "@/hooks/use-package";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ItemCard from "./_components/item-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Search } from "lucide-react";
import { useTranslations } from "next-intl";

export const PackagePageWrapper = ({ packageId }: { packageId: number }) => {
  const { data, isLoading, isError } = usePackage(packageId);
  const { session } = useAuth();
  const currentUserId = session?.user?.id;
  const router = useRouter();
  const t = useTranslations();
  if (isError) {
    return <div>Error loading package</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Package not found</div>;
  }

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <h2 className="text-xl font-semibold">{data.data.name}</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{t("package.details.clickTooltip")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </div>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        {data.data.description}
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {t("package.details.packageContent")}
      </h2>
      {data.data.package_items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.package_items.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              // onClick={() => handleItemClick(item)}
              index={index}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">
          No items in this package.
        </p>
      )}
    </div>
  );
};

/*
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ContentItem } from "@/types";
import { Info, Loader2, Package as PackageIcon, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePackage } from "@/hooks/use-package";
import PackageHeader from "./_components/package-header";
import ItemCard from "./_components/item-card";
import ItemDetailDrawer from "./_components/item-details";
import { PackageSkeleton } from "./_components/package-skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function PackagePageWrapper({ packageId }: { packageId: string }) {
  const t = useTranslations("package");
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: packageResponse,
    isLoading,
    isError,
    error,
  } = usePackage(packageId);
  const packageData = packageResponse?.data;

  const handleItemClick = (item: ContentItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Mock items for now - in a real app, these would come from the API
  const mockItems = packageData
    ? [
        {
          id: "1",
          type: "Image",
          icon: "image",
          totalAllowed: 10,
          used: 3,
          description: "High-quality images for your marketing",
          submissions: [],
        },
        {
          id: "2",
          type: "Video",
          icon: "video",
          totalAllowed: 5,
          used: 1,
          description: "Promotional videos for social media",
          submissions: [],
        },
      ]
    : [];

  const filteredItems = searchQuery.trim()
    ? mockItems.filter(
        (item) =>
          item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockItems;

  if (isLoading) {
    return <PackageSkeleton />;
  }

  if (isError || !packageData) {
    return (
      <div className="container mx-auto px-4 max-w-6xl flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-red-500/20 p-3">
            <PackageIcon className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold">Failed to load package</h3>
          <p className="text-muted-foreground">
            {error?.message ||
              "This package could not be found or you don't have permission to view it."}
          </p>
        </div>
      </div>
    );
  }

  // Convert API package data to the format expected by PackageHeader
  const packageForHeader = {
    id: packageData.id.toString(),
    name: packageData.name,
    description: packageData.description,
    status: "active" as const, // Mock status for now
    startDate: packageData.created_at || new Date().toISOString(),
    endDate: new Date(
      new Date().setMonth(new Date().getMonth() + 3)
    ).toISOString(), // Mock end date 3 months from now
    clientName: "Sample Client", // Mock client name
    items: mockItems,
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <PackageHeader packageData={packageForHeader} />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <h2 className="text-xl font-semibold">
            {t("details.packageContent")}
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{t("details.clickTooltip")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("details.searchItems")}
            className="pl-9 pr-4 py-2 text-sm rounded-md bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full max-w-[220px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>
      </div>

      {filteredItems.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredItems.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => handleItemClick(item)}
              index={index}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-muted-foreground"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
            <Search
              size={24}
              className="opacity-50"
            />
          </div>
          <p className="text-lg font-medium">{t("details.noMatchingItems")}</p>
          <p className="text-sm mt-1">{t("details.tryDifferent")}</p>
        </motion.div>
      )}

      <ItemDetailDrawer
        item={selectedItem}
        isOpen={drawerOpen}
        onClose={closeDrawer}
      />
    </div>
  );
}
*/
