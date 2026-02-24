import { Suspense } from "react";
import HeroSection from "./_components/HeroSection";
import ArchDecoration from "./_components/HeroSection/VideoArea/ArchDecoration";
import PickUpSection from "./_components/PickUpSection";
import { PickUpSkeleton } from "./_components/PickUpSection/PickUpSkeleton";
import ScrollReset from "./_components/ScrollReset";
import WhatUpSection from "./_components/WhatUpSection";

export default function Page() {
  return (
    <div className="min-h-screen">
      <ScrollReset />
      <ArchDecoration />
      <HeroSection />
      <Suspense fallback={<PickUpSkeleton />}>
        <PickUpSection />
      </Suspense>
      <WhatUpSection />
    </div>
  );
}
