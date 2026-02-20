"use client";

import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Separator } from "@/components/shadcn/separator";
import { cn } from "@/utils/cn";

export function ClosedDaysHeader() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center relative gap-2">
        <div className="bg-background z-2 pr-4">
          <Breadcrumb />
        </div>
        <Separator className={cn("absolute", "left-0", "right-0", "z-1")} />
      </div>
      <h2 className="text-2xl font-bold">休業日管理</h2>
    </div>
  );
}
