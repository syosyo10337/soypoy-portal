export const PublicationStatus = {
  Draft: "draft",
  Published: "published",
  Archived: "archived",
} as const satisfies Record<string, string>;

export type PublicationStatus =
  (typeof PublicationStatus)[keyof typeof PublicationStatus];

/**
 * 有効な状態遷移を定義
 *
 * - Draft → Published: 公開
 * - Published → Draft: 非公開（取り下げ）
 * - Published → Archived: アーカイブ
 * - Archived → Draft: 復活
 */
const validTransitions: Record<PublicationStatus, PublicationStatus[]> = {
  [PublicationStatus.Draft]: [PublicationStatus.Published],
  [PublicationStatus.Published]: [
    PublicationStatus.Draft,
    PublicationStatus.Archived,
  ],
  [PublicationStatus.Archived]: [PublicationStatus.Draft],
};

/**
 * 状態遷移が有効かどうかを検証
 */
export function canTransition(
  from: PublicationStatus,
  to: PublicationStatus,
): boolean {
  return validTransitions[from]?.includes(to) ?? false;
}

/**
 * 公開可能かどうかを検証
 */
export function canPublish(status: PublicationStatus): boolean {
  return canTransition(status, PublicationStatus.Published);
}

/**
 * 非公開（下書きに戻す）可能かどうかを検証
 */
export function canUnpublish(status: PublicationStatus): boolean {
  return canTransition(status, PublicationStatus.Draft);
}
