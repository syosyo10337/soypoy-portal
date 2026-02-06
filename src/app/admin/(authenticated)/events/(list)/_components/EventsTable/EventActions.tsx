"use client";

import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { EditButton } from "@/components/refine-ui/buttons/edit";

interface EventActionsProps {
  eventId: string;
}

/**
 * イベント操作ボタン群
 *
 * Refineのボタンコンポーネントを使用
 */
export function EventActions({ eventId }: EventActionsProps) {
  return (
    <div className="flex justify-end gap-2" data-actions>
      <EditButton
        recordItemId={eventId}
        className="bg-secondary text-secondary-foreground"
      />
      <DeleteButton
        recordItemId={eventId}
        className="bg-destructive text-destructive-foreground"
        confirmDescription="ユーザーには表示されなくなります"
      />
    </div>
  );
}
