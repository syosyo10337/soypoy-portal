import type { Metadata } from "next";
import HistorySlider from "./_components/HistorySlider";
import MemberCarousel from "./_components/MemberCarousel";
import OurVisionDescription from "./_components/OurVisionDescription";

export const metadata: Metadata = {
  title: "SOY-POYについて",
  description: "SOY-POYのビジョン、メンバー、歴史についてご紹介します。",
};

export default function AboutPage() {
  return (
    <div>
      <OurVisionDescription />
      <MemberCarousel />
      <HistorySlider />
    </div>
  );
}
