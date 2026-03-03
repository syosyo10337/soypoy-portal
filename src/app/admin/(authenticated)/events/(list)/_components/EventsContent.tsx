"use client";

import { useList } from "@refinedev/core";
import { Pagination } from "@/components/admin/Pagination";
import type { EventEntity } from "@/domain/entities";
import { usePagination } from "@/hooks/usePagination";
import { EventCardList } from "./EventCardList";
import { EventCardSkeleton } from "./EventCardList/EventCardSkeleton";
import { EventsTable } from "./EventsTable";
import { EventsTableLoading } from "./EventsTableLoading";

const PAGE_SIZE = 6;

/**
 * イベント一覧の統合コンポーネント
 *
 * SP: カード表示、PC: テーブル表示
 * クライアントサイドページネーション付き
 */
export function EventsContent() {
  const { result, query } = useList<EventEntity>();
  const events = result.data ?? [];
  const { paginatedItems, ...pagination } = usePagination(events, PAGE_SIZE);

  if (query.isLoading) {
    return (
      <>
        <div className="md:hidden">
          <EventCardSkeleton />
        </div>
        <div className="hidden md:block">
          <EventsTableLoading />
        </div>
      </>
    );
  }

  return (
    <>
      {/* SP: カード表示 */}
      <div className="md:hidden">
        <EventCardList events={paginatedItems} />
      </div>
      {/* PC: テーブル表示 */}
      <div className="hidden md:block">
        <EventsTable events={paginatedItems} />
      </div>
      {/* 共通: 件数 + ページネーション */}
      <div className="text-sm text-muted-foreground">
        合計 {events.length} 件
      </div>
      <Pagination {...pagination} />
    </>
  );
}
