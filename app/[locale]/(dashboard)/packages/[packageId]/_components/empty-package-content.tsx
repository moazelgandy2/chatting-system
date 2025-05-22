"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Box, Package, Plus, Grid3X3 } from "lucide-react";
import { useTranslations } from "next-intl";

export const EmptyPackageContent = () => {
  const t = useTranslations();

  return (
    <motion.div
      className="w-full py-10 flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative flex flex-col items-center max-w-md text-center">
        <div className="absolute -z-10 -inset-4 opacity-40 blur-3xl rounded-full bg-gradient-to-r from-primary/20 via-primary/10 to-secondary/20" />

        <motion.div
          className="relative mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-muted/50 rounded-xl blur-sm transform rotate-6 scale-105" />
          <div className="relative h-32 w-32 bg-muted rounded-xl border border-border flex items-center justify-center">
            <Box className="h-12 w-12 text-muted-foreground/60" />
            <motion.div
              className="absolute -top-2 -right-2 h-8 w-8 bg-card rounded-lg border border-border flex items-center justify-center shadow-sm"
              initial={{ rotate: -10 }}
              animate={{ rotate: [0, 5, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
            >
              <Package className="h-5 w-5 text-primary" />
            </motion.div>
          </div>
        </motion.div>
        <motion.h3
          className="text-xl font-semibold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {t("package.empty.title")}
        </motion.h3>

        <motion.p
          className="text-muted-foreground text-sm mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {t("package.empty.description")}
        </motion.p>
      </div>
    </motion.div>
  );
};
