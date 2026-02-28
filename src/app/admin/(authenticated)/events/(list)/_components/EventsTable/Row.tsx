"use client";

import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { EventStatusBadge } from "@/components/admin/EventStatusBadge";
import { Badge } from "@/components/shadcn/badge";
import { TableCell, TableRow } from "@/components/shadcn/table";
import type { EventEntity } from "@/domain/entities";
import { formatDateJP } from "@/utils/date";
import { EventActions } from "./EventActions";

interface EventTableRowProps {
  event: EventEntity;
}

/**
 * イベント一覧の1行
 * 行クリックで詳細画面に遷移（操作ボタン領域を除く）
 */
export function EventTableRow({ event }: EventTableRowProps) {
  const router = useRouter();

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    // アクションボタン領域のクリックは無視
    const target = e.target as HTMLElement;
    if (target.closest("[data-actions]") || target.closest("button")) {
      return;
    }
    router.push(`/admin/events/${event.id}`);
  };

  return (
    <TableRow onClick={handleRowClick} className="cursor-pointer">
      <TableCell>
        {event.thumbnail ? (
          <div className="relative w-16 h-16 rounded-md overflow-hidden">
            <CldImage
              src={event.thumbnail}
              alt={event.title}
              width={64}
              height={64}
              crop="fill"
              gravity="auto"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-white text-xs">
            No Image
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{event.title}</TableCell>
      <TableCell>{formatDateJP(event.date)}</TableCell>
      <TableCell>
        <Badge variant="outline">{event.type}</Badge>
      </TableCell>
      <TableCell>
        <EventStatusBadge variant={event.publicationStatus} />
      </TableCell>
      <TableCell>
        <Badge variant={event.isPickup ? "default" : "secondary"}>
          {event.isPickup ? "ON" : "OFF"}
        </Badge>
      </TableCell>
      <TableCell className="text-center" data-actions>
        <EventActions
          eventId={event.id}
          publicationStatus={event.publicationStatus}
        />
      </TableCell>
    </TableRow>
  );
}
