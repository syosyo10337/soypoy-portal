"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { MEMBER_COLOR_THEME } from "@/utils/colors";
import SectionTitle from "../SectionTitle";
import type { Member } from "./MEMBERS";
import { MEMBERS } from "./MEMBERS";
import MemberPill from "./MemberPill";

const ANCHOR_ID = "member" as const;

const pickMemberColor = (index: number) => {
  return MEMBER_COLOR_THEME[index % MEMBER_COLOR_THEME.length];
};

// Carousel constants
const CAROUSEL_CONFIG = {
  MEMBER_PILL_WIDTH: 156,
  GAP: 12, // gap-3 = 12px
} as const;

const SLIDE_WIDTH =
  CAROUSEL_CONFIG.MEMBER_PILL_WIDTH + CAROUSEL_CONFIG.GAP;

// Calculate total width: MemberPill width + gap * number of members
const totalWidth = SLIDE_WIDTH * MEMBERS.length;

const SPIN_DISTANCE = -totalWidth * 3;

/**
 * 4Kなどの広い画面でもカルーセルがループできるよう、
 * ビューポート幅の2倍を超えるまでMEMBERSを複製する
 */
function useRepeatedMembers() {
  const [copies, setCopies] = useState(1);

  useEffect(() => {
    const needed = Math.ceil((window.innerWidth * 2) / totalWidth);
    setCopies(Math.max(1, needed));
  }, []);

  return useMemo(() => {
    const repeated: (Member & { key: string; colorIndex: number })[] = [];
    for (let c = 0; c < copies; c++) {
      for (let i = 0; i < MEMBERS.length; i++) {
        repeated.push({
          ...MEMBERS[i],
          key: `${MEMBERS[i].id}-${c}`,
          colorIndex: c * MEMBERS.length + i,
        });
      }
    }
    return repeated;
  }, [copies]);
}

export default function MemberCarousel() {
  const [isInitialAnimating, setIsInitialAnimating] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const x = useMotionValue(SPIN_DISTANCE);
  const prefersReducedMotion = useReducedMotion();
  const repeatedMembers = useRepeatedMembers();

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
    ],
  );

  // 初期アニメーション
  useEffect(() => {
    setIsReady(true);

    // prefers-reduced-motion の場合はアニメーションをスキップ
    if (prefersReducedMotion) {
      x.set(0);
      setIsInitialAnimating(false);
      return;
    }

    const controls = animate(x, 0, {
      duration: 2.5,
      ease: [0.15, 0.8, 0.2, 1],
      onComplete: () => {
        setIsInitialAnimating(false);
      },
    });

    return () => controls.stop();
  }, [x, prefersReducedMotion]);

  // Emblaのauto-scrollを初期アニメーション完了後に開始
  // prefers-reduced-motion の場合は自動スクロールを開始しない
  useEffect(() => {
    if (!isInitialAnimating && emblaApi && !prefersReducedMotion) {
      const autoScroll = emblaApi.plugins()?.autoScroll;
      if (autoScroll) {
        autoScroll.play();
      }
    }
  }, [isInitialAnimating, emblaApi, prefersReducedMotion]);

  // 初期アニメーション中のレンダリング
  if (isInitialAnimating) {
    return (
      <section id={ANCHOR_ID} className="py-12 md:py-20">
        <SectionTitle className="mb-8 md:mb-16">Member</SectionTitle>
        <div className="relative overflow-hidden -my-4">
          <motion.div
            className={cn(
              "flex gap-3 md:gap-4",
              "py-4",
              "cursor-default select-none",
              !isReady && "invisible",
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
    <section
      id={ANCHOR_ID}
      className="py-12 md:py-20"
      aria-label="メンバー一覧カルーセル"
    >
      <SectionTitle className="mb-8 md:mb-16">Member</SectionTitle>
      <div className="overflow-hidden -my-4" ref={emblaRef}>
        <div
          className={cn(
            "flex",
            "py-4",
            "cursor-grab active:cursor-grabbing select-none",
            "[touch-action:pan-y_pinch-zoom]",
            "backface-hidden",
          )}
        >
          {repeatedMembers.map((member) => (
            <div key={member.key} className="shrink-0 mr-3 md:mr-4">
              <MemberPill
                name={member.name}
                role={member.role}
                color={pickMemberColor(member.colorIndex)}
                profileImage={member.profileImage}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
