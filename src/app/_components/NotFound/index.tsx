"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";
import { backToHomepageImage, fourImage } from "./assets";
import { MirrorBall } from "./MirrorBall";

function fadeIn(delay: number, shouldReduceMotion: boolean) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: shouldReduceMotion ? 0 : delay,
      duration: shouldReduceMotion ? 0 : 0.6,
      ease: "easeOut" as const,
    },
  };
}

export default function NotFound() {
  const shouldReduceMotion = useHydrationSafeReducedMotion();

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      {/* 4🪩4 + Back to homepage */}
      <motion.div
        {...fadeIn(0, shouldReduceMotion)}
        className="flex flex-col items-center select-none"
      >
        <h1 className="flex items-center" aria-label="404">
          <Image
            src={fourImage}
            alt=""
            className="h-28 sm:h-40 md:h-72 w-auto"
            priority
          />
          <MirrorBall className="w-24 sm:w-32 md:w-56 mx-4 sm:mx-8 md:mx-16" />
          <Image
            src={fourImage}
            alt=""
            className="h-28 sm:h-40 md:h-72 w-auto"
            priority
          />
        </h1>

        {/* Back to homepage リンク */}
        <Link href="/" className="mt-3 hover:opacity-70 transition-opacity">
          <Image
            src={backToHomepageImage}
            alt="Back to homepage"
            className="h-8 sm:h-10 md:h-12 w-auto"
          />
        </Link>
      </motion.div>

      {/* コピー */}
      <motion.p
        {...fadeIn(0.2, shouldReduceMotion)}
        className="mt-12 text-xl md:text-3xl font-bernard-mt font-bold text-soypoy-secondary text-center"
      >
        Oops... We&rsquo;re getting this page ready. Sorry.
      </motion.p>
      <motion.p
        {...fadeIn(0.4, shouldReduceMotion)}
        className="mt-4 text-sm md:text-base font-bold text-soypoy-secondary text-center"
      >
        ただいま準備中です
      </motion.p>
    </main>
  );
}
