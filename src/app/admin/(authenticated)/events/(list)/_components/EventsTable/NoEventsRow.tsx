import { TableCell, TableRow } from "@/components/shadcn/table";

/**
 * イベントが存在しない場合の表示行
 *
 * データが0件の場合に表示される
 */
export function NoEventsRow() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
        イベントがありません
      </TableCell>
    </TableRow>
  );
}
