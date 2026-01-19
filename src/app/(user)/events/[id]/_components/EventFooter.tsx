import { InstagramLink } from "@/components/InstagramLink";
import { cn } from "@/utils/cn";

export function EventFooter() {
  return (
    <div className={cn("mt-12 md:mt-16", "py-8", "text-center")}>
      <p
        className={cn(
          "font-display font-semibold",
          "text-base md:text-lg",
          "mb-4",
        )}
      >
        過去のイベントの様子はこちらから
      </p>
      <InstagramLink />
    </div>
  );
}
