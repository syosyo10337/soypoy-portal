"use client";

import { cn } from "@/utils/cn";
import { parseTextWithUrls } from "@/utils/linkify";
import { parseEventDescription } from "@/utils/parseEventDescription";

export interface EventDescriptionProps {
  description?: string;
  className?: string;
}

export function EventDescription({
  description,
  className,
}: EventDescriptionProps) {
  const sections = parseEventDescription(description);

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {sections.map((section) => (
        <EventDetailField
          key={section.label}
          label={section.label}
          content={section.content}
        />
      ))}
    </div>
  );
}

interface EventDetailFieldProps {
  label: string;
  content: string;
}

function EventDetailField({ label, content }: EventDetailFieldProps) {
  return (
    <div className="pt-4">
      <h2
        className={cn(
          "font-display font-semibold",
          "text-lg md:text-xl",
          "mb-3",
        )}
      >
        {label}
      </h2>
      <div
        className={cn(
          "font-display text-sm md:text-base",
          "leading-relaxed",
          "whitespace-pre-wrap",
        )}
      >
        <LinkifiedText text={content} />
      </div>
    </div>
  );
}

interface LinkifiedTextProps {
  text: string;
}

function LinkifiedText({ text }: LinkifiedTextProps) {
  const segments = parseTextWithUrls(text);

  return (
    <>
      {segments.map((segment) => {
        const keyContent =
          segment.type === "url"
            ? segment.content
            : segment.content.slice(0, 20);
        const key = `${segment.type}-${keyContent}`;

        if (segment.type === "url") {
          return (
            <a
              key={key}
              href={segment.content}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-soypoy-accent underline",
                "hover:text-soypoy-accent/80",
                "transition-colors",
                "break-all",
              )}
            >
              {segment.content}
            </a>
          );
        }
        return <span key={key}>{segment.content}</span>;
      })}
    </>
  );
}
