"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
  opacity: number;
  delay: number;
}

interface AnimatedGridProps {
  className?: string;
  gridSize?: number;
  pointCount?: number;
  pointSize?: number;
  color?: string;
  interactive?: boolean;
  style?: React.CSSProperties;
}

export default function AnimatedGrid({
  className,
  gridSize = 4,
  pointCount = 80,
  pointSize = 2,
  color = "currentColor",
  interactive = true,
  style,
}: AnimatedGridProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate initial points with random positions
  useEffect(() => {
    const newPoints = Array.from({ length: pointCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: 0.1 + Math.random() * 0.3,
      delay: Math.random(),
    }));
    setPoints(newPoints);
  }, [pointCount]);

  // Handle mouse movement to create interactive effects
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      setMousePosition({ x, y });
    },
    [interactive]
  );

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={{
        perspective: "1000px",
        perspectiveOrigin: "center center",
        ...style,
      }}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          rotateX: interactive ? [0, 5, 0] : 0,
          rotateY: interactive ? [0, 5, 0] : 0,
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {/* Grid lines */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {Array.from({ length: gridSize + 1 }).map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px"
              style={{
                top: `${(i / gridSize) * 100}%`,
                background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
                opacity: 0.15,
              }}
            />
          ))}
          {Array.from({ length: gridSize + 1 }).map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px"
              style={{
                left: `${(i / gridSize) * 100}%`,
                background: `linear-gradient(0deg, transparent 0%, ${color} 50%, transparent 100%)`,
                opacity: 0.15,
              }}
            />
          ))}
        </div>

        {/* Points */}
        {points.map((point, index) => {
          const distance = interactive
            ? Math.sqrt(
                Math.pow(point.x - mousePosition.x, 2) +
                  Math.pow(point.y - mousePosition.y, 2)
              )
            : 100;

          // Points react to mouse proximity
          const dynamicOpacity = interactive
            ? point.opacity * Math.max(0, 1 - distance / 30)
            : point.opacity;

          return (
            <motion.div
              key={index}
              className="absolute rounded-full"
              style={{
                width: pointSize,
                height: pointSize,
                left: `${point.x}%`,
                top: `${point.y}%`,
                backgroundColor: color,
                opacity: dynamicOpacity,
                zIndex: 10,
              }}
              animate={{
                opacity: [dynamicOpacity, dynamicOpacity * 2, dynamicOpacity],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: point.delay * 3,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
