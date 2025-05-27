"use client";

import React from "react";
import { motion } from "framer-motion";
import { PackageItemData } from "@/types";
import {
  File,
  Image,
  BookOpen,
  Film,
  Palette,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface ItemCardProps {
  item: PackageItemData;
  index: number;
}

const ItemCard = ({ item, index }: ItemCardProps) => {
  const t = useTranslations("package");

  const getIcon = () => {
    const typeName = item.item_type?.name?.toLowerCase();

    if (typeName?.includes("image") || typeName?.includes("design")) {
      return <Image className="w-5 h-5" />;
    } else if (typeName?.includes("book") || typeName?.includes("content")) {
      return <BookOpen className="w-5 h-5" />;
    } else if (typeName?.includes("video")) {
      return <Film className="w-5 h-5" />;
    } else if (typeName?.includes("design") || typeName?.includes("palette")) {
      return <Palette className="w-5 h-5" />;
    } else {
      return <File className="w-5 h-5" />;
    }
  };
  const remaining = item?.allowed_item?.allowed_count || 0;
  const isLow = remaining <= 2;

  return (
    <motion.div
      className="glass-card rounded-lg border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ y: -3, scale: 1.01 }}
    >
      <div className="p-5 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
        <div className="flex justify-between items-start mb-5 relative">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary mr-3 shadow-sm">
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold">
                {item.item_type?.name || "Unknown Type"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.notes || t("details.noNotes")}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="p-2 rounded-md bg-muted/50 relative z-10">
            <div className="text-xs text-muted-foreground">
              {t("details.allowedCount")}
            </div>
            <div className="font-medium text-base flex items-center">
              {item?.allowed_item?.allowed_count || "N/A"}
              {isLow && (
                <span className="ml-1.5 text-amber-500">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-between items-center">
          {" "}
          <Badge
            variant={item.status === "accepted" ? "default" : "secondary"}
            className="text-xs"
          >
            {item.status.slice(0, 1).toUpperCase() +
              item.status.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
