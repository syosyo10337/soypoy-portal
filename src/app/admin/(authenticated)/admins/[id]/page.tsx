import type { Metadata } from "next";
import { AdminDetailContent } from "./_components/AdminDetailContent";

export const metadata: Metadata = {
  title: "管理者詳細",
};

export default function AdminShowPage() {
  return <AdminDetailContent />;
}
