"use client";

import type { ReactNode } from "react";
import { useDelete, useInvalidate } from "@refinedev/core";
import {
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Search,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  usePublishEvent,
  useUnpublishEvent,
} from "@/app/admin/_hooks/useTrpcMutations";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
  type PublicationStatus,
  canPublish,
  canUnpublish,
} from "@/domain/entities";

interface EventActionsProps {
  eventId: string;
  publicationStatus: PublicationStatus;
}

type ConfirmDialogType = "publish" | "unpublish" | "delete" | null;

/**
 * イベント操作ドロップダウンメニュー
 */
export function EventActions({
  eventId,
  publicationStatus,
}: EventActionsProps): ReactNode {
  const router = useRouter();
  const invalidate = useInvalidate();
  const publishEvent = usePublishEvent();
  const unpublishEvent = useUnpublishEvent();
  const { mutate: deleteEvent, mutation } = useDelete();
  const isDeleting = mutation.isPending;
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogType>(null);

  const isPublishable = canPublish(publicationStatus);
  const isUnpublishable = canUnpublish(publicationStatus);

  const closeDialog = () => setConfirmDialog(null);

  const handlePublish = () => {
    publishEvent.mutate(eventId, {
      onSuccess: () => {
        closeDialog();
        invalidate({ resource: "events", invalidates: ["list"] });
      },
    });
  };

  const handleUnpublish = () => {
    unpublishEvent.mutate(eventId, {
      onSuccess: () => {
        closeDialog();
        invalidate({ resource: "events", invalidates: ["list"] });
      },
    });
  };

  const handleDelete = () => {
    deleteEvent(
      { resource: "events", id: eventId },
      { onSuccess: closeDialog },
    );
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">操作メニュー</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isPublishable && (
            <DropdownMenuItem onSelect={() => setConfirmDialog("publish")}>
              <Eye className="text-green-600" />
              <span>公開</span>
            </DropdownMenuItem>
          )}
          {isUnpublishable && (
            <DropdownMenuItem onSelect={() => setConfirmDialog("unpublish")}>
              <EyeOff />
              <span>非公開</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={() => router.push(`/admin/events/${eventId}`)}
          >
            <Search />
            <span>詳細</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => router.push(`/admin/events/${eventId}/edit`)}
          >
            <Pencil />
            <span>編集</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setConfirmDialog("delete")}
          >
            <Trash />
            <span>削除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmDialog === "publish"}
        onOpenChange={(open) =>
          !open && !publishEvent.isPending && closeDialog()
        }
        title="イベントを公開"
        description="このイベントを公開しますか？公開後はユーザーに表示されます。"
        confirmLabel="公開する"
        confirmClassName="bg-green-600 hover:bg-green-700"
        onConfirm={handlePublish}
        isPending={publishEvent.isPending}
      />

      <ConfirmDialog
        open={confirmDialog === "unpublish"}
        onOpenChange={(open) =>
          !open && !unpublishEvent.isPending && closeDialog()
        }
        title="イベントを非公開"
        description="このイベントを非公開にしますか？ユーザーには表示されなくなります。"
        confirmLabel="非公開にする"
        confirmVariant="secondary"
        onConfirm={handleUnpublish}
        isPending={unpublishEvent.isPending}
      />

      <ConfirmDialog
        open={confirmDialog === "delete"}
        onOpenChange={(open) => !open && !isDeleting && closeDialog()}
        title="イベントを削除"
        description="このイベントを削除しますか？この操作は取り消せません。"
        confirmLabel="削除する"
        confirmVariant="destructive"
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </>
  );
}
