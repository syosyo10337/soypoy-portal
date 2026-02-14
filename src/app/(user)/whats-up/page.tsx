import type { Metadata } from "next";
import { PageTitle } from "@/components/PageTitle";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
  title: "What's Up",
};

type ContentType = "artworks" | "radio" | "channel";

const CONTENT_CONFIG = {
  artworks: { subtitle: "Artworks" },
  radio: { subtitle: "Radio" },
  channel: { subtitle: "Channel" },
} as const;

interface WhatsUpPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function WhatsUpPage({ searchParams }: WhatsUpPageProps) {
  const resolvedSearchParams = await searchParams;
  const contentType = getContentType(resolvedSearchParams.type);
  const config = CONTENT_CONFIG[contentType];

  return (
    <div className={cn("container mx-auto max-w-5xl", "px-12 md:px-16 py-8")}>
      <PageTitle title="What’s up" subtitle={config.subtitle} />
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <p
          className={cn(
            "font-anymale",
            "text-5xl md:text-[66px]",
            "leading-tight md:leading-[66px]",
            "tracking-tight md:tracking-[-1.32px]",
            "text-black",
          )}
        >
          Coming soon...
        </p>
      </div>
    </div>
  );
}

function getContentType(typeParam: string | undefined): ContentType {
  if (!typeParam) return "artworks";

  const validTypes: ContentType[] = ["artworks", "radio", "channel"];
  if (validTypes.includes(typeParam as ContentType)) {
    return typeParam as ContentType;
  }

  return "artworks";
}
