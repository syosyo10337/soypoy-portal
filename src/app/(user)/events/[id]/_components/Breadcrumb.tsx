"use client";

import Link from "next/link";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbSeparator,
} from "@/components/shadcn/breadcrumb";
import { cn } from "@/utils/cn";
import { truncate } from "@/utils/text";

interface EventBreadcrumbProps {
  eventTitle: string;
}

/*
 * NOTE:本来汎用的なものだが、現状こちらでのみ使用しているため、コンポーネント化していない
 */
export function EventBreadcrumb({ eventTitle }: EventBreadcrumbProps) {
  return (
    <BreadcrumbRoot
      className={cn("text-sm font-display tracking-tight")}
      aria-label="パンくずリスト"
    >
      <BreadcrumbList className="gap-1 text-soypoy-muted">
        <BreadcrumbItem>
          <BreadcrumbLink
            asChild
            className="hover:text-soypoy-accent active:text-soypoy-accent"
          >
            <Link href="/events">EVENTS</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="mx-1 [&>svg]:hidden">
          &gt;
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{truncate(eventTitle, 30)}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}
