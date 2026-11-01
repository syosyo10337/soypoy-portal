import type { Preview } from "@storybook/nextjs-vite";
import "@/assets/styles/globals.css";
import {
  anymale,
  bernardMT,
  bricolageGrotesque,
  notoSansJP,
  shipporiMincho,
  zenOldMincho,
} from "@/assets/fonts";

// src/app/layout.tsx の <html> と <body> に合わせる
// Dialog などのポータルにも効くよう、decorator の要素ではなくドキュメントに付与する
document.documentElement.classList.add(
  bricolageGrotesque.variable,
  notoSansJP.variable,
  anymale.variable,
  bernardMT.variable,
  zenOldMincho.variable,
  shipporiMincho.variable,
);
document.body.classList.add(
  "antialiased",
  "font-noto-sans-jp",
  "bg-soypoy-main",
);

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
