export class ClosedDayConflictError extends Error {
  constructor(conflictingDates: string[]) {
    const dates = conflictingDates.join(", ");
    super(`イベントが登録されている日付は休業日に設定できません: ${dates}`);
    this.name = "ClosedDayConflictError";
  }
}
