import { cn } from "@/utils/cn";

export const getLabelPositionClassName = (index: number) => {
  const position = index % 4;
  return cn(
    "absolute",
    position === 0 && "-top-3 -left-3", // 左上
    position === 1 && "-bottom-3 -left-3", // 左下
    position === 2 && "-top-3 -right-3", // 右上
    position === 3 && "-bottom-3 -right-3", // 右下
  );
};
