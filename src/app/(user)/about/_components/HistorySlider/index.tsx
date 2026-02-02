"use client";

import { cn } from "@/utils/cn";
import SectionTitle from "../SectionTitle";
import { HISTORY_EVENTS } from "./HISTORY_EVENTS";
import HistoryIndicator from "./HistoryIndicator";
import HistoryItem from "./HistoryItem";
import {
  NextHistoryButton,
  PreviousHistoryButton,
} from "./HistoryNavigationButton";
import { useHistorySlider } from "./useHistorySlider";

export default function HistorySlider() {
  const {
    scrollContainerRef,
    activeIndex,
    sidePadding,
    isReady,
    scroll,
    scrollToIndex,
  } = useHistorySlider({
    totalItems: HISTORY_EVENTS.length,
  });

  return (
    <section id="history" className="py-12 md:py-20 px-4 md:px-10 lg:px-20">
      <div className="flex items-center justify-between px-4 md:px-8 mb-8 md:mb-12">
        <PreviousHistoryButton onClick={() => scroll("left")} />
        <SectionTitle>History</SectionTitle>
        <NextHistoryButton onClick={() => scroll("right")} />
      </div>

      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-soypoy-main to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-soypoy-main to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollContainerRef}
          className={cn(
            "flex",
            "overflow-x-auto",
            "pb-4",
            "snap-x snap-mandatory",
            "scrollbar-hide",
            "[&::-webkit-scrollbar]:hidden",
            "[-ms-overflow-style:none]",
            "[scrollbar-width:none]",
            "transition-opacity duration-300",
            isReady ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="shrink-0" style={{ width: sidePadding }} />
          {HISTORY_EVENTS.map((event) => (
            <HistoryItem
              key={event.id}
              yearDate={event.yearDate}
              image={event.image}
              description={event.description}
            />
          ))}
          <div className="shrink-0" style={{ width: sidePadding }} />
        </div>
      </div>

      <HistoryIndicator
        total={HISTORY_EVENTS.length}
        activeIndex={activeIndex}
        onIndicatorClick={scrollToIndex}
      />
    </section>
  );
}
