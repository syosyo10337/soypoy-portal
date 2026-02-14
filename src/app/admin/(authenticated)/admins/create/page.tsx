import type { Metadata } from "next";
import { CreateAdminForm } from "./_components/CreateAdminForm";

export const metadata: Metadata = {
  title: "管理者作成",
};

export default function AdminCreatePage() {
  return <CreateAdminForm />;
}
