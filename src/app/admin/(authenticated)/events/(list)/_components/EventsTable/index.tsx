"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import type { EventEntity } from "@/domain/entities";
import { NoEventsRow } from "./NoEventsRow";
import { EventTableRow } from "./Row";

interface EventsTableProps {
  events: EventEntity[];
}

/**
 * イベント一覧テーブル（PC表示用）
 *
 * データ取得・ローディング制御は親コンポーネント（EventsContent）が担当
 */
export function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden md:table-cell">サムネイル</TableHead>
            <TableHead>タイトル</TableHead>
            <TableHead>日付</TableHead>
            <TableHead className="hidden md:table-cell">種類</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead className="hidden md:table-cell">ピックアップ</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <NoEventsRow />
          ) : (
            events.map((event) => (
              <EventTableRow key={event.id} event={event} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
