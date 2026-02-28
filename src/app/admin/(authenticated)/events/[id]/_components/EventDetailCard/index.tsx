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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <DetailItem label="ID">{event.id}</DetailItem>

              <DetailItem label="日付">{formatDateJP(event.date)}</DetailItem>

              <DetailItem label="時間">
                {`開場 ${event.openTime} / 開始 ${event.startTime}`}
              </DetailItem>

              <DetailItem label="種類">
                <Badge variant="outline">{event.type}</Badge>
              </DetailItem>

              <DetailItem label="公開ステータス">
                <EventStatusBadge variant={event.publicationStatus} />
              </DetailItem>

              <DetailItem label="ピックアップ">
                <Badge variant={event.isPickup ? "default" : "secondary"}>
                  {event.isPickup ? "ON" : "OFF"}
                </Badge>
              </DetailItem>

              {event.description && (
                <DetailItem label="説明">
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </DetailItem>
              )}
            </div>

            <div>
              {event.thumbnail && (
                <DetailItem label="サムネイル">
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
                </DetailItem>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {(event.pricing?.length ||
        event.performers?.length ||
        event.hashtags?.length) && (
        <Card>
          <CardHeader>
            <CardTitle>イベント詳細</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.pricing && event.pricing.length > 0 && (
              <DetailItem label="料金">
                <table className="text-sm w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1 pr-4 font-medium">区分</th>
                      <th className="text-right py-1 pr-4 font-medium">金額</th>
                      <th className="text-left py-1 font-medium">備考</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.pricing.map((tier) => (
                      <tr key={tier.label} className="border-b last:border-0">
                        <td className="py-1 pr-4">{tier.label}</td>
                        <td className="py-1 pr-4 text-right">
                          {tier.amount.toLocaleString()}円
                        </td>
                        <td className="py-1">{tier.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </DetailItem>
            )}

            {event.performers && event.performers.length > 0 && (
              <DetailItem label="出演者">
                <ul className="space-y-1">
                  {event.performers.map((performer) => (
                    <li
                      key={performer.name}
                      className="flex items-center gap-2"
                    >
                      <span>{performer.name}</span>
                      {performer.role && (
                        <Badge variant="outline">{performer.role}</Badge>
                      )}
                      {performer.instagramHandle && (
                        <span className="text-muted-foreground">
                          @{performer.instagramHandle}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </DetailItem>
            )}

            {event.hashtags && event.hashtags.length > 0 && (
              <DetailItem label="ハッシュタグ">
                <div className="flex flex-wrap gap-2">
                  {event.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </DetailItem>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">
        {label}
      </h3>
      <div className="text-sm">{children}</div>
    </div>
  );
}
