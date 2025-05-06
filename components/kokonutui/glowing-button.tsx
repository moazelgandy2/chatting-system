"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useCallback, forwardRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

// Define proper button props by extending HTML button attributes and including variant props
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

interface GlowingButtonProps extends ButtonProps {
  glowColor?: string;
  hoverScale?: number;
  pulseEffect?: boolean;
  children?: React.ReactNode;
}

const GlowingButton = forwardRef<HTMLButtonElement, GlowingButtonProps>(
  (
    {
      className,
      children,
      glowColor = "rgba(124, 58, 237, 0.5)",
      hoverScale = 1.03,
      pulseEffect = true,
      ...props
    },
    ref
  ) => {
    const [isHovering, setIsHovering] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const [glowPosition, setGlowPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setGlowPosition({ x, y });
    }, []);

    return (
      <div
        ref={buttonRef}
        className={cn("relative group", className)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Glow effect */}
        <div
          className={cn(
            "absolute -inset-0.5 rounded-lg opacity-0 transition-all duration-300",
            isHovering ? "opacity-100" : "opacity-0",
            pulseEffect && isHovering && "animate-pulse"
          )}
          style={{
            background: isHovering
              ? `radial-gradient(circle at ${glowPosition.x}px ${glowPosition.y}px, ${glowColor}, transparent 70%)`
              : "none",
            filter: "blur(8px)",
          }}
        />

        {/* Button with scale effect */}
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: isHovering ? `scale(${hoverScale})` : "scale(1)",
          }}
        >
          <Button
            ref={ref}
            className={cn("relative z-10")}
            {...props}
          >
            {children}
          </Button>
        </div>
      </div>
    );
  }
);

GlowingButton.displayName = "GlowingButton";

export { GlowingButton };
