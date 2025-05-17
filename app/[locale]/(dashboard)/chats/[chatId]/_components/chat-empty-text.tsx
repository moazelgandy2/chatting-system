"use client";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
export default function ChatEmptyText() {
  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.4 },
    },
  };
  return (
    <motion.div
      className="text-center"
      variants={textVariants}
      initial="initial"
      animate="animate"
    >
      <Badge
        variant={"outline"}
        className="text-white/80 text-sm mt-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
      >
        {`You don't have any messages yet.`}
      </Badge>
    </motion.div>
  );
}
