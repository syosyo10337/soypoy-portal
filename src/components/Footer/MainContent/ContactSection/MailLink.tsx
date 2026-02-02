import { Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
export function MailLink() {
  return (
    <Link
      href="mailto:yosemic@gmail.com"
      className={cn(
        "inline-flex items-center gap-2",
        "font-display font-medium",
        "text-lg", // NOTE: contactと揃える
        "hover:text-soypoy-accent",
        "transition-colors",
      )}
    >
      <Mail className="w-7 h-7" />
      yosemic@gmail.com
    </Link>
  );
}
