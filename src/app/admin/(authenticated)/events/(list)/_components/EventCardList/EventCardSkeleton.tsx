/**
 * イベントカードのスケルトン（3枚）
 */
export function EventCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3].map((id) => (
        <div
          key={`card-skeleton-${id}`}
          className="flex items-center gap-3 rounded-md border p-3"
        >
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-md bg-muted" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-8 w-8 shrink-0 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
