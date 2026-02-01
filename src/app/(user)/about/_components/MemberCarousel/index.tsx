"use client";

import { animate, motion, useMotionValue } from "motion/react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import SectionTitle from "../SectionTitle";
import { MEMBERS } from "./MEMBERS";
import MemberPill from "./MemberPill";

// MemberCarouselカラーテーマ
const MEMBER_COLOR_THEME = [
  "#D6423B", // Red
  "#657C60", // Green
  "#2C3E50", // Dark Blue
  "#5B3A2E", // Brown
  "#8C6A1F", // Gold
] as const;

const pickMemberColor = (index: number) => {
  return MEMBER_COLOR_THEME[index % MEMBER_COLOR_THEME.length];
};

// Carousel constants
const CAROUSEL_CONFIG = {
  MEMBER_PILL_WIDTH: 156,
  GAP_MOBILE: 12,
  GAP_DESKTOP: 16,
} as const;

// Calculate total width: MemberPill width + gap * number of members
const totalWidth =
  (CAROUSEL_CONFIG.MEMBER_PILL_WIDTH + CAROUSEL_CONFIG.GAP_MOBILE) *
  MEMBERS.length;

const SPIN_DISTANCE = -totalWidth * 3;

export default function MemberCarousel() {
  const [isInitialAnimating, setIsInitialAnimating] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const x = useMotionValue(SPIN_DISTANCE);

  // Embla Carousel設定（初期アニメーション後に有効化）
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      align: "start",
    },
    [
      AutoScroll({
        speed: 0.5, // ゆっくりスクロール
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        playOnInit: false, // 初期アニメーション後に手動開始
      }),
    ]
  );

  // 初期アニメーション
  useEffect(() => {
    setIsReady(true);

    const controls = animate(x, 0, {
      duration: 2.5,
      ease: [0.15, 0.8, 0.2, 1],
      onComplete: () => {
        setIsInitialAnimating(false);
      },
    });

    return () => controls.stop();
  }, [x]);

  // Emblaのauto-scrollを初期アニメーション完了後に開始
  useEffect(() => {
    if (!isInitialAnimating && emblaApi) {
      const autoScroll = emblaApi.plugins()?.autoScroll;
      if (autoScroll) {
        autoScroll.play();
      }
    }
  }, [isInitialAnimating, emblaApi]);

  // 初期アニメーション中のレンダリング
  if (isInitialAnimating) {
    return (
      <section className="py-12 md:py-20">
        <SectionTitle className="mb-8 md:mb-16">Member</SectionTitle>
        <div className="relative overflow-hidden">
          <motion.div
            className={cn(
              "flex gap-3 md:gap-4",
              "pb-4",
              "cursor-default select-none",
              !isReady && "invisible"
            )}
            style={{ x }}
          >
            {/* 初期アニメーション用に配列を複製 */}
            {[...MEMBERS, ...MEMBERS].map((member, i) => (
              <div key={`${member.id}-${i}`} className="shrink-0">
                <MemberPill
                  name={member.name}
                  role={member.role}
                  color={pickMemberColor(i)}
                  profileImage={member.profileImage}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  // 自動スクロールカルーセル（初期アニメーション後）
  return (
    <section className="py-12 md:py-20">
      <SectionTitle className="mb-8 md:mb-16">Member</SectionTitle>
      <div className="overflow-hidden" ref={emblaRef}>
        <div
          className={cn(
            "flex",
            "pb-4",
            "cursor-grab active:cursor-grabbing select-none"
          )}
        >
          {MEMBERS.map((member, i) => (
            <div key={member.id} className="shrink-0 mr-3 md:mr-4">
              <MemberPill
                name={member.name}
                role={member.role}
                color={pickMemberColor(i)}
                profileImage={member.profileImage}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
