import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils/cn";

const DEFAULT_TEXT = "PICK UP EVENT!";
const DEFAULT_REPEAT_COUNT = 17; // 4k解像度でも途切れないよう

export const MarqueeDirection = {
  normal: "normal",
  reverse: "reverse",
} as const;
type MarqueeDirectionType = keyof typeof MarqueeDirection;

interface PickUpMarqueeProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  direction?: MarqueeDirectionType;
  text?: string;
  repeatCount?: number;
}

export function PickUpMarquee({
  direction = MarqueeDirection.normal,
  text = DEFAULT_TEXT,
  repeatCount = DEFAULT_REPEAT_COUNT,
  className,
  ...props
}: PickUpMarqueeProps) {
  const items = Array.from({ length: repeatCount }, (_, i) => (
    <span // biome-ignore lint/suspicious/noArrayIndexKey: <リストは動的に変更されないため。>
      key={i}
      className="inline-block pl-[1.25rem] text-soypoy-main"
    >
      {text}
    </span>
  ));

  return (
    <div
      className={cn(
        "relative flex overflow-hidden",
        "font-bernard-mt text-2xl",
        "bg-soypoy-accent py-1",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex shrink-0",
          direction === MarqueeDirection.normal
            ? "animate-marquee"
            : "animate-marquee-reverse",
        )}
      >
        {items}
      </div>
      {/* 2つ目のマーキーグループ(シームレスなループのため) */}
      <div
        className={cn(
          "flex shrink-0",
          direction === MarqueeDirection.normal
            ? "animate-marquee"
            : "animate-marquee-reverse",
        )}
        aria-hidden="true"
      >
        {items}
      </div>
    </div>
  );
}
