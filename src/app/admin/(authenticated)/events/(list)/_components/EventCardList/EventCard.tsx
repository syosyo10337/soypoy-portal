"use client";

import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { EventStatusBadge } from "@/components/admin/EventStatusBadge";
import type { EventEntity } from "@/domain/entities";
import { formatDateJP } from "@/utils/date";
import { EventActions } from "../EventsTable/EventActions";

interface EventCardProps {
  event: EventEntity;
}

/**
 * イベントSPカード
 *
 * カード全体タップで詳細遷移（アクション領域除外）
 */
export function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  const navigate = () => router.push(`/admin/events/${event.id}`);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-actions]") || target.closest("button")) {
      return;
    }
    navigate();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      const target = e.target as HTMLElement;
      if (target.closest("[data-actions]") || target.closest("button")) {
        return;
      }
      e.preventDefault();
      navigate();
    }
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: 内部にbutton（EventActions）を含むためdivを使用
    <div
      role="button"
      tabIndex={0}
      className="flex items-center gap-3 rounded-md border p-3 cursor-pointer active:bg-muted/50"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* サムネイル */}
      {event.thumbnail ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
          <CldImage
            src={event.thumbnail}
            alt={event.title}
            width={48}
            height={48}
            crop="fill"
            gravity="auto"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] text-white">
          No Image
        </div>
      )}

      {/* 情報 */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium">{event.title}</span>
        <span className="text-xs text-muted-foreground">
          {formatDateJP(event.date)}
        </span>
        <EventStatusBadge variant={event.publicationStatus} className="w-fit" />
      </div>

      {/* アクション */}
      <div className="shrink-0" data-actions>
        <EventActions
          eventId={event.id}
          publicationStatus={event.publicationStatus}
        />
      </div>
    </div>
  );
}
