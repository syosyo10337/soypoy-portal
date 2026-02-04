export const PublicationStatus = {
  Draft: "draft",
  Published: "published",
  Archived: "archived",
} as const satisfies Record<string, string>;

export type PublicationStatus =
  (typeof PublicationStatus)[keyof typeof PublicationStatus];
