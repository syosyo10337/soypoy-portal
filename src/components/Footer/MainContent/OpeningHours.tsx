import { cn } from "@/utils/cn";

export function OpeningHours({ className }: { className?: string }) {
  return (
    <div className={cn("text-left", className)}>
      <h2 className="text-2xl xl:text-3xl font-bold">Opening Hours</h2>
      <div className="">
        <OpeningHoursDetail title="FRI." open="19:30" close="23:30" />
        <div className="my-2 border-t border-current" />
        <OpeningHoursDetail title="SAT. SUN." open="19:00" close="23:30" />
      </div>
    </div>
  );
}

function OpeningHoursDetail({
  title,
  open,
  close,
}: {
  title: string;
  open: string;
  close: string;
}) {
  return (
    <div className="flex gap-2 text-xl justify-between">
      <p>{title}</p>
      <div className="grid grid-cols-[auto_auto] gap-x-2 items-baseline ">
        <p className="text-base">OPEN</p>
        <p className="text-2xl">{open}</p>
        <p className="text-base">CLOSE</p>
        <p className="text-2xl">{close}</p>
      </div>
    </div>
  );
}
