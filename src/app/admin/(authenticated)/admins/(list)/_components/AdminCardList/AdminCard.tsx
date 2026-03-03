import { AdminRoleBadge } from "@/components/admin/AdminRoleBadge";
import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";
import type { AdminUserEntity } from "@/domain/entities";
import { AdminActions } from "../AdminsTable/AdminActions";

interface AdminCardProps {
  admin: AdminUserEntity;
}

/**
 * 管理者SPカード
 */
export function AdminCard({ admin }: AdminCardProps) {
  const initials = admin.name.slice(0, 2);

  return (
    <div className="rounded-md border p-3">
      {/* 上段: アバター + 名前 + ロール */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{admin.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {admin.email}
          </span>
        </div>
        <AdminRoleBadge variant={admin.role} className="shrink-0" />
      </div>
      {/* 下段: アクション */}
      <div className="mt-2 flex justify-end">
        <AdminActions adminId={admin.id} />
      </div>
    </div>
  );
}
