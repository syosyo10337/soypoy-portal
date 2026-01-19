import Image from "next/image";
import Link from "next/link";

import { BubleLabel, getLabelPositionClassName } from "@/components/BubleLabel";
import type { EventType } from "@/domain/entities";
import { cn } from "@/utils/cn";

interface GridItemProps {
  thumbnail: string;
  title: string;
  link: string;
  date: string;
  eventType: EventType;
  index: number;
}

export default function GridItem({
  thumbnail,
  title,
  link,
  date,
  eventType,
  index,
}: GridItemProps) {
  return (
    <Link
      href={link}
      className={cn(
        "group block cursor-pointer py-6 px-4 md:px-5",
        getBorderClassName(index),
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soypoy-accent focus-visible:ring-offset-2",
      )}
    >
      <div className="relative mb-2 aspect-insta">
        <Image
          src={thumbnail}
          alt={title}
          width={400}
          height={500}
          className={cn(
            "w-full h-full object-cover",
            "transition-transform duration-300 group-active:scale-105  md:group-hover:scale-105",
          )}
        />
        <div
          className={cn(
            getLabelPositionClassName(index),
            "scale-100 md:scale-110",
          )}
        >
          <BubleLabel variant={eventType} />
        </div>
      </div>
      <p
        className={cn(
          "text-sm text-soypoy-muted m-1 md:m-2 ",
          "group-active:text-soypoy-accent md:group-hover:text-soypoy-accent",
          "transition-colors",
        )}
      >
        {date}
        <span className="block mt-1">Read More &gt;</span>
      </p>
    </Link>
  );
}

const getBorderClassName = (index: number) => {
  // 2列レイアウト（デフォルト〜lg未満）
  // 0列目（左列）にのみ右borderを追加 → 縦の線1本
  const needsRightBorder2Col = index % 2 === 0;
  // 0行目（上行）にのみ下borderを追加 → 横の線1本
  const needsBottomBorder2Col = index < 2;

  // 4列レイアウト（lg以上）
  // 0,1,2列目（最後以外）にのみ右borderを追加 → 縦の線3本
  const needsRightBorder4Col = index % 4 < 3;
  return cn(
    "border-soypoy-secondary",
    needsRightBorder2Col && "border-r border-soypoy-secondary",
    needsBottomBorder2Col && "border-b border-soypoy-secondary",
    "lg:border-r-0 lg:border-b-0",
    needsRightBorder4Col && "lg:border-r lg:border-soypoy-secondary",
  );
};
