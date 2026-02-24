import { cn } from "@/utils/cn";
import { MarqueeDirection, PickUpMarquee } from "./PickUpMarquee";

/**
 * PickUpSection のスケルトン（CLS防止用）
 * 実際のセクションと同じレイアウト・高さを確保する
 */
export function PickUpSkeleton() {
  return (
    <section className="relative bg-soypoy-main">
      <PickUpMarquee direction={MarqueeDirection.normal} />
      <div
        className={cn(
          "flex flex-wrap justify-center",
          "w-full mx-auto text-center",
          "max-w-[560px] md:max-w-[630px] lg:max-w-full xl:max-w-[80vw] 2xl:max-w-[70vw]",
          "[&>*]:w-1/2 lg:[&>*]:w-1/4",
        )}
      >
        <SkeletonItem borderClassName="border-r-soypoy-secondary border-b-soypoy-secondary lg:border-b-0 lg:border-r-soypoy-secondary" />
        <SkeletonItem borderClassName="border-r-transparent border-b-soypoy-secondary lg:border-b-0 lg:border-r-soypoy-secondary" />
        <SkeletonItem borderClassName="border-r-soypoy-secondary border-b-transparent lg:border-b-0 lg:border-r-soypoy-secondary" />
        <SkeletonItem borderClassName="border-r-transparent border-b-transparent lg:border-b-0 lg:border-r-transparent" />
      </div>
      <PickUpMarquee direction={MarqueeDirection.reverse} />
    </section>
  );
}

function SkeletonItem({ borderClassName }: { borderClassName: string }) {
  return (
    <div className={cn("py-6 px-4 md:px-5 border-r border-b", borderClassName)}>
      <div className="mb-2 aspect-insta animate-pulse rounded bg-soypoy-secondary/10" />
      <div className="m-1 space-y-2 md:m-2">
        <div className="h-3.5 w-16 animate-pulse rounded bg-soypoy-secondary/10" />
        <div className="h-3.5 w-20 animate-pulse rounded bg-soypoy-secondary/10" />
      </div>
    </div>
  );
}
