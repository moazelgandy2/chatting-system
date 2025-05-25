"use client";

import HandWrittenTitle from "@/components/hand-written";
import { BackgroundLines } from "@/components/ui/back-ground-lines";
import { motion } from "motion/react";

const FloatingDot = ({ delay = 0, x = "0%", y = "0%" }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
      style={{ left: x, top: y }}
      animate={{
        y: [-5, -15, -5],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
};

const PulsingRing = ({ delay = 0, size = "w-32 h-32" }) => {
  return (
    <motion.div
      className={`absolute ${size} border border-blue-200/20 dark:border-blue-400/20 rounded-full`}
      style={{
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 80 + 10}%`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
};

const TwinkleStars = () => {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

const FloatingLines = () => {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-blue-300/20 to-transparent"
          style={{
            width: `${100 + Math.random() * 200}px`,
            left: `${Math.random() * 80}%`,
            top: `${20 + i * 20}%`,
          }}
          animate={{
            x: [-50, 50, -50],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
};

export const HomePageWrapper = () => {
  return (
    <div className="w-full relative h-[85dvh] overflow-hidden">
      {" "}
      {/* Background Details */}
      <div className="absolute inset-0">
        {/* Twinkling Stars */}
        <TwinkleStars />
        {/* Floating Lines */}
        <FloatingLines />
        {/* Floating Dots */}
        {Array.from({ length: 12 }).map((_, i) => (
          <FloatingDot
            key={i}
            delay={i * 0.3}
            x={`${20 + (i % 4) * 20}%`}
            y={`${10 + Math.floor(i / 4) * 30}%`}
          />
        ))}
        {/* Pulsing Rings */}
        <PulsingRing
          delay={0}
          size="w-24 h-24"
        />
        <PulsingRing
          delay={1.5}
          size="w-40 h-40"
        />
        <PulsingRing
          delay={3}
          size="w-16 h-16"
        />{" "}
        {/* Subtle Gradient Orbs */}
        <motion.div
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-100/10 to-purple-100/10 dark:from-blue-400/5 dark:to-purple-400/5 rounded-full blur-3xl"
          style={{ left: "10%", top: "20%" }}
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-48 h-48 bg-gradient-to-r from-purple-100/10 to-pink-100/10 dark:from-purple-400/5 dark:to-pink-400/5 rounded-full blur-3xl"
          style={{ right: "15%", bottom: "25%" }}
          animate={{
            scale: [1, 1.2, 1],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        {/* Corner Decorative Elements */}
        <motion.div
          className="absolute top-8 left-8 w-4 h-4 border-l-2 border-t-2 border-blue-300/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-8 right-8 w-4 h-4 border-r-2 border-t-2 border-purple-300/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute bottom-8 left-8 w-4 h-4 border-l-2 border-b-2 border-blue-300/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute bottom-8 right-8 w-4 h-4 border-r-2 border-b-2 border-purple-300/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 3 }}
        />
      </div>
      <BackgroundLines className="flex min-h-[100vh] bg-transparent items-center justify-center w-full flex-col relative">
        {" "}
        <motion.div
          className="text-center max-w-4xl mx-auto px-6 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {" "}
          {/* Decorative Elements around Title */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <motion.div
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="w-1 h-1 bg-purple-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
          </div>
          {/* Side floating elements */}
          <motion.div
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4"
            animate={{
              x: [-16, -8, -16],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="w-2 h-8 bg-gradient-to-b from-blue-400/20 to-transparent rounded-full" />
          </motion.div>
          <motion.div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4"
            animate={{
              x: [16, 8, 16],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          >
            <div className="w-2 h-8 bg-gradient-to-b from-purple-400/20 to-transparent rounded-full" />
          </motion.div>
          <HandWrittenTitle />{" "}
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Small sparkles around text */}
            <motion.span
              className="absolute -left-8 top-2 text-xs"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <motion.span
              className="absolute -right-8 bottom-2 text-xs"
              animate={{
                rotate: [360, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              ⭐
            </motion.span>
            <motion.span
              className="absolute -left-6 bottom-0 text-xs opacity-50"
              animate={{
                y: [0, -5, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
              💫
            </motion.span>
            <motion.span
              className="absolute -right-6 top-0 text-xs opacity-50"
              animate={{
                y: [0, -5, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
            >
              🌟
            </motion.span>
            The perfect platform for you to connect with Marktopia team,
            collaborate, and grow together.
          </motion.p>{" "}
          {/* Bottom decorative dots */}
          <motion.div
            className="flex justify-center items-center gap-2 mt-12 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            {/* Main dots */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}

            {/* Side mini dots */}
            <motion.div
              className="absolute -left-6 w-1 h-1 bg-blue-300/60 rounded-full"
              animate={{
                scale: [0.5, 1.2, 0.5],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute -right-6 w-1 h-1 bg-purple-300/60 rounded-full"
              animate={{
                scale: [0.5, 1.2, 0.5],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
          </motion.div>
        </motion.div>
      </BackgroundLines>
    </div>
  );
};
