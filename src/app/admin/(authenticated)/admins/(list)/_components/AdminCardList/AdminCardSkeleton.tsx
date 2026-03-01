/**
 * 管理者カードのスケルトン（3枚）
 */
export function AdminCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3].map((id) => (
        <div key={`admin-skeleton-${id}`} className="rounded-md border p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-36 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
