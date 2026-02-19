import { PageTitle } from "@/components/PageTitle";
import { Skeleton } from "@/components/shadcn/skeleton";
import { cn } from "@/utils/cn";

export default function EventDetailLoading() {
  return (
    <div className={cn("container mx-auto max-w-5xl", "px-8 md:px-16 py-8")}>
      <PageTitle title="Events" />
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2",
          "gap-4 md:gap-8",
          "mt-6",
          "font-display",
        )}
      >
        {/* Date */}
        <div className="order-1">
          <Skeleton className="h-10 md:h-12 w-40" />
        </div>
        {/* Title */}
        <div className="order-2">
          <Skeleton className="h-8 md:h-10 w-full" />
        </div>
        {/* Thumbnail */}
        <div className="order-3">
          <Skeleton className="w-full aspect-insta" />
        </div>
        {/* Description */}
        <div className="order-4 space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    </div>
  );
}
