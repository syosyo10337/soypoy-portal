"use client";

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
import type { ReactNode } from "react";
import { useState } from "react";
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
  const {
    mutate: deleteEvent,
    mutation: { isPending: isDeleting },
  } = useDelete();

  const [activeDialog, setActiveDialog] = useState<ActionTypes | null>(null);

  if (publicationStatus === PublicationStatus.Archived) return;

  const closeDialog = () => setActiveDialog(null);

  const handlePublish = () => {
    publishEvent(eventId, {
      onSuccess: () => {
        closeDialog();
        invalidate({ resource: "events", invalidates: ["list"] });
      },
    });
  };

  const handleUnpublish = () => {
    unpublishEvent(eventId, {
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
        <DropdownMenuContent align="end" className="border-0">
          {publicationStatus === PublicationStatus.Draft ? (
            <DropdownMenuItem
              onSelect={() => setActiveDialog(ActionTypes.Publish)}
            >
              <Eye className="text-green-600" />
              <span>公開</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onSelect={() => setActiveDialog(ActionTypes.Unpublish)}
            >
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
            onSelect={() => setActiveDialog(ActionTypes.Delete)}
          >
            <Trash />
            <span>削除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EventActionDialog
        open={activeDialog === ActionTypes.Publish}
        onOpenChange={(open) => !open && !isPublishing && closeDialog()}
        variant={ActionTypes.Publish}
        onConfirm={handlePublish}
        isPending={isPublishing}
      />
      <EventActionDialog
        open={activeDialog === ActionTypes.Unpublish}
        onOpenChange={(open) => !open && !isUnpublishing && closeDialog()}
        variant={ActionTypes.Unpublish}
        onConfirm={handleUnpublish}
        isPending={isUnpublishing}
      />
      <EventActionDialog
        open={activeDialog === ActionTypes.Delete}
        onOpenChange={(open) => !open && !isDeleting && closeDialog()}
        variant={ActionTypes.Delete}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </>
  );
}
