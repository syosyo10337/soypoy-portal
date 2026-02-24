import { cn } from "@/utils/cn";
import BottomContent from "./BottomContent";
import MainContent from "./MainContent";
import { ContactSection } from "./MainContent/ContactSection";

export default function Footer() {
  return (
    // NOTE: z-10を追加して、流れるFudaFilmRollBgよりも上に配置する。
    <footer
      className={cn(
        "relative bg-soypoy-secondary text-white text-center z-20",
        "p-10 sm:p-16 md:p-12 xl:px-10 2xl:px-38",
      )}
    >
      <h1 className="text-2xl xl:text-3xl font-bold font-anymale mb-8">
        Information
      </h1>
      <MainContent />
      <ContactSection />
      <BottomContent />
    </footer>
  );
}
