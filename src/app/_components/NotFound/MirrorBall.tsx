"use client";

import Image from "next/image";
import { useHydrationSafeReducedMotion } from "@/hooks/useHydrationSafeReducedMotion";
import { mirrorballImage } from "./assets";

interface MirrorBallProps {
  className?: string;
}

const GLINTS: Array<{
  id: number;
  top: string;
  size: number;
  delay: number;
  duration: number;
  direction: "ltr" | "rtl";
}> = [
  { id: 1, top: "14%", size: 14, delay: -0.5, duration: 4.5, direction: "ltr" },
  { id: 2, top: "26%", size: 9, delay: -3.2, duration: 3.8, direction: "ltr" },
  { id: 3, top: "38%", size: 16, delay: -1.8, duration: 5.0, direction: "ltr" },
  { id: 4, top: "50%", size: 11, delay: -4.1, duration: 4.2, direction: "ltr" },
  { id: 5, top: "62%", size: 13, delay: -0.9, duration: 4.8, direction: "ltr" },
  { id: 6, top: "20%", size: 7, delay: -2.4, duration: 3.5, direction: "rtl" },
  { id: 7, top: "44%", size: 10, delay: -3.8, duration: 4.4, direction: "ltr" },
  { id: 8, top: "32%", size: 8, delay: -1.2, duration: 4.0, direction: "rtl" },
  { id: 9, top: "56%", size: 12, delay: -2.8, duration: 4.6, direction: "ltr" },
];

export function MirrorBall({ className }: MirrorBallProps) {
  const shouldReduceMotion = useHydrationSafeReducedMotion();

  return (
    <div
      className={`relative select-none ${className ?? ""}`}
      aria-hidden="true"
    >
      <Image
        src={mirrorballImage}
        alt=""
        className="w-full h-auto"
        fetchPriority="high"
      />
      {!shouldReduceMotion && (
        <div className="mirrorball-glints">
          {GLINTS.map((glint) => (
            <div
              key={glint.id}
              className="mirrorball-glint"
              style={{
                top: glint.top,
                width: `${glint.size}px`,
                height: `${glint.size}px`,
                animationName:
                  glint.direction === "ltr"
                    ? "mirrorball-glint-ltr"
                    : "mirrorball-glint-rtl",
                animationDuration: `${glint.duration}s`,
                animationDelay: `${glint.delay}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
