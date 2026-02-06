"use client";

import { trpc } from "@/infrastructure/trpc/client";

/**
 * 管理画面用のカスタムtRPC mutationフック
 *
 * Refineの標準的なdataProviderでカバーできない特殊な操作用
 * React Queryベースのため、キャッシュ管理・エラーハンドリングが自動化される
 */

/**
 * パスワード変更用フック
 *
 * @example
 * const changePassword = useChangePassword();
 *
 * changePassword.mutate(
 *   { currentPassword: "old", newPassword: "new" },
 *   {
 *     onSuccess: () => toast.success("変更しました"),
 *     onError: (err) => toast.error(err.message),
 *   }
 * );
 */
export function useChangePassword() {
  return trpc.auth.changePassword.useMutation();
}

/**
 * パスワードリセット用フック (Super Admin専用)
 *
 * @example
 * const resetPassword = useResetPassword();
 *
 * resetPassword.mutate(
 *   { userId: "user-id" },
 *   {
 *     onSuccess: (data) => console.log("New password:", data.newPassword),
 *   }
 * );
 */
export function useResetPassword() {
  return trpc.admins.resetPassword.useMutation();
}
