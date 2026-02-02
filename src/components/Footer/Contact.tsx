import { InstagramLink } from "@/components/InstagramLink";
import { cn } from "@/utils/cn";
import { Mail } from "lucide-react";
import Link from "next/link";

export function Contact() {
  return (
    <div className="text-center py-8">
      <h2 className="text-2xl font-bold mb-4 font-anymale">Contact</h2>
      <div
        className={cn(
          "flex flex-col md:flex-row",
          "items-center justify-center",
          "gap-4 md:gap-8",
        )}
      >
        <Link
          href="mailto:yosemic@gmail.com"
          className="inline-flex items-center gap-2 text-lg hover:text-gray-300 transition-colors font-display font-medium"
        >
          <Mail className="w-7 h-7" />
          yosemic@gmail.com
        </Link>
        <InstagramLink color="white" />
      </div>
    </div>
  );
}
