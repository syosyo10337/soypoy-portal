import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";

/**
 * イベントテーブルのローディング状態
 *
 * Suspense fallbackとして使用
 * EventsTableと同じヘッダー構造を持つ
 */
export function EventsTableLoading() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>サムネイル</TableHead>
            <TableHead>タイトル</TableHead>
            <TableHead>日付</TableHead>
            <TableHead>種類</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>ピックアップ</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((id) => (
            <TableRow key={`skeleton-${id}`}>
              <TableCell>
                <div className="h-16 w-16 bg-muted animate-pulse rounded-md" />
              </TableCell>
              <TableCell>
                <div className="h-5 w-48 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-5 w-24 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
              </TableCell>
              <TableCell>
                <div className="h-6 w-12 bg-muted animate-pulse rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <div className="h-9 w-16 bg-muted animate-pulse rounded-md" />
                  <div className="h-9 w-16 bg-muted animate-pulse rounded-md" />
                  <div className="h-9 w-16 bg-muted animate-pulse rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
