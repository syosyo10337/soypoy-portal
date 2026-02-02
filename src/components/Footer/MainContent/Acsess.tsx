import { cn } from "@/utils/cn";

export function Acsess({ className }: { className: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        "md:flex-row md:justify-between",
        className,
      )}
    >
      <div className="text-left">
        <h2 className="text-2xl xl:text-3xl font-bold">Access</h2>
        <div className="text-base xl:text-lg">
          <p>〒155-0031</p>
          <p>東京都世田谷区北沢2丁目30-14</p>
          <p>重宗ビル 3F</p>
          <p className="text-sm xl:text-base mt-2">＜最寄り駅＞</p>
          <p>下北沢駅から 東口から徒歩1分</p>
        </div>
      </div>
      <div className="my-2 md:my-0 w-full md:w-[52%] h-[300px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.573630504101!2d139.6650984771045!3d35.6628750725932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6018f3a985c43219%3A0xef11c14b0d78af2f!2sSOY-POY!5e0!3m2!1sen!2sjp!4v1759246272351!5m2!1sen!2sjp"
          title="Google Map"
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
