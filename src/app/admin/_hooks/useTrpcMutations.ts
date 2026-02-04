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

/**
 * イベント公開用フック
 *
 * @example
 * const publishEvent = usePublishEvent();
 *
 * publishEvent.mutate(eventId, {
 *   onSuccess: () => toast.success("公開しました"),
 *   onError: (err) => toast.error(err.message),
 * });
 */
export function usePublishEvent() {
  return trpc.events.publish.useMutation();
}

/**
 * イベント非公開用フック
 *
 * @example
 * const unpublishEvent = useUnpublishEvent();
 *
 * unpublishEvent.mutate(eventId, {
 *   onSuccess: () => toast.success("非公開にしました"),
 *   onError: (err) => toast.error(err.message),
 * });
 */
export function useUnpublishEvent() {
  return trpc.events.unpublish.useMutation();
}
