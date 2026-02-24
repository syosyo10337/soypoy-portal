import {
  Bricolage_Grotesque,
  Noto_Sans_JP,
  Shippori_Mincho,
  Zen_Old_Mincho,
} from "next/font/google";
import localFont from "next/font/local";

export const anymale = localFont({
  src: "./anymale/AnyMale.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-anymale",
  display: "swap",
});

export const bernardMT = localFont({
  src: "./bernard/BernardMTCondensed.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-bernard-mt",
  display: "swap",
});

export const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const zenOldMincho = Zen_Old_Mincho({
  variable: "--font-zen-old-mincho",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

export const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});
