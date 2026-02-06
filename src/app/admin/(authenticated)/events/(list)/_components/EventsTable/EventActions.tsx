"use client";

import { useState } from "react";
import { useDelete, useInvalidate } from "@refinedev/core";
import { useGo } from "@refinedev/core";
import { EllipsisVertical, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import {
  usePublishEvent,
  useUnpublishEvent,
} from "@/app/admin/_hooks/useTrpcMutations";
import {
  ActionTypes,
  EventActionDialog,
} from "@/components/admin/EventActionDialog";
import { Button } from "@/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import type { PublicationStatus } from "@/domain/entities";

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
}: EventActionsProps) {
  const [dialogAction, setDialogAction] = useState<ActionTypes | null>(null);
  const go = useGo();
  const invalidate = useInvalidate();

  const publishEvent = usePublishEvent();
  const unpublishEvent = useUnpublishEvent();
  const { mutate: deleteEvent } = useDelete();

  const isDraft = publicationStatus === "draft";
  const isPublished = publicationStatus === "published";

  const handleConfirm = () => {
    const onSuccess = () => {
      setDialogAction(null);
      invalidate({ resource: "events", invalidates: ["list"] });
    };

    switch (dialogAction) {
      case ActionTypes.Publish:
        publishEvent.mutate({ id: eventId }, { onSuccess });
        break;
      case ActionTypes.Unpublish:
        unpublishEvent.mutate({ id: eventId }, { onSuccess });
        break;
      case ActionTypes.Delete:
        deleteEvent(
          { resource: "events", id: eventId },
          { onSuccess: () => onSuccess() },
        );
        break;
    }
  };

  const isLoading = publishEvent.isPending || unpublishEvent.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" data-actions>
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              go({ to: `/admin/events/edit/${eventId}`, type: "push" })
            }
          >
            <Pencil className="size-4" />
            編集
          </DropdownMenuItem>
          {isDraft && (
            <DropdownMenuItem
              onClick={() => setDialogAction(ActionTypes.Publish)}
            >
              <Eye className="size-4" />
              公開する
            </DropdownMenuItem>
          )}
          {isPublished && (
            <DropdownMenuItem
              onClick={() => setDialogAction(ActionTypes.Unpublish)}
            >
              <EyeOff className="size-4" />
              下書きに戻す
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDialogAction(ActionTypes.Delete)}
          >
            <Trash2 className="size-4" />
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EventActionDialog
        action={dialogAction}
        open={dialogAction !== null}
        onOpenChange={(open) => {
          if (!open) setDialogAction(null);
        }}
        onConfirm={handleConfirm}
        loading={isLoading}
      />
    </>
  );
}
