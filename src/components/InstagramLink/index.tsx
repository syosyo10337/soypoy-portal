import Link from "next/link";
import { cn } from "@/utils/cn";
import InstagramIcon from "./instagram";

export const INSTAGRAM_URL = "https://instagram.com/soy.poy_";
export const INSTAGRAM_HANDLE = "@soy.poy_";

interface InstagramLinkProps {
  color?: "secondary" | "white";
}

export function InstagramLink({ color = "secondary" }: InstagramLinkProps) {
  return (
    <Link
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group",
        "inline-flex items-center gap-2",
        "font-display font-medium",
        "text-lg",
        "hover:text-soypoy-accent active:text-soypoy-accent",
        "transition-colors",
        color === "secondary" ? "text-soypoy-secondary" : "text-white",
      )}
    >
      <InstagramIcon
        className={cn(
          "w-6 h-6", // NOTE: 見た目を揃えるため、ちいちゃく
          "transition-colors",
          "group-hover:fill-soypoy-accent group-active:fill-soypoy-accent",
          color === "secondary" ? "fill-soypoy-secondary" : "fill-white",
        )}
      />
      {INSTAGRAM_HANDLE}
    </Link>
  );
}
