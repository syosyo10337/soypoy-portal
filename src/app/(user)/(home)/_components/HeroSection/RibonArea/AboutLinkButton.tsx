import { CircleArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import { cn } from "@/utils/cn";

export function AboutLinkButton() {
  return (
    <Button
      asChild
      className={cn(
        "relative",
        "w-64 h-14",
        "bg-soypoy-main",
        "border-2 border-soypoy-secondary",
        "rounded-full",
        "shadow-[4.9125px_4.9125px_0px_#F0433C]",
        "hover:bg-soypoy-accent hover:shadow-none active:bg-soypoy-accent active:shadow-none",
        "transition-all duration-200",
        "text-soypoy-secondary font-anymale font-bold",
        "flex items-center justify-center gap-2",
        "px-6",
      )}
    >
      <Link href="/about" className="flex items-center justify-center gap-2">
        <span className="text-xl leading-5">About</span>
        <span className="text-3xl leading-8">SOY-POY</span>
        <CircleArrowRight className="size-5! md:size-6!" />
      </Link>
    </Button>
  );
}
