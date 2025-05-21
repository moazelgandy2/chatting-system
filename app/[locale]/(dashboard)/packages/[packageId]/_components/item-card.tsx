"use client";

import React from "react";
import { motion } from "framer-motion";
import { ContentItem, PackageItemData } from "@/types";
import ProgressCircle from "./progress-cricle";
import {
  File,
  Image,
  BookOpen,
  Film,
  Palette,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface ItemCardProps {
  item: PackageItemData;
  // onClick: () => void;
  index: number;
}

const ItemCard = ({ item, index }: ItemCardProps) => {
  const t = useTranslations("package");
  const getIcon = () => {
    switch (item.type_name) {
      case "image":
        return <Image className="w-5 h-5" />;
      case "book-open":
        return <BookOpen className="w-5 h-5" />;
      case "film":
        return <Film className="w-5 h-5" />;
      case "palette":
        return <Palette className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const progress = 0;
  const percentage = Math.round(progress * 100);
  const remaining = item.allowed_item.allowed_count;
  const isLow = remaining <= 2;

  return (
    <motion.div
      className="glass-card rounded-lg border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group"
      // onClick={onClick}
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
        {/* Background design element */}
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-xl" />
        <div className="flex justify-between items-start mb-5 relative">
          <div className="flex items-center">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary mr-3 shadow-sm">
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold">{item.item_type.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.notes}
              </p>
            </div>
          </div>
          <div>
            <div className="relative cursor-help">
              <ProgressCircle
                progress={progress}
                size={52}
                strokeWidth={5}
                className="text-primary"
              />
            </div>
          </div>
        </div>{" "}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 rounded-md bg-muted/50 relative z-10">
            <div className="text-xs text-muted-foreground">
              {t("details.used")}
            </div>
            <div className="font-medium text-base">
              {item.allowed_item.allowed_count}
            </div>
          </div>
          <div className="p-2 rounded-md bg-muted/50 relative z-10">
            <div className="text-xs text-muted-foreground">
              {t("details.remaining")}
            </div>
            <div className="font-medium text-base flex items-center">
              {remaining}
              {isLow && (
                <span className="ml-1.5 text-amber-500">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        </div>{" "}
        <div className="mt-5 flex justify-between items-center">
          {" "}
          <Badge
            variant={1 > 0 ? "outline" : "secondary"}
            className="text-xs"
          >
            {2} {t.rich("details.submissions", { count: 5 })}
          </Badge>
          <motion.div
            className="flex items-center text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: -5 }}
            whileHover={{ x: 0 }}
          >
            {t("details.viewDetails")}
            <ArrowRight className="ml-1 w-3 h-3" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
