export const DayType = {
  Sunday: "sunday",
  Saturday: "saturday",
  Other: "other",
} as const satisfies Record<string, string>;

export type DayType = (typeof DayType)[keyof typeof DayType];

export const DayStatus = {
  WeekDay: "weekday",
  Event: "event",
  Closed: "closed",
  Open: "open",
} as const satisfies Record<string, string>;

export type DayStatus = (typeof DayStatus)[keyof typeof DayStatus];
