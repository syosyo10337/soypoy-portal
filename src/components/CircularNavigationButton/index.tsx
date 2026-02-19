import { cn } from "@/utils/cn";
import ArrowLeftIcon from "./ArrowLeftIcon";
import ArrowRightIcon from "./ArrowRightIcon";

interface CircularNavigationButtonProps {
  onClick: () => void;
  direction: "prev" | "next";
  ariaLabel: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-[46px] h-[47px] md:w-[64px] md:h-[66px]",
  lg: "w-16 h-16",
};

export function CircularNavigationButton({
  onClick,
  direction,
  ariaLabel,
  size = "sm",
  className,
}: CircularNavigationButtonProps) {
  const Icon = direction === "prev" ? ArrowLeftIcon : ArrowRightIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        sizeClasses[size],
        "rounded-full",
        "bg-soypoy-accent",
        "flex items-center justify-center",
        "transition-opacity hover:opacity-80 active:opacity-80",
        className,
      )}
      aria-label={ariaLabel}
    >
      <Icon aria-hidden="true" className="w-full h-full" />
    </button>
  );
}
