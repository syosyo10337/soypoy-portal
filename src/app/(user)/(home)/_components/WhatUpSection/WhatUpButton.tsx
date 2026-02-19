import { cva, type VariantProps } from "class-variance-authority";
import { CircleArrowRight } from "lucide-react";
import Link from "next/link";
import type * as React from "react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  [
    "relative overflow-hidden",
    "transition-all duration-300 ease-in-out",
    "group",
    "focus:outline-none focus:ring-2 focus:ring-soypoy-accent focus:ring-offset-2",
    "bg-soypoy-main hover:bg-soypoy-accent active:bg-soypoy-accent",
    "border-soypoy-secondary border-2 hover:border-soypoy-main active:border-soypoy-main",
  ],
  {
    variants: {
      size: {
        default: "px-3 py-2 md:py-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface WhatUpButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  title: string;
  prefix?: string;
  href?: string;
}

// TODO: fontサイズがかなり分散している。フォントサイズを統一する。
export default function WhatUpButton({
  className,
  size,
  title,
  prefix,
  href,
  ...props
}: WhatUpButtonProps) {
  const textTransitionClasses = "transition-colors duration-300";
  const firstChar = title[0];
  const restChars = title.slice(1);

  const buttonContent = (
    <div className="flex justify-between w-full">
      <div className="flex gap-2 md:gap-3">
        <span
          className={cn(
            "font-bernard-mt tracking-tight",
            "text-soypoy-accent group-hover:text-soypoy-main group-active:text-soypoy-main",
            "text-base md:text-[22px]",
            "pl-1 md:pl-2",
            "self-end pb-0.5 md:pb-1", // textを下に寄せるため
            textTransitionClasses,
          )}
        >
          {prefix}
        </span>
        <div
          className={cn(
            "font-anymale font-bold uppercase",
            "text-soypoy-secondary group-hover:text-soypoy-main group-active:text-soypoy-main",
            "text-3xl/7 md:text-[44px]/10",
            textTransitionClasses,
          )}
        >
          <span className="text-[38px]/7 md:text-[58px]/10 ">{firstChar}</span>
          {restChars}
        </div>
      </div>
      <div className="flex items-center px-2 md:px-3">
        <CircleArrowRight
          className={cn(
            "w-4 h-4 md:w-5 md:h-5",
            "text-soypoy-secondary group-hover:text-soypoy-main group-active:text-soypoy-main",
            textTransitionClasses,
          )}
        />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={cn(buttonVariants({ size }), className)}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button className={cn(buttonVariants({ size }), className)} {...props}>
      {buttonContent}
    </button>
  );
}
