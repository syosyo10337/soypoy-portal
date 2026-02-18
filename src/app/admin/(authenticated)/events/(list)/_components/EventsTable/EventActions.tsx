"use client";

import type { ReactNode } from "react";
import { useInvalidate } from "@refinedev/core";
import { Eye, EyeOff, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useDeleteEvent,
  usePublishEvent,
  useUnpublishEvent,
} from "@/app/admin/_hooks/useTrpcMutations";
import {
  ActionTypes,
  EventActionDialog,
} from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { PublicationStatus } from "@/domain/entities";

interface EventActionsProps {
  eventId: string;
  publicationStatus: PublicationStatus;
}

/**
 * イベント操作ドロップダウンメニュー
 */
export function EventActions({
  eventId,
  publicationStatus,
}: EventActionsProps): ReactNode {
  const router = useRouter();
  const invalidate = useInvalidate();
  const { mutate: publishEvent, isPending: isPublishing } = usePublishEvent();
  const { mutate: unpublishEvent, isPending: isUnpublishing } =
    useUnpublishEvent();
  const { mutate: deleteEvent, isPending: isDeleting } = useDeleteEvent();
  const [dialogAction, setDialogAction] = useState<ActionTypes | null>(null);

  const isDraft = publicationStatus === PublicationStatus.Draft;
  const isPublished = publicationStatus === PublicationStatus.Published;

  const closeDialog = () => setDialogAction(null);

  const handleConfirm = () => {
    const onSuccess = () => {
      closeDialog();
      invalidate({ resource: "events", invalidates: ["list"] });
    };

    // TODO: toast導入後にエラー通知を追加
    const onError = () => closeDialog();

    switch (dialogAction) {
      case ActionTypes.Publish:
        publishEvent(eventId, { onSuccess, onError });
        break;
      case ActionTypes.Unpublish:
        unpublishEvent(eventId, { onSuccess, onError });
        break;
      case ActionTypes.Delete:
        deleteEvent(eventId, { onSuccess, onError });
        break;
    }
  };

  const isPending = isPublishing || isUnpublishing || isDeleting;

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">操作メニュー</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="border-0"
          onClick={(e) => e.stopPropagation()}
        >
          {isDraft && (
            <DropdownMenuItem
              onSelect={() => setDialogAction(ActionTypes.Publish)}
            >
              <Eye className="text-green-600" />
              <span>公開</span>
            </DropdownMenuItem>
          )}
          {isPublished && (
            <DropdownMenuItem
              onSelect={() => setDialogAction(ActionTypes.Unpublish)}
            >
              <EyeOff />
              <span>下書きに戻す</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={() => router.push(`/admin/events/${eventId}/edit`)}
          >
            <Pencil />
            <span>編集</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setDialogAction(ActionTypes.Delete)}
          >
            <Trash />
            <span>削除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EventActionDialog
        action={dialogAction}
        open={dialogAction !== null}
        onOpenChange={(open) => !open && !isPending && closeDialog()}
        onConfirm={handleConfirm}
        isPending={isPending}
      />
    </>
  );
}
