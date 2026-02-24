"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function VideoPlayer() {
  const isMobile = useMediaQuery("(max-width: 639px)");

  if (isMobile === null) {
    return <div className="w-full h-full" />;
  }

  const src = isMobile ? "/videos/hero_sp.webm" : "/videos/hero.webm";

  return (
    <div className="w-full h-full">
      <video
        key={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
        aria-label="soy-poy promotional background video"
      >
        <source src={src} type="video/webm" />
      </video>
    </div>
  );
}
