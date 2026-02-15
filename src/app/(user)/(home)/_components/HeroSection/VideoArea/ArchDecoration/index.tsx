"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { Z_INDEX } from "../../constants";
import FudaOverLay from "./FudaOverLay";
import ArchImage from "./soypoyArch.png";
import { useArchAnimation } from "./useArchAnimation";

export default function ArchDecoration() {
  const { opacity, isInitialAnimationComplete, setIsInitialAnimationComplete } =
    useArchAnimation();

  return (
    <motion.div
      className={cn("fixed top-0 left-0 right-0 w-full pointer-events-none")}
      initial={{ scale: 0.1, y: "100%" }}
      animate={{
        scale: [0.1, 1],
        y: ["100%", "0%"],
      }}
      transition={{
        duration: 1.5,
        ease: "easeInOut",
      }}
      onAnimationComplete={() => setIsInitialAnimationComplete(true)}
      style={{
        opacity: isInitialAnimationComplete ? opacity : undefined,
        transformOrigin: "top center",
        zIndex: Z_INDEX.archDecoration,
      }}
    >
      {/* aspect-ratioを固定してレスポンシブ時の位置ずれを防ぐ */}
      <div className="relative w-full aspect-[1420/426]">
        <Image
          src={ArchImage}
          alt="Arch Decoration"
          width={1420}
          height={426}
          className="w-full h-auto"
        />
        {/* FudaOverLayを同じaspect-ratio内に配置 */}
        <FudaOverLay
          className={`hidden sm:block absolute inset-0 pointer-events-none ${
            isInitialAnimationComplete ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </motion.div>
  );
}
