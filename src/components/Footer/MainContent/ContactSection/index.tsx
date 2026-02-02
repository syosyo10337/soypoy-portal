import { InstagramLink } from "@/components/InstagramLink";
import { cn } from "@/utils/cn";
import { MailLink } from "./MailLink";

export function ContactSection() {
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
        <MailLink />
        <InstagramLink color="white" />
      </div>
    </div>
  );
}
