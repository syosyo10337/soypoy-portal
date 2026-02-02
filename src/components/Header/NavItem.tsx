import Link from "next/link";
import { SheetClose } from "@/components/shadcn/sheet";
import { cn } from "@/utils/cn";
import type { NavItem } from "./constant";

const navLinkStyle =
  "underline decoration-1.5 decoration-transparent hover:decoration-current active:decoration-current transition-colors duration-400";

interface NavMenuItemProps {
  item: NavItem;
}

export function NavMenuItem({ item }: NavMenuItemProps) {
  return (
    <li>
      <SheetClose asChild>
        <Link
          href={item.href}
          className={cn("block text-2xl py-3 px-4", navLinkStyle)}
        >
          {item.name}
        </Link>
      </SheetClose>
      {item.children && (
        <ul className="space-y-2 pl-4">
          {item.children.map((child) => (
            <SubNavItem key={child.name} child={child} />
          ))}
        </ul>
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
      <span>•</span>
      <SheetClose asChild>
        <Link href={child.href} className={cn("text-xl py-1/2", navLinkStyle)}>
          {child.name}
        </Link>
      </SheetClose>
    </li>
  );
}
