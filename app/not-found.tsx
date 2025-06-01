"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeftIcon, HomeIcon, RefreshCcwIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AnimatedGrid from "@/components/kokonutui/animated-grid";
import { GlowingButton } from "@/components/kokonutui/glowing-button";
import { useEffect, useState } from "react";

// Split text into individual characters for animation
const SplitText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          animate={{
            y: [0, -10, 0],
            color: [
              "hsl(var(--primary))",
              "hsl(var(--primary-foreground))",
              "hsl(var(--primary))",
            ],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: index * 0.1,
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

// Animated letter for the 404 display
const AnimatedLetter = ({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
      animate={{
        opacity: 1,
        rotateY: 0,
        scale: 1, // Changed from [0.8, 1.2, 1] to a single target value for spring animation
      }}
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 8,
      }}
    >
      {children}
    </motion.span>
  );
};

export default function NotFound() {
  // Animation for blinking cursor effect
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dark relative w-full h-screen flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* 3D Animated Grid Background */}
      <div className="absolute inset-0">
        <AnimatedGrid
          gridSize={5}
          pointCount={100}
          pointSize={3}
          color="var(--primary)"
          interactive={true}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="flex flex-col items-center justify-center p-6 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated 404 Text with individual letter animations */}
        <motion.div
          className="relative mb-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
        >
          <div className="flex">
            <AnimatedLetter delay={0.3}>
              <motion.span
                className="text-[8rem] md:text-[12rem] font-bold text-primary select-none"
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 10px rgba(124, 58, 237, 0.3)",
                    "0 0 30px rgba(124, 58, 237, 0.5)",
                    "0 0 10px rgba(124, 58, 237, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                4
              </motion.span>
            </AnimatedLetter>

            <AnimatedLetter delay={0.5}>
              <motion.span
                className="text-[8rem] md:text-[12rem] font-bold text-primary select-none"
                animate={{
                  rotate: [0, 5, 0, -5, 0],
                  textShadow: [
                    "0 0 10px rgba(124, 58, 237, 0.3)",
                    "0 0 30px rgba(124, 58, 237, 0.5)",
                    "0 0 10px rgba(124, 58, 237, 0.3)",
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                0
              </motion.span>
            </AnimatedLetter>

            <AnimatedLetter delay={0.7}>
              <motion.span
                className="text-[8rem] md:text-[12rem] font-bold text-primary select-none"
                animate={{
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 10px rgba(124, 58, 237, 0.3)",
                    "0 0 30px rgba(124, 58, 237, 0.5)",
                    "0 0 10px rgba(124, 58, 237, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                4
              </motion.span>
            </AnimatedLetter>
          </div>
        </motion.div>

        {/* Animated text below 404 */}
        <motion.div
          className="relative mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex items-center justify-center text-xl md:text-2xl text-muted-foreground font-mono">
            <SplitText text="Page_Not_Found" />
            <motion.span
              className="inline-block w-2 h-6 bg-primary ml-1"
              animate={{
                opacity: showCursor ? 1 : 0,
                height: ["24px", "30px", "24px"],
              }}
              transition={{
                opacity: { duration: 0.2 },
                height: { duration: 2, repeat: Infinity },
              }}
            />
          </div>
        </motion.div>

        {/* Card with glass effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Card className="max-w-md w-full border-muted bg-card/40 backdrop-blur-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Page Not Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist or has been
                moved. Please check the URL or navigate back to home.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlowingButton
                asChild
                className="w-full sm:w-auto"
                glowColor="rgba(124, 58, 237, 0.5)"
                hoverScale={1.05}
              >
                <Link href="/">
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Return Home
                </Link>
              </GlowingButton>

              <GlowingButton
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto"
                glowColor="rgba(255, 255, 255, 0.3)"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Go Back
              </GlowingButton>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Animated refresh hint */}
        <motion.div
          className="mt-8 flex items-center gap-2 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCcwIcon className="h-4 w-4" />
          </motion.div>
          <span>Try refreshing the page if you think this is an error</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
