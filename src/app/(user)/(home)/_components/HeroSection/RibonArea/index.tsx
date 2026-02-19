"use client";

import { motion } from "motion/react";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";
import { cn } from "@/utils/cn";
import { Z_INDEX } from "../constants";
import { InnerContent } from "./InnerContent";

export default function RibonArea() {
  const shouldReduceMotion = useHydrationSafeReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: -10 }}
      transition={{
        delay: shouldReduceMotion ? 0 : 2.4,
        duration: shouldReduceMotion ? 0 : 1,
        ease: "easeOut",
      }}
      className={cn(
        "max-w-4xl",
        "xl:max-w-5xl",
        "2xl:max-w-[60vw]",
        "relative w-full mx-auto",
        `z-[${Z_INDEX.ribonArea}]`,
        "-mt-[clamp(78px,30vw,180px)]",
        "sm:-mt-[clamp(140px,20vw,180px)]",
        "lg:-mt-[clamp(160px,16vw,220px)]",
        "2xl:-mt-[clamp(180px,12vw,280px)]",
      )}
    >
      {/* biome-ignore lint/performance/noImgElement: SVGは next/image の最適化対象外 */}
      <img
        src="/images/HeroSecRibon.svg"
        alt=""
        aria-hidden="true"
        className={cn(
          "relative w-full h-auto",
          `z-[${Z_INDEX.archDecoration}]`,
        )}
      />
      <InnerContent
        className={cn(
          "relative",
          `z-[${Z_INDEX.ribonArea}]`,
          "px-14 md:px-27 lg:px-19",
          "-mt-8",
          "sm:-mt-16",
          "lg:-mt-20",
        )}
      />
    </motion.div>
  );
}
