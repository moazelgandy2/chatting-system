"use client";
import { motion } from "framer-motion";
const centerVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};
const ringVariants = {
  initial: { opacity: 0, scale: 0.7 },
  animate: {
    opacity: 0.5,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};
export default function OrbitalSystem() {
  return (
    <div className="relative w-44 h-44 mb-4">
      <motion.div
        className="absolute inset-0"
        variants={ringVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="absolute inset-0 border border-white/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 120,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-[10%] border border-white/15 rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 90,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-[20%] border border-white/10 rounded-full"
          animate={{ rotate: 180, scale: [1, 1.05, 1] }}
          transition={{
            rotate: {
              duration: 60,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            scale: {
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        />
        <motion.div
          className="absolute inset-[30%] border border-white/10 rounded-full"
          animate={{ rotate: -180 }}
          transition={{
            duration: 45,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute inset-[40%] border border-white/5 rounded-full"
          animate={{ rotate: 90, scale: [1, 1.1, 1] }}
          transition={{
            rotate: {
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
            scale: {
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        />
      </motion.div>
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 40,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute top-0 left-[calc(50%-4px)] w-2 h-2 rounded-full bg-[#5D9DFF]/70 backdrop-blur-sm"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotate: -360 }}
        transition={{
          duration: 60,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#FF5D9D]/70 backdrop-blur-sm"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </motion.div>
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotate: 180 }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
          repeatType: "reverse",
        }}
      >
        <motion.div
          className="absolute top-[calc(50%-4px)] right-0 w-2 h-2 rounded-full bg-[#5DFF9D]/70 backdrop-blur-sm"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 0.5,
          }}
        />
      </motion.div>
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotate: -240 }}
        transition={{
          duration: 50,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute top-[20%] left-[10%] w-1.5 h-1.5 rounded-full bg-[#FFD700]/70 backdrop-blur-sm"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{
            scale: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
            opacity: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
        />
      </motion.div>
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotate: 120 }}
        transition={{
          duration: 35,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute bottom-[30%] left-[15%] w-2 h-2 rounded-full bg-[#00FFFF]/70 backdrop-blur-sm"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{
            scale: {
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
            opacity: {
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
        />
      </motion.div>
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotate: -90 }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute top-[40%] right-[20%] w-1 h-1 rounded-full bg-[#FF00FF]/70 backdrop-blur-sm"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{
            scale: {
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
            opacity: {
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
        />
      </motion.div>
      <motion.div
        className="absolute top-[15%] left-[25%] w-6 h-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-1-${i}`}
            className="absolute w-0.5 h-0.5 rounded-full bg-white/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 10, 0],
              y: [0, (Math.random() - 0.5) * 10, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute bottom-[20%] right-[30%] w-8 h-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-2-${i}`}
            className="absolute w-0.5 h-0.5 rounded-full bg-white/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 15, 0],
              y: [0, (Math.random() - 0.5) * 15, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
        variants={centerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md border border-white/20" />
        <div className="absolute -inset-2 rounded-full bg-[#4A5AAA]/20 blur-md" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36077 14.891 4 16.1272V21L8.87279 20C9.94066 20.6392 10.9344 21 12 21Z"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
