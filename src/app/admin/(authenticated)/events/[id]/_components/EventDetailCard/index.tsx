import { CldImage } from "next-cloudinary";
import { EventStatusBadge } from "@/components/admin/EventStatusBadge";
import { Badge } from "@/components/shadcn/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import type { EventEntity } from "@/domain/entities";
import { formatDateJP } from "@/utils/date";

interface EventDetailCardProps {
  event: EventEntity;
}

export function EventDetailCard({ event }: EventDetailCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                ID
              </h3>
              <p className="text-sm">{event.id}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                日付
              </h3>
              <p className="text-sm">{formatDateJP(event.date)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                種類
              </h3>
              <Badge variant="outline">{event.type}</Badge>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                公開ステータス
              </h3>
              <EventStatusBadge variant={event.publicationStatus} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                ピックアップ
              </h3>
              <Badge variant={event.isPickup ? "default" : "secondary"}>
                {event.isPickup ? "ON" : "OFF"}
              </Badge>
            </div>

            {event.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  説明
                </h3>
                <p className="text-sm whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}
          </div>

          <div>
            {event.thumbnail && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  サムネイル
                </h3>
                {/* NOTE: Cloudinaryの画像のためCldImageを使用 */}
                <CldImage
                  src={event.thumbnail}
                  alt={event.title}
                  width={400}
                  height={500}
                  crop="fill"
                  gravity="auto"
                  className="rounded-md border object-cover w-full aspect-insta"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
