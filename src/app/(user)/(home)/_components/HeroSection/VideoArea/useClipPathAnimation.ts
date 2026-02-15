import {
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect } from "react";
import {
  ANIMATION_CONFIG,
  DESKTOP_PATH_COEFFS,
  MOBILE_PATH_COEFFS,
} from "./constants";

interface ClipPathConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
  delay?: number;
}

interface ClipPathAnimationReturn {
  mobilePath: MotionValue<string>;
  desktopPath: MotionValue<string>;
  progress: MotionValue<number>;
}

export function useClipPathAnimation(
  { stiffness, damping, mass, delay }: ClipPathConfig = {
    ...ANIMATION_CONFIG.DEFAULT_SPRING,
    delay: ANIMATION_CONFIG.DEFAULT_DELAY,
  },
): ClipPathAnimationReturn {
  const shouldReduceMotion = useReducedMotion();

  const clipProgress = useMotionValue(shouldReduceMotion ? 1 : 0);
  const springClipProgress = useSpring(clipProgress, {
    stiffness,
    damping,
    mass,
  });

  const animationProgress = useTransform(
    springClipProgress,
    ANIMATION_CONFIG.ANIMATION_CURVE.input,
    ANIMATION_CONFIG.ANIMATION_CURVE.output,
  );

  // Mobile path coordinates
  const mobileCoords = {
    startY: useTransform(
      animationProgress,
      (p) => MOBILE_PATH_COEFFS.startY * p,
    ),
    controlY1: useTransform(
      animationProgress,
      (p) => MOBILE_PATH_COEFFS.controlY1 * p,
    ),
    controlY2: useTransform(
      animationProgress,
      (p) => MOBILE_PATH_COEFFS.controlY2 * p,
    ),
    endY: useTransform(animationProgress, (p) => MOBILE_PATH_COEFFS.endY * p),
  };

  // Desktop path coordinates
  const desktopCoords = {
    startY: useTransform(
      animationProgress,
      (p) => DESKTOP_PATH_COEFFS.startY * p,
    ),
    controlY1: useTransform(
      animationProgress,
      (p) => DESKTOP_PATH_COEFFS.controlY1 * p,
    ),
    controlY2: useTransform(
      animationProgress,
      (p) => DESKTOP_PATH_COEFFS.controlY2 * p,
    ),
    endY: useTransform(animationProgress, (p) => DESKTOP_PATH_COEFFS.endY * p),
  };

  // Generate SVG paths
  const mobilePath = useMotionTemplate`
    M 0,0
    L 1,0
    L 1,${mobileCoords.startY}
    C 1,${mobileCoords.controlY1} 0.7,${mobileCoords.controlY2} 0.5,${mobileCoords.endY}
    C 0.3,${mobileCoords.endY} 0,${mobileCoords.controlY1} 0,${mobileCoords.startY}
    Z
  `;
  const desktopPath = useMotionTemplate`
    M 0,0
    L 1,0
    L 1,${desktopCoords.startY}
    C 1,${desktopCoords.controlY1} 0.777,${desktopCoords.controlY2} 0.5,${desktopCoords.endY}
    C 0.223,${desktopCoords.endY} 0,${desktopCoords.controlY1} 0,${desktopCoords.startY}
    Z
  `;

  // Trigger animation on mount (skip if reduced motion — already at final state)
  useEffect(() => {
    if (shouldReduceMotion) return;

    const timeout = setTimeout(() => {
      clipProgress.set(1);
    }, delay);

    return () => clearTimeout(timeout);
  }, [clipProgress, delay, shouldReduceMotion]);

  return {
    mobilePath,
    desktopPath,
    progress: animationProgress,
  };
}
