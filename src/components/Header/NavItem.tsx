"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { SheetClose } from "@/components/shadcn/sheet";
import { cn } from "@/utils/cn";
import type { NavItem } from "./constant";

const navLinkStyle =
  "underline decoration-[1.5px] decoration-transparent hover:decoration-current active:decoration-current transition-colors duration-[400ms]";

interface NavMenuItemProps {
  item: NavItem;
}

export function NavMenuItem({ item }: NavMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li>
      <div className="flex items-center">
        <SheetClose asChild>
          <Link
            href={item.href}
            className={cn("block text-2xl py-3 px-4 flex-1", navLinkStyle)}
          >
            {item.name}
          </Link>
        </SheetClose>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 active:opacity-70"
            aria-label={isOpen ? "サブメニューを閉じる" : "サブメニューを開く"}
            aria-expanded={isOpen}
          >
            <motion.span
              className="block"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <ChevronDown className="size-5" strokeWidth={2} />
            </motion.span>
          </button>
        )}
      </div>
      {hasChildren && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.ul
              className="space-y-2 pl-4 pb-4 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {item.children?.map((child) => (
                <SubNavItem key={child.name} child={child} />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}

interface SubNavItemProps {
  child: NonNullable<NavItem["children"]>[number];
}

function SubNavItem({ child }: SubNavItemProps) {
  return (
    <li className="flex items-center gap-2">
      <span aria-hidden="true">•</span>
      <SheetClose asChild>
        <Link href={child.href} className={cn("text-xl py-0.5", navLinkStyle)}>
          {child.name}
        </Link>
      </SheetClose>
    </li>
  );
}
