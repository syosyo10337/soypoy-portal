# Phase 2: Service 層

## 現状

### ClosedDayService (`src/services/closedDayService.ts`)

```typescript
export class ClosedDayService {
  constructor(private repository: ClosedDayRepository) {}

  async getClosedDaysByMonth(year: number, month: number): Promise<ClosedDayEntity[]> {
    return await this.repository.listByMonth(year, month);
  }
}
```

- 読み取りのみのシンプルなサービス
- `ClosedDayRepository` のみに依存

### Composition Root (`src/services/index.ts`)

```typescript
export const closedDayService = new ClosedDayService(
  new DrizzleClosedDayRepository(),
);
```

---

## 変更内容

### 1. エラークラスの定義

**新規ファイル:** `src/services/errors/closedDayConflictError.ts`

```typescript
export class ClosedDayConflictError extends Error {
  constructor(conflictingDates: string[]) {
    const dates = conflictingDates.join(", ");
    super(
      `イベントが登録されている日付は休業日に設定できません: ${dates}`,
    );
    this.name = "ClosedDayConflictError";
  }
}
```

tRPC ルーター（Phase 3）で catch して `TRPCError` に変換する。

#### エラークラスの配置方針

本プロジェクトでは、ビジネスルール違反のエラーを以下の基準で配置する:

| 配置先 | 基準 | 例 |
|---|---|---|
| `src/domain/errors/` | 単一集約内の不変条件違反 | タイトル空文字、日付不正など |
| `src/services/errors/` | 複数集約間の制約違反 | イベント日と休業日の重複 |

`ClosedDayConflictError` は ClosedDay と Event という **2つの独立した集約をまたぐ制約** のため `services/errors/` に配置する。ClosedDay エンティティ自身は Event の存在を知らず、この制約は Service 層が2つの Repository を問い合わせて初めて検知できる。

### 2. コンストラクタの変更

イベント重複チェックのため `EventRepository` への依存を追加:

```typescript
export class ClosedDayService {
  constructor(
    private repository: ClosedDayRepository,
    private eventRepository: EventRepository,  // 追加
  ) {}
```

**Clean Architecture の依存ルール:** `ClosedDayService`（Service 層）→ `EventRepository`（Domain 層インターフェース）への依存。Domain 層のインターフェースなので違反しない。

### 3. `syncMonth` メソッドの追加

```typescript
async syncMonth(
  year: number,
  month: number,
  dates: string[],
): Promise<ClosedDayEntity[]> {
  // 1. イベント重複チェック
  const events = await this.eventRepository.listByMonth(year, month);
  const eventDates = events.map((e) => e.date.split("T")[0]);
  const conflicts = dates.filter((d) => eventDates.includes(d));

  if (conflicts.length > 0) {
    throw new ClosedDayConflictError(conflicts);
  }

  // 2. 該当月の既存休業日を削除
  await this.repository.deleteByMonth(year, month);

  // 3. 新しい休業日を作成
  if (dates.length === 0) return [];

  const newClosedDays: ClosedDayEntity[] = dates.map((date) => ({
    id: nanoid(),
    date,
  }));

  return await this.repository.createMany(newClosedDays);
}
```

#### 処理フロー

```text
syncMonth(2026, 2, ["2026-02-07", "2026-02-14"])
  │
  ├─ 1. eventRepository.listByMonth(2026, 2)
  │     → イベント日: ["2026-02-21", "2026-02-28"]
  │     → conflicts = [] （重複なし）
  │
  ├─ 2. repository.deleteByMonth(2026, 2)
  │     → 2月の既存休業日を全削除
  │
  └─ 3. repository.createMany([
           { id: "abc123", date: "2026-02-07" },
           { id: "def456", date: "2026-02-14" },
         ])
         → 新しい休業日を作成して返却
```

#### エラー時のフロー

```text
syncMonth(2026, 2, ["2026-02-07", "2026-02-21"])
  │
  ├─ 1. eventRepository.listByMonth(2026, 2)
  │     → イベント日: ["2026-02-21", "2026-02-28"]
  │     → conflicts = ["2026-02-21"] （重複あり!）
  │
  └─ throw ClosedDayConflictError(["2026-02-21"])
     → 削除も作成も行わない（データ変更なし）
```

重複チェックは削除の**前**に行うため、エラー時は既存データに影響しない。

### 4. Composition Root の更新

**ファイル:** `src/services/index.ts`

```diff
+import { DrizzleEventRepository } from "@/infrastructure/db/repositories/drizzleEventRepository";

 export const closedDayService = new ClosedDayService(
   new DrizzleClosedDayRepository(),
+  new DrizzleEventRepository(),
 );
```

`DrizzleEventRepository` は `eventService` の初期化でも使われているが、別インスタンスで問題ない（状態を持たないリポジトリクラス）。

---

## 完了条件

### 自動チェック

- [ ] `pnpm check` が通る（tsc + lint + format）

### 手動確認

- [ ] dev サーバー（`pnpm dev`）が起動できる（Composition Root の import エラーがないこと）
- [ ] 既存の events ページ（`/events`）が正常に表示される（既存機能のリグレッションなし）

**Note:** `syncMonth` のビジネスロジック（正常系・エラー系）の動作確認は、tRPC エンドポイントが完成する Phase 3 完了時にまとめて行う。

---

## 変更ファイル一覧

| ファイル | 変更種別 |
| --- | --- |
| `src/services/errors/closedDayConflictError.ts` | 新規（エラークラス） |
| `src/services/closedDayService.ts` | 修正（`syncMonth` 追加） |
| `src/services/index.ts` | 修正（コンストラクタ引数追加） |
