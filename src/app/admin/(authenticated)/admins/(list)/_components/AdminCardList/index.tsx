import type { AdminUserEntity } from "@/domain/entities";
import { AdminCard } from "./AdminCard";

interface AdminCardListProps {
  admins: AdminUserEntity[];
}

/**
 * 管理者SPカード一覧
 */
export function AdminCardList({ admins }: AdminCardListProps) {
  if (admins.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        管理者がいません
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {admins.map((admin) => (
        <AdminCard key={admin.id} admin={admin} />
      ))}
    </div>
  );
}
