"use client";

import { useList } from "@refinedev/core";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import type { EventEntity } from "@/domain/entities";
import { EventsTableLoading } from "../EventsTableLoading";
import { NoEventsRow } from "./NoEventsRow";
import { EventTableRow } from "./Row";

/**
 * イベント一覧テーブル
 */
export function EventsTable() {
  const { result, query } = useList<EventEntity>();

  const events = result.data ?? [];

  if (query.isLoading) {
    return <EventsTableLoading />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>サムネイル</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead>日付</TableHead>
              <TableHead>種類</TableHead>
              <TableHead>ステータス</TableHead>
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
      <div className="text-sm text-muted-foreground">
        合計 {events.length} 件
      </div>
    </>
  );
}
