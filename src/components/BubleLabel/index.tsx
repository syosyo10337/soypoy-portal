import Image, { type StaticImageData } from "next/image";
import type * as React from "react";
import { EventType } from "@/domain/entities";
import { cn } from "@/utils/cn";
import {
  ArtLabelImage,
  ComedyLabelImage,
  DanceLabelImage,
  DesignLabelImage,
  ImproKanjiLabelImage,
  ImproLabelImage,
  MovieLabelImage,
  MusicLabelImage,
  PhotoLabelImage,
  TalkLabelImage,
  TheaterLabelImage,
  WorkshopLabelImage,
} from "./assets";

export { getLabelPositionClassName } from "./utils";

const variantMap = {
  [EventType.Art]: {
    image: ArtLabelImage,
    label: "アート",
  },
  [EventType.Comedy]: {
    image: ComedyLabelImage,
    label: "お笑い",
  },
  [EventType.Dance]: {
    image: DanceLabelImage,
    label: "ダンス",
  },
  [EventType.Design]: {
    image: DesignLabelImage,
    label: "デザイン",
  },
  [EventType.Impro]: {
    image: ImproLabelImage,
    label: "インプロ",
  },
  [EventType.Impro_Kanji]: {
    image: ImproKanjiLabelImage,
    label: "即興",
  },
  [EventType.Movie]: {
    image: MovieLabelImage,
    label: "映画",
  },
  [EventType.Music]: {
    image: MusicLabelImage,
    label: "音楽",
  },
  [EventType.Photo]: {
    image: PhotoLabelImage,
    label: "写真",
  },
  [EventType.Talk]: {
    image: TalkLabelImage,
    label: "トーク",
  },
  [EventType.Theater]: {
    image: TheaterLabelImage,
    label: "演劇",
  },
  [EventType.Workshop]: {
    image: WorkshopLabelImage,
    label: "ワークショップ",
  },
  [EventType.Other]: {
    image: ArtLabelImage,
    label: "その他",
  },
} as const satisfies Record<
  EventType,
  { image: StaticImageData; label: string }
>;

interface BubleLabelProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  variant: EventType;
  size?: number;
}

export function BubleLabel({
  className,
  variant,
  size = 34,
  ...props
}: BubleLabelProps) {
  const { image, label } = variantMap[variant];

  if (!image) return null;

  return (
    <div className={cn("inline-block shrink-0", className)} {...props}>
      <Image
        src={image}
        alt={label}
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-md xl:w-12"
      />
    </div>
  );
}

export type { BubleLabelProps };
