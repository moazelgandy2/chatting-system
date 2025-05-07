"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressCircleProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const ProgressCircle = ({
  progress,
  size = 40,
  strokeWidth = 4,
  className = "",
}: ProgressCircleProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  // Determine colors based on progress
  const getPathColor = () => {
    if (progress >= 0.9) return "text-amber-500";
    if (progress >= 0.75) return "text-amber-400";
    return "";
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeOpacity="0.2"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          className={getPathColor()}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeInOut" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute">
        <motion.div
          className="text-xs font-semibold"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {Math.round(progress * 100)}%
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressCircle;
