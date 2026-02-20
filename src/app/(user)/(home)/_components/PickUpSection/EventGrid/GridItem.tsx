import Image from "next/image";
import Link from "next/link";

import NoImage from "@/assets/no-image.png";
import { BubleLabel, getLabelPositionClassName } from "@/components/BubleLabel";
import type { EventType } from "@/domain/entities";
import { cn } from "@/utils/cn";
import { formatMonthDayOnly } from "@/utils/date";

interface GridItemProps {
  thumbnail?: string | null;
  title: string;
  link: string;
  date: string;
  type: EventType;
  index: number;
}

export default function GridItem({
  thumbnail,
  title,
  link,
  date,
  type,
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
          src={thumbnail ?? NoImage}
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
          <BubleLabel variant={type} />
        </div>
      </div>
      <p
        className={cn(
          "text-sm text-soypoy-muted m-1 md:m-2 ",
          "group-active:text-soypoy-accent md:group-hover:text-soypoy-accent",
          "transition-colors",
        )}
      >
        {formatMonthDayOnly(date)}
        <span className="block mt-1">Read More &gt;</span>
      </p>
    </Link>
  );
}

/**
 * グリッドアイテムのボーダースタイルを計算
 * NOTE: ピックアップイベントは最大4件の前提で実装（@see PICKUP_EVENTS_LIMIT）
 */
const getBorderClassName = (index: number) => {
  // 2列レイアウト（デフォルト〜lg未満）
  const needsRightBorder2Col = index % 2 === 0;
  const needsBottomBorder2Col = index < 2;

  // 4列レイアウト（lg以上）: 4件=1行なので bottom border 不要
  const needsRightBorder4Col = index % 4 < 3;

  // 全アイテムにborder-r/border-bを付けてコンテンツ領域を揃え、
  // 不要な箇所はtransparentで非表示にする
  return cn(
    "border-r border-b",
    needsRightBorder2Col ? "border-r-soypoy-secondary" : "border-r-transparent",
    needsBottomBorder2Col
      ? "border-b-soypoy-secondary"
      : "border-b-transparent",
    // 4列: border-b不要、border-rは最後以外に表示
    "lg:border-b-0",
    needsRightBorder4Col
      ? "lg:border-r-soypoy-secondary"
      : "lg:border-r-transparent",
  );
};
