import { cn } from "@/utils/cn";

export interface EventTitleProps {
  title: string;
  className?: string;
}

export function EventTitle({ title, className }: EventTitleProps) {
  return (
    <h1
      className={cn(
        "font-semibold",
        "text-2xl md:text-4xl",
        "leading-tight tracking-tight py-1",
        className,
      )}
    >
      {title}
    </h1>
  );
}
