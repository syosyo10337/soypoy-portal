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
 */
export function EventTableRow({ event }: EventTableRowProps) {
  return (
    <TableRow>
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
          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
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
      <TableCell className="text-center">
        <EventActions
          eventId={event.id}
          publicationStatus={event.publicationStatus}
        />
      </TableCell>
    </TableRow>
  );
}
