import { cn } from "@/utils/cn";
import {
  IllustrationBar,
  IllustrationLighter,
  IllustrationRecord,
} from "./Illustration";
import WhatUpButton from "./WhatUpButton";
import { WhatUpLine } from "./WhatUpLine";

export default function WhatUpSection() {
  return (
    <section
      className={cn(
        "w-full mx-auto z-30",
        "max-w-[73vw] md:max-w-140 xl:max-w-[80vw] 2xl:max-w-[70vw]", //NOTE: md~xlはタブレット表示なので横幅固定
        "py-8 md:py-12 lg:py-16",
      )}
    >
      <WhatUpLine />
      <p className="text-soypoy-secondary font-bold md:text-lg">
        ソイポイから生まれたアートワークやラジオ、Youtubeをチェック！
      </p>
      {/* sp/tab用のレイアウト */}
      <div className="xl:hidden">
        <div className="grid grid-cols-1 grid-flow-col grid-rows-3 gap-1">
          <WhatUpButton
            prefix="Shop"
            title="Artworks"
            href="/whats-up?type=artworks"
          />
          <IllustrationRecord className="row-span-2" />
        </div>

        <WhatUpLine showWord={false} className="my-1" />

        <div className="grid grid-cols-1 grid-flow-col grid-rows-3 gap-1">
          <IllustrationBar className="row-span-2" />
          <WhatUpButton
            prefix="Marebito"
            title="Radio"
            href="/whats-up?type=radio"
          />
        </div>

        <WhatUpLine showWord={false} className="my-1" />

        <div className="grid grid-cols-1 grid-flow-col grid-rows-3 gap-1">
          <WhatUpButton
            prefix="Youtube"
            title="Channel"
            href="/whats-up?type=channel"
          />
          <IllustrationLighter className="row-span-2" />
        </div>
      </div>

      {/* pc用のレイアウト */}
      <div className="hidden xl:grid grid-flow-col grid-cols-3 grid-rows-3 gap-1">
        <WhatUpButton
          prefix="Shop"
          title="Artworks"
          href="/whats-up?type=artworks"
        />
        <IllustrationRecord className="row-span-2" />
        <IllustrationBar className="row-span-2" />
        <WhatUpButton
          prefix="Marebito"
          title="Radio"
          href="/whats-up?type=radio"
        />
        <WhatUpButton
          prefix="Youtube"
          title="Channel"
          href="/whats-up?type=channel"
        />
        <IllustrationLighter className="row-span-2" />
      </div>

      <WhatUpLine direction="reverse" />
    </section>
  );
}
