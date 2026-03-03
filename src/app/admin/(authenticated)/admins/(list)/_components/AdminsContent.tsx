"use client";

import { useList } from "@refinedev/core";
import { Pagination } from "@/components/admin/Pagination";
import type { AdminUserEntity } from "@/domain/entities";
import { usePagination } from "@/hooks/usePagination";
import { AdminCardList } from "./AdminCardList";
import { AdminCardSkeleton } from "./AdminCardList/AdminCardSkeleton";
import { AdminsTable } from "./AdminsTable";
import { AdminsTableLoading } from "./AdminsTableLoading";

const PAGE_SIZE = 6;

/**
 * 管理者一覧の統合コンポーネント
 *
 * SP: カード表示、PC: テーブル表示
 * クライアントサイドページネーション付き
 */
export function AdminsContent() {
  const { result, query } = useList<AdminUserEntity>();
  const admins = result.data ?? [];
  const { paginatedItems, ...pagination } = usePagination(admins, PAGE_SIZE);

  if (query.isLoading) {
    return (
      <>
        <div className="md:hidden">
          <AdminCardSkeleton />
        </div>
        <div className="hidden md:block">
          <AdminsTableLoading />
        </div>
      </>
    );
  }

  return (
    <>
      {/* SP: カード表示 */}
      <div className="md:hidden">
        <AdminCardList admins={paginatedItems} />
      </div>
      {/* PC: テーブル表示 */}
      <div className="hidden md:block">
        <AdminsTable admins={paginatedItems} />
      </div>
      {/* 共通: 件数 + ページネーション */}
      <div className="text-sm text-muted-foreground">
        合計 {admins.length} 件
      </div>
      <Pagination {...pagination} />
    </>
  );
}
