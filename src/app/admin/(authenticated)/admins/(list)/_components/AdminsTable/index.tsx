"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import type { AdminUserEntity } from "@/domain/entities";
import { NoAdminsRow } from "./NoAdminsRow";
import { AdminTableRow } from "./Row";

interface AdminsTableProps {
  admins: AdminUserEntity[];
}

/**
 * 管理者一覧テーブル（PC表示用）
 *
 * データ取得・ローディング制御は親コンポーネント（AdminsContent）が担当
 */
export function AdminsTable({ admins }: AdminsTableProps) {
  return (
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
  );
}
