"use client";

import type { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { cn } from "@/utils/cn";

export const ActionTypes = {
  Publish: "publish",
  Unpublish: "unpublish",
  Delete: "delete",
} as const satisfies Record<string, string>;

export type ActionTypes = (typeof ActionTypes)[keyof typeof ActionTypes];

interface DialogConfig {
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant: ComponentProps<typeof Button>["variant"];
  confirmClassName?: string;
}

const configs: Record<ActionTypes, DialogConfig> = {
  [ActionTypes.Publish]: {
    title: "イベントを公開",
    description: "このイベントを公開しますか？公開後はユーザーに表示されます。",
    confirmLabel: "公開する",
    confirmVariant: "default",
    confirmClassName: "bg-green-600 hover:bg-green-700",
  },
  [ActionTypes.Unpublish]: {
    title: "下書きに戻す",
    description:
      "このイベントを下書きに戻しますか？ユーザーには表示されなくなります。",
    confirmLabel: "下書きに戻す",
    confirmVariant: "secondary",
  },
  [ActionTypes.Delete]: {
    title: "イベントを削除",
    description: "ユーザーには表示されなくなります。",
    confirmLabel: "削除する",
    confirmVariant: "destructive",
  },
};

interface EventActionDialogProps {
  action: ActionTypes | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function EventActionDialog({
  action,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: EventActionDialogProps): ReactNode {
  if (!action) return null;

  const config = configs[action];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            キャンセル
          </Button>
          <Button
            type="button"
            variant={config.confirmVariant}
            className={cn(config.confirmClassName)}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {config.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
