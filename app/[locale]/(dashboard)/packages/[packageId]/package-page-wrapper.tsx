"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { mockPackage } from "@/data";
import PackageHeader from "./_components/package-header";
import ItemCard from "./_components/item-card";
import ItemDetailDrawer from "./_components/item-details";
import { ContentItem } from "@/types";
import { Info, Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleItemClick = (item: ContentItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const filteredItems = searchQuery.trim()
    ? mockPackage.items.filter(
        (item) =>
          item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockPackage.items;

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <PackageHeader packageData={mockPackage} />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <h2 className="text-xl font-semibold">Package Content Items</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  Click on any item to view submissions and manage content
                </p>
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
            placeholder="Search items..."
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
          <p className="text-lg font-medium">No matching items found</p>
          <p className="text-sm mt-1">Try a different search term</p>
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
