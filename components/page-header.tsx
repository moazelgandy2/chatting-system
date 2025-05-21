"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  icon: React.ReactNode;
}

export const PageHeader = ({ title, icon }: PageHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center gap-4 mb-4 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <motion.div
        initial={{ scale: 0.8, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {icon}
      </motion.div>
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
        {title}
      </h1>
    </motion.div>
  );
};
