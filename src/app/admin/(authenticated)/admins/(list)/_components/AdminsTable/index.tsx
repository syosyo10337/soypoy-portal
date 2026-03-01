"use client";

import { useList } from "@refinedev/core";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import type { AdminUserEntity } from "@/domain/entities";
import { AdminsTableLoading } from "../AdminsTableLoading";
import { NoAdminsRow } from "./NoAdminsRow";
import { AdminTableRow } from "./Row";

export function AdminsTable() {
  const { result, query } = useList<AdminUserEntity>();

  const admins = result.data ?? [];

  if (query.isLoading) {
    return <AdminsTableLoading />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>ロール</TableHead>
              <TableHead className="hidden md:table-cell">作成日</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <NoAdminsRow />
            ) : (
              admins.map((admin) => (
                <AdminTableRow key={admin.id} admin={admin} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        合計 {admins.length} 件
      </div>
    </>
  );
}
