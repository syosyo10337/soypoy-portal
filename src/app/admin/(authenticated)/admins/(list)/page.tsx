import type { Metadata } from "next";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";
import { AdminsContent } from "./_components/AdminsContent";

export const metadata: Metadata = {
  title: "管理者一覧",
};

export default function AdminsListPage() {
  return (
    <ListView>
      <ListViewHeader />
      <AdminsContent />
    </ListView>
  );
}
