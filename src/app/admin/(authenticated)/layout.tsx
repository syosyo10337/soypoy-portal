import { Authenticated } from "@refinedev/core";
import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminLoading from "../loading";

export const metadata: Metadata = {
  title: {
    default: "SOY-POY 管理画面",
    template: "%s | SOY-POY 管理画面",
  },
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedAdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <Authenticated key="authenticated-admin-layout" loading={<AdminLoading />}>
      <div className="min-h-screen">
        <AdminSidebar />
        <main className="p-16">{children}</main>
      </div>
    </Authenticated>
  );
}
