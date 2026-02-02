"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn/sheet";
import { cn } from "@/utils/cn";
import type { NavItem } from "./constant";

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
        className="w-full h-full bg-soypoy-main border-none p-0 [&>button]:text-soypoy-secondary [&>button]:hover:bg-black/5"
      >
        <SheetHeader className="absolute top-0 left-0 w-0 h-0 overflow-hidden">
          <SheetTitle className="sr-only">ナビゲーションメニュー</SheetTitle>
        </SheetHeader>

        <nav className="flex-1 py-16 px-8 text-right">
          <ul className="space-y-4 text-right">
            {navItems.map((item) => (
              <li key={item.name}>
                <SheetClose asChild>
                  <Link
                    href={item.href}
                    className="block text-lg font-bold py-6 px-4 active:text-soypoy-accent transition-all duration-200 text-soypoy-secondary text-right"
                  >
                    {item.name}
                  </Link>
                </SheetClose>
                {item.children && (
                  <ul className="flex flex-col items-end space-y-2 pr-4">
                    {item.children.map((child) => (
                      <li
                        key={child.name}
                        className="flex flex-row-reverse items-center gap-2"
                      >
                        <span className="text-soypoy-secondary">•</span>
                        <SheetClose asChild>
                          <Link
                            href={child.href}
                            className="text-base py-2 active:text-soypoy-accent transition-all duration-200 text-soypoy-secondary"
                          >
                            {child.name}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
