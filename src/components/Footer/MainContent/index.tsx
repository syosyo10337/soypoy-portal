import { cn } from "@/utils/cn";
import { Acsess } from "./Acsess";
import { OpeningHours } from "./OpeningHours";

export default function MainContent() {
  return (
    <section
      className={cn(
        "font-display flex w-full",
        "flex-col md:flex-row",
        "gap-8 lg:gap-20",
      )}
    >
      <OpeningHours className="basis-3/10" />
      <Acsess className="basis-7/10" />
    </section>
  );
}
