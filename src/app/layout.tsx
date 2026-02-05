import type { Metadata } from "next";
import "@/assets/styles/globals.css";
import {
  anymale,
  bernardMT,
  bricolageGrotesque,
  notoSansJP,
  shipporiMincho,
  zenOldMincho,
} from "@/assets/fonts";
import { cn } from "@/utils/cn";

// metadataBase用のURL取得（環境に応じて自動切替）
const baseUrl =
  process.env.URL || // Netlify本番
  process.env.DEPLOY_PRIME_URL || // Netlifyプレビュー
  "http://localhost:3000"; // ローカル開発

export const metadata: Metadata = {
  title: "SOY-POY | 表現と創作を楽しむパブリックハウス",
  description:
    "「好きに生きて、一緒に生きる」をコンセプトに、週末限定のパブリックハウスSOY-POYでは、オープンマイク、コンサート、即興コメディワークショップなどのイベントを開催。",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "SOY-POY",
  },
  twitter: {
    card: "summary_large_image",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="ja"
      className={cn(
        bricolageGrotesque.variable,
        notoSansJP.variable,
        anymale.variable,
        bernardMT.variable,
        zenOldMincho.variable,
        shipporiMincho.variable,
      )}
    >
      <body
        className={
          "antialiased min-h-screen flex flex-col relative font-noto-sans-jp bg-soypoy-main"
        }
      >
        {children}
      </body>
    </html>
  );
}
