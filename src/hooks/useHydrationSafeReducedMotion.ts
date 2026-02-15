import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * useReducedMotion の hydration-safe ラッパー。
 * Motion の useReducedMotion() は SSR 時に null を返すため、
 * レンダー出力（JSX props）で直接分岐するとサーバーとクライアントの
 * 初期レンダーが一致せず hydration mismatch が発生する。
 *
 * このフックは初期レンダーで常に false を返し、
 * hydration 完了後の useEffect で実際の値に同期する。
 */
export function useHydrationSafeReducedMotion(): boolean {
  const shouldReduceMotion = useReducedMotion();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(!!shouldReduceMotion);
  }, [shouldReduceMotion]);

  return reduceMotion;
}
