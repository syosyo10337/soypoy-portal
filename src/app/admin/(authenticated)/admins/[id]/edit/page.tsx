import type { Metadata } from "next";
import { AdminEditForm } from "./_components/AdminEditForm";

export const metadata: Metadata = {
  title: "管理者編集",
};

export default function AdminEditPage() {
  return <AdminEditForm />;
}
