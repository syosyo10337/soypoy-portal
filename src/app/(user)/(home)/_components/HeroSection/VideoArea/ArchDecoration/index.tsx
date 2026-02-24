"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { Z_INDEX } from "../../constants";
import FudaOverLay from "./FudaOverLay";
import ArchImage from "./soypoyArch.webp";
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
      <div className="relative w-full aspect-2849/861">
        {/*
         * fill + sizes でモバイルに最適な画像サイズを配信する
         * - width/height 指定だと srcSet が 1x/2x の2択 → モバイルでも常に元画像(1424px)をそのまま取得
         * - fill にすると srcSet が deviceSizes 全体(640~3840)に展開され、
         *   ブラウザが sizes を元に必要最小限のサイズを選択（例: 412px端末 → w=1200程度に縮小配信）
         */}
        <Image
          src={ArchImage}
          alt="Arch Decoration"
          fill
          sizes="(max-width: 1424px) 100vw, 1424px"
          className="object-contain"
          fetchPriority="high"
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
