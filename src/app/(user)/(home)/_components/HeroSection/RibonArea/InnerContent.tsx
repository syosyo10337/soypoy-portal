import { Separator } from "@/components/shadcn/separator";
import { cn } from "@/utils/cn";
import { AboutLinkButton } from "./AboutLinkButton";

interface InnerContentProps {
  className?: string;
}

export function InnerContent({ className }: InnerContentProps) {
  return (
    <div className={cn("p-4", className)}>
      <div
        className={cn(
          "flex",
          "flex-col lg:flex-row",
          "gap-3 md:gap-0 lg:gap-4 lg:mt-14",
        )}
      >
        <SoypoySlogan />
      </div>
      <div className={cn("flex justify-center", "mt-6 mb-2 md:mt-8 md:mb-4")}>
        <AboutLinkButton />
      </div>
    </div>
  );
}

function SoypoySlogan() {
  const slogans = [
    {
      title: "SPACE",
      description: "この空間への敬意",
    },
    {
      title: "OTHERS",
      description: "ここにいる他者への敬意",
    },
    {
      title: "YOURSELF",
      description: "自分自身への敬意",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col justify-between items-center",
        "lg:flex-row lg:items-center lg:justify-center lg:w-full lg:gap-x-4 xl:gap-x-6",
      )}
    >
      {slogans.map((slogan, index) => (
        <div key={slogan.title} className="contents">
          {index > 0 && (
            <Separator
              orientation="vertical"
              className="hidden lg:block !w-[1px] bg-soypoy-secondary"
            />
          )}
          <div className="flex items-center justify-center text-center">
            <div className="pb-1">
              <h3
                className={cn(
                  "font-bold font-anymale",
                  "text-xl md:text-2xl lg:text-3xl",
                )}
              >
                <span
                  className={cn(
                    "text-2xl md:text-3xl lg:text-4xl",
                    "font-black text-soypoy-accent",
                  )}
                >
                  {slogan.title[0]}
                </span>
                {slogan.title.slice(1)}
              </h3>
              <p
                className={cn(
                  "text-base md:text-lg lg:text-2xl",
                  "font-zen-old-mincho leading-none",
                )}
              >
                {slogan.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
