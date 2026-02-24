import { useEffect, useState } from "react";

/**
 * メディアクエリの一致状態を返すフック。
 * SSR / hydration 前は null を返し、クライアント判定後に boolean へ確定する。
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    setMatches(window.matchMedia(query).matches);
  }, [query]);

  return matches;
}
