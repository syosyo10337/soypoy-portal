import { useDelete, useGetIdentity } from "@refinedev/core";
import { Check, Copy, KeyRound, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useResetPassword } from "@/app/admin/_hooks/useTrpcMutations";
import { AdminRoleBadge } from "@/components/admin/AdminRoleBadge";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { type AdminUserEntity, AdminUserRole } from "@/domain/entities";
import { formatDateTimeJP } from "@/utils/date";

interface AdminDetailCardProps {
  admin: AdminUserEntity;
}

export function AdminDetailCard({ admin }: AdminDetailCardProps) {
  const router = useRouter();
  const { data: identity } = useGetIdentity<{
    id: string;
    role: AdminUserRole;
  }>();
  const { mutate: deleteAdmin } = useDelete();
  const resetPassword = useResetPassword();

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isSuperAdmin = identity?.role === AdminUserRole.SuperAdmin;
  const isSelf = identity?.id === admin.id;

  const handleResetPassword = () => {
    resetPassword.mutate(
      { userId: admin.id },
      {
        onSuccess: (data) => {
          setTempPassword(data.tempPassword);
        },
        onError: (error) => {
          console.error("Password reset failed:", error);
          alert("パスワードのリセットに失敗しました");
        },
      },
    );
  };

  const handleCopyPassword = async () => {
    if (tempPassword) {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = () => {
    deleteAdmin(
      { resource: "admins", id: admin.id },
      {
        onSuccess: () => {
          router.push("/admin/admins");
        },
      },
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{admin.name}</CardTitle>
              <CardDescription>{admin.email}</CardDescription>
            </div>
            <AdminRoleBadge variant={admin.role} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">作成日時</p>
              <p className="font-medium">{formatDateTimeJP(admin.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">更新日時</p>
              <p className="font-medium">{formatDateTimeJP(admin.updatedAt)}</p>
            </div>
          </div>

          {isSuperAdmin && (
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setIsResetDialogOpen(true)}
                disabled={isSelf}
              >
                <KeyRound className="h-4 w-4 mr-2" />
                パスワードをリセット
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isSelf}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                削除
              </Button>
            </div>
          )}

          {isSelf && isSuperAdmin && (
            <p className="text-sm text-muted-foreground">
              ※ 自分自身のパスワードリセット・削除はできません
            </p>
          )}
        </CardContent>
      </Card>

      <PasswordResetDialog />
      <DeleteDialog />
    </>
  );

  function PasswordResetDialog() {
    return (
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>パスワードをリセット</DialogTitle>
            <DialogDescription>
              {admin.name} のパスワードをリセットしますか？
            </DialogDescription>
          </DialogHeader>

          {tempPassword ? (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  一時パスワード
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-mono font-bold flex-1">
                    {tempPassword}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyPassword}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-destructive">
                ⚠️
                このパスワードは一度しか表示されません。必ずユーザーに伝えてください。
              </p>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setIsResetDialogOpen(false);
                    setTempPassword(null);
                  }}
                >
                  閉じる
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResetDialogOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={resetPassword.isPending}
              >
                {resetPassword.isPending ? "リセット中..." : "リセット"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  function DeleteDialog() {
    return (
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>管理者を削除</DialogTitle>
            <DialogDescription>
              {admin.name} を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
