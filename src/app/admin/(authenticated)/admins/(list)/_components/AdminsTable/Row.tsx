import { AdminRoleBadge } from "@/components/admin/AdminRoleBadge";
import { TableCell, TableRow } from "@/components/shadcn/table";
import type { AdminUserEntity } from "@/domain/entities";
import { formatDateJP } from "@/utils/date";
import { AdminActions } from "./AdminActions";

interface AdminTableRowProps {
  admin: AdminUserEntity;
}

export function AdminTableRow({ admin }: AdminTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{admin.name}</TableCell>
      <TableCell>{admin.email}</TableCell>
      <TableCell>
        <AdminRoleBadge variant={admin.role} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatDateJP(admin.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <AdminActions adminId={admin.id} />
      </TableCell>
    </TableRow>
  );
}
