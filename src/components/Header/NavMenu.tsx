"use client";
import { Menu } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn/sheet";
import { cn } from "@/utils/cn";
import type { NavItem } from "./constant";
import { NavMenuItem } from "./NavItem";

export function NavMenu({ navItems }: { navItems: NavItem[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className={cn(
            "p-3 text-inherit font-display rounded-lg",
            "hover:!bg-transparent hover:!text-inherit",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
          )}
          aria-label="メニューを開く"
        >
          <Menu className="size-8" strokeWidth={1.2} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-54 md:w-64 h-full bg-soypoy-main border-none p-0 [&>button]:text-soypoy-secondary [&>button]:hover:bg-black/5"
      >
        <SheetHeader className="absolute top-0 left-0 w-0 h-0 overflow-hidden">
          <SheetTitle className="sr-only">ナビゲーションメニュー</SheetTitle>
        </SheetHeader>

        <nav
          className={cn(
            "font-display font-bold text-soypoy-secondary",
            "flex-1 py-12 px-6",
            "md:py-16 md:px-10",
          )}
        >
          <ul className="space-y-4">
            {navItems.map((item) => (
              <NavMenuItem key={item.name} item={item} />
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
