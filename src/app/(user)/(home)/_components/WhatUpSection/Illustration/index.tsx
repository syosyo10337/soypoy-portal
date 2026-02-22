import Image from "next/image";
import { cn } from "@/utils/cn";
import { BarImage, LighterImage, RecordImage } from "./assets";

const SIZES = "(min-width: 1280px) 33vw, 50vw";

function IllustrationRecord({ className }: { className?: string }) {
  return (
    <IllustrationContainer className={className}>
      <Image
        src={RecordImage}
        alt="Record"
        fill
        sizes={SIZES}
        className="object-contain sm:object-right"
      />
    </IllustrationContainer>
  );
}

function IllustrationBar({ className }: { className?: string }) {
  return (
    <IllustrationContainer className={className}>
      <Image
        src={BarImage}
        alt="Bar"
        fill
        sizes={SIZES}
        className="object-contain sm:object-left"
      />
    </IllustrationContainer>
  );
}

function IllustrationLighter({ className }: { className?: string }) {
  return (
    <IllustrationContainer className={className}>
      <Image
        src={LighterImage}
        alt="Lighter"
        fill
        sizes={SIZES}
        className="object-contain sm:object-right"
      />
    </IllustrationContainer>
  );
}

function IllustrationContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("relative w-full h-full bg-soypoy-secondary", className)}
    >
      {children}
    </div>
  );
}

export { IllustrationRecord, IllustrationBar, IllustrationLighter };
