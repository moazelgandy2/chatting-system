"use client";
import { motion } from "framer-motion";
export default function ConstellationLines() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(12)].map((_, i) => {
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        return (
          <motion.div
            key={`constellation-${i}`}
            className="absolute bg-white/15"
            style={{
              height: "1px",
              width: `${30 + Math.random() * 50}px`,
              left: `${startX}%`,
              top: `${startY}%`,
              transformOrigin: "left center",
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        );
      })}
    </div>
  );
}
