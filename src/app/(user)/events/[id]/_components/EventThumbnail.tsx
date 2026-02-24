"use client";

import Image from "next/image";
import { CldImage } from "next-cloudinary";
import NoImage from "@/assets/no-image.png";
import { BubleLabel, getLabelPositionClassName } from "@/components/BubleLabel";
import type { EventType } from "@/domain/entities";
import { cn } from "@/utils/cn";
import { getRandomNumberWithRange } from "@/utils/rand";

interface EventThumbnailProps {
  src: string | null | undefined;
  alt: string;
  eventType: EventType;
  className?: string;
}

export function EventThumbnail({
  src,
  alt,
  eventType,
  className,
}: EventThumbnailProps) {
  return (
    <div className={cn("relative mx-auto md:mx-0", className)}>
      <EventImage src={src} alt={alt} />
      <div
        className={cn(
          getLabelPositionClassName(getRandomNumberWithRange(4), {
            skipTopLeft: true,
          }),
          "scale-100 md:scale-110",
        )}
      >
        <BubleLabel variant={eventType} />
      </div>
    </div>
  );
}

interface EventImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

export function EventImage({ src, alt, className }: EventImageProps) {
  return src === undefined || src === null ? (
    <Image
      src={NoImage}
      alt="イベントサムネイル画像なし"
      className={cn("w-full max-w-sm aspect-insta object-cover", className)}
      width={600}
      height={750}
      preload
    />
  ) : (
    <CldImage
      src={src}
      alt={`${alt}のイベントサムネイル画像`}
      className={cn("w-full max-w-sm aspect-insta object-cover", className)}
      width={600}
      height={750}
      crop="fill"
      gravity="auto"
      preload
    />
  );
}
