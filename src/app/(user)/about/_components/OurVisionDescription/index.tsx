import { Br } from "@/components/Br";
import { cn } from "@/utils/cn";
import SectionTitle from "../SectionTitle";

export default function OurVisionDescription() {
  return (
    <section className="flex flex-col items-center text-center px-6 md:px-12 py-12 md:py-20">
      <SectionTitle>About</SectionTitle>
      <h2
        className={cn(
          "font-shippori-mincho font-bold",
          "text-4xl md:text-5xl",
          "leading-tight md:leading-[52px]",
          "tracking-tight",
          "text-black",
          "mt-8 md:mt-16",
          "[-webkit-text-stroke:_1.5px_black]",
        )}
      >
        <p className="md:hidden flex flex-col items-start pl-8">
          <span>好きに生きて、</span>
          <span>一緒に生きる</span>
        </p>
        <p className="hidden md:inline">好きに生きて、一緒に生きる</p>
      </h2>

      <p
        className={cn(
          "font-display font-semibold",
          "text-sm md:text-[22px]",
          "leading-relaxed md:leading-11",
          "text-black",
          "mt-8 md:mt-12",
        )}
      >
        SOY-POY（ソイポイ）は、
        <Br sp md lg />
        「好きに生きて、一緒に生きる」を
        <Br sp md />
        コンセプトに生まれた、
        <Br sp md lg />
        バーとステージのある週末限定の
        <Br sp />
        パブリックハウス（PUB）です。
        <Br sp md lg />
        拠点は下北沢。
        <Br sp md lg />
        ジャンルを問わず、
        <Br sp md />
        さまざまな表現や創作を志す人たちが集い、
        <Br sp md lg />
        交流しながら、
        <Br sp />
        誰もが自由に表現や創作活動を楽しめる
        <Br sp md lg />
        オープンなコミュニティづくりを
        <Br sp md />
        行っています。
      </p>
    </section>
  );
}
