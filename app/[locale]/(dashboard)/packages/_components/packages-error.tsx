"use client";

import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function PackagesError() {
  const t = useTranslations("dashboard");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 flex flex-col items-center justify-center h-[76vh]"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <AlertCircle className="w-16 h-16 text-red-500" />
      </motion.div>
      <h2 className="mt-4 text-xl font-semibold text-red-600">
        {t("error.title")}
      </h2>
      <p className="mt-2 text-muted-foreground">{t("error.description")}</p>
    </motion.div>
  );
}
