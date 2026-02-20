import { cn } from "@/utils/cn";

export const getLabelPositionClassName = (
  index: number,
  { skipTopLeft = false }: { skipTopLeft?: boolean } = {},
) => {
  const positions = skipTopLeft
    ? ([1, 2, 3] as const) // 左上を除外
    : ([0, 1, 2, 3] as const); // 全4隅
  const position = positions[index % positions.length];
  return cn(
    "absolute",
    position === 0 && "-top-3 -left-3", // 左上
    position === 1 && "-bottom-3 -left-3", // 左下
    position === 2 && "-top-3 -right-3", // 右上
    position === 3 && "-bottom-3 -right-3", // 右下
  );
};
