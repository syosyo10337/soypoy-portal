"use client";

import Image from "next/image";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import NoImage from "@/assets/no-image.png";
import type { EventEntity } from "@/domain/entities";
import { cn } from "@/utils/cn";
import {
  formatDayOfWeek,
  formatMonthDayOnly,
  formatTime,
  getDayOfWeekColorClass,
} from "@/utils/date";
import { truncate } from "@/utils/text";
import { PickUpLabel } from "./PickUpLabel";

interface EventListItemProps {
  event: EventEntity & { isPickUp?: boolean };
}

export function EventListItem({ event }: EventListItemProps) {
  //TODO: 価格のロジックを修正する。
  const priceOrCondition =
    event.description?.includes("フリーカンパ") ||
    event.description?.includes("フリー")
      ? "フリーカンパ制+1ドリンク"
      : event.description?.match(/¥[\d,]+/)
        ? event.description.match(/¥[\d,]+/)?.[0]
        : null;

  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        "relative flex",
        "gap-4 md:gap-6",
        "py-3",
        "font-display",
        "hover:bg-soypoy-secondary/5",
        "transition-colors",
        "cursor-pointer",
      )}
    >
      <div
        className={cn(
          "flex flex-shrink-0",
          "flex-col md:flex-row justify-between",
          "gap-3 md:gap-4",
          "basis-[30%] md:flex-none md:w-[250px] lg:w-[280px]",
        )}
      >
        <div>
          <div className="text-3xl md:text-4xl font-medium">
            {formatMonthDayOnly(event.date)}
          </div>
          <div
            className={cn(
              "text-base/2 md:text-lg font-semibold",
              getDayOfWeekColorClass(event.date),
            )}
          >
            {formatDayOfWeek(event.date)}
          </div>
        </div>
        {event.thumbnail ? (
          <CldImage
            src={event.thumbnail}
            alt={`${event.title}のイベントサムネイル画像`}
            className={cn("w-34 md:w-38 lg:w-42", "aspect-insta object-cover")}
            width={400}
            height={500}
            crop="fill"
            gravity="auto"
          />
        ) : (
          <Image
            src={NoImage}
            alt="イベントサムネイル画像なし"
            className={cn("w-34 md:w-38 lg:w-42", "aspect-insta object-cover")}
            width={400}
            height={500}
          />
        )}
      </div>

      <div
        className={cn("flex flex-col justify-start", "basis-[70%] md:flex-1")}
      >
        <h3 className="text-base md:text-2xl font-semibold mb-2">
          {truncate(event.title, 50)}
        </h3>

        <div className="text-soypoy-muted font-display text-sm md:text-base">
          {priceOrCondition && <p>{priceOrCondition}</p>}
          <p>{`START: ${formatTime(event.date)}`}</p>
        </div>
      </div>
      {event.isPickUp && <PickUpLabel />}
    </Link>
  );
}
