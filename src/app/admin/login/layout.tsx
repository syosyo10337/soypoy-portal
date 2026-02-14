import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "ログイン | SOY-POY 管理画面",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
