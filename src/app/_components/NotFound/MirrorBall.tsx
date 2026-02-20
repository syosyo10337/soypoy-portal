"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";
import { mirrorballImage } from "./assets";

interface MirrorBallProps {
  className?: string;
}

export function MirrorBall({ className }: MirrorBallProps) {
  const shouldReduceMotion = useHydrationSafeReducedMotion();

  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? {}
          : {
              y: [0, -18, 0],
              rotate: [0, 8, 0, -8, 0],
            }
      }
      transition={
        shouldReduceMotion
          ? undefined
          : {
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "easeInOut",
            }
      }
      className={className}
      aria-hidden="true"
    >
      <Image src={mirrorballImage} alt="" className="w-full h-auto" priority />
    </motion.div>
  );
}
