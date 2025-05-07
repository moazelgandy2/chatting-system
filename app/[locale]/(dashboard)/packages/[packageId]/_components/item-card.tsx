"use client";

import React from "react";
import { motion } from "framer-motion";
import { ContentItem } from "@/types";
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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

interface ItemCardProps {
  item: ContentItem;
  onClick: () => void;
  index: number;
}

const ItemCard = ({ item, onClick, index }: ItemCardProps) => {
  const getIcon = () => {
    switch (item.icon) {
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

  const progress = item.totalAllowed > 0 ? item.used / item.totalAllowed : 0;
  const percentage = Math.round(progress * 100);
  const remaining = item.totalAllowed - item.used;
  const isLow = remaining <= 2;

  return (
    <motion.div
      className="glass-card rounded-lg border border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group"
      onClick={onClick}
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
              <h3 className="font-semibold">{item.type}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.description}
              </p>
            </div>
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="relative cursor-help">
                <ProgressCircle
                  progress={progress}
                  size={52}
                  strokeWidth={5}
                  className="text-primary"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Usage Statistics</h4>
                <p className="text-xs text-muted-foreground">
                  You've used {item.used} out of {item.totalAllowed} available{" "}
                  {item.type.toLowerCase()}.
                </p>
                <div className="flex justify-between text-xs">
                  <span>Progress: {percentage}%</span>
                  <span>Remaining: {remaining}</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 rounded-md bg-muted/50">
            <div className="text-xs text-muted-foreground">Used</div>
            <div className="font-medium text-base">{item.used}</div>
          </div>
          <div className="p-2 rounded-md bg-muted/50 relative">
            <div className="text-xs text-muted-foreground">Remaining</div>
            <div className="font-medium text-base flex items-center">
              {remaining}
              {isLow && (
                <span className="ml-1.5 text-amber-500">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-between items-center">
          <Badge
            variant={item.submissions.length > 0 ? "outline" : "secondary"}
            className="text-xs"
          >
            {item.submissions.length} submission
            {item.submissions.length !== 1 && "s"}
          </Badge>
          <motion.div
            className="flex items-center text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: -5 }}
            whileHover={{ x: 0 }}
          >
            View Details
            <ArrowRight className="ml-1 w-3 h-3" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
