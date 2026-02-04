import HeroSection from "./_components/HeroSection";
import ArchDecoration from "./_components/HeroSection/VideoArea/ArchDecoration";
import PickUpSection from "./_components/PIckUpSection";
import ScrollReset from "./_components/ScrollReset";
import WhatUpSection from "./_components/WhatUpSection";

export default function Page() {
  // debug: Netlifyのpnpm check確認用 - 確認後削除
  const unusedVariable = "this will fail pnpm check";

  return (
    <div className="min-h-screen">
      <ScrollReset />
      <ArchDecoration />
      <HeroSection />
      <PickUpSection />
      <WhatUpSection />
    </div>
  );
}
