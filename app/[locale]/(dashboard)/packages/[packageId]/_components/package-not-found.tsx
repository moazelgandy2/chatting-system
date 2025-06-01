"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Package, Home, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const PackageNotFound = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <motion.div
        className="relative w-full bg-card/50 backdrop-blur-sm rounded-2xl p-10 flex flex-col items-center justify-center border border-border/50 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-xl" />

        <motion.div
          className="rounded-full bg-muted/80 p-5 mb-5"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Package className="h-12 w-12 text-primary" />
        </motion.div>
        <motion.h3
          className="text-2xl font-bold mb-3 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {t("package.notFound.title")}
        </motion.h3>

        <motion.p
          className="text-muted-foreground text-center max-w-md mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {t("package.notFound.description")}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("package.notFound.back")}</span>
          </Button>

          <Button asChild>
            <Link
              href="/packages"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              <span>{t("package.notFound.allPackages")}</span>
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="mt-8 flex items-center gap-2 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="h-3 w-3" />
          </motion.div>
          <span>{t("package.notFound.refresh")}</span>
        </motion.div>
      </motion.div>
    </div>
  );
};
