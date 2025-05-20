"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Role {
  id: string;
  svg: React.ReactNode;
  name: string;
}

const roles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    svg: (
      <Image
        src="/avatars/admin.webp"
        alt="Admin Avatar"
        width={250}
        height={250}
        className="w-full h-full object-cover object-center"
      />
    ),
  },
  {
    id: "team",
    name: "Team",
    svg: (
      <Image
        src="/avatars/team.webp"
        alt="Team Avatar"
        width={250}
        height={250}
        className="w-full h-full object-cover object-center"
      />
    ),
  },
  {
    id: "client",
    name: "Client",
    svg: (
      <Image
        src="/avatars/client.webp"
        alt="Client Avatar"
        width={250}
        height={250}
        className="w-full h-full object-cover object-center"
      />
    ),
  },
];

const mainAvatarVariants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const pickerVariants = {
  container: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    initial: {
      y: 20,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  },
};

const selectedVariants = {
  initial: {
    opacity: 0,
    rotate: -180,
  },
  animate: {
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    rotate: 180,
    transition: {
      duration: 0.2,
    },
  },
};

export default function RolePicker({
  onRoleChange,
}: {
  onRoleChange: (role: string) => void;
}) {
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [rotationCount, setRotationCount] = useState(0);

  const handleRoleSelect = (role: Role) => {
    setRotationCount((prev) => prev + 1080);
    setSelectedRole(role);
    onRoleChange(role.id);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="w-full"
    >
      <Card className="w-full mx-auto overflow-hidden bg-gradient-to-b from-background to-muted/30">
        <CardContent className="p-0">
          <div className="px-2 pb-2">
            <motion.div
              className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 bg-background flex items-center justify-center"
              variants={mainAvatarVariants}
              layoutId="selectedAvatar"
            >
              <motion.div
                className="w-full h-full flex items-center justify-center scale-[1]"
                animate={{
                  rotate: rotationCount,
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {selectedRole.svg}
              </motion.div>
            </motion.div>

            {/* Username display */}
            <motion.div
              className="text-center mt-1"
              variants={pickerVariants.item}
            >
              <motion.h2
                className="text-lg font-bold"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {selectedRole.name}
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Select your role
              </motion.p>
            </motion.div>

            <motion.div
              className="mt-3"
              variants={pickerVariants.container}
            >
              <motion.div
                className="flex justify-center gap-1.5"
                variants={pickerVariants.container}
              >
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    className={cn(
                      "relative w-8 h-8 rounded-full overflow-hidden border",
                      "transition-all duration-300"
                    )}
                    variants={pickerVariants.item}
                    whileHover={{
                      y: -2,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{
                      y: 0,
                      transition: { duration: 0.2 },
                    }}
                    aria-label={`Select ${role.name}`}
                    aria-pressed={selectedRole.id === role.id}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      {role.svg}
                    </div>
                    {selectedRole.id === role.id && (
                      <motion.div
                        className="absolute inset-0 bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background rounded-full"
                        variants={selectedVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layoutId="selectedIndicator"
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
