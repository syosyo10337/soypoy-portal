# Phase 1: DB / Repository 層

## 現状

### スキーマ (`src/infrastructure/db/schema.ts`)

```typescript
export const closedDays = pgTable("closed_days", {
  id: text().primaryKey(),
  date: timestamp({ mode: "date", withTimezone: true }).notNull(),
});
```

- `date` に UNIQUE 制約がない → 同一日付の重複登録が可能な状態

### Repository インターフェース (`src/domain/repositories/closedDayRepository.ts`)

```typescript
export interface ClosedDayRepository {
  listByMonth(year: number, month: number): Promise<ClosedDayEntity[]>;
}
```

- 読み取りのみ。書き込み系メソッドなし

### Drizzle 実装 (`src/infrastructure/db/repositories/drizzleClosedDayRepository.ts`)

- `listByMonth` のみ実装
- `EXTRACT(YEAR/MONTH)` パターンで月指定クエリ
- `toDomainEntity` で `DrizzleClosedDay` → `ClosedDayEntity` 変換
- 日付変換: `dateToIsoFull()` で Date → ISO文字列

### Entity (`src/domain/entities/closedDay/index.ts`)

```typescript
export interface ClosedDayEntity {
  id: string;
  date: string;  // YYYY-MM-DD形式
}
```

変更なし。

---

## 変更内容

### 1. スキーマ変更

**ファイル:** `src/infrastructure/db/schema.ts`

```diff
 export const closedDays = pgTable("closed_days", {
   id: text().primaryKey(),
-  date: timestamp({ mode: "date", withTimezone: true }).notNull(),
+  date: timestamp({ mode: "date", withTimezone: true }).notNull().unique(),
 });
```

`.unique()` を追加。同一日付の重複登録を DB レベルで防止する。

**マイグレーション手順:**

```bash
pnpm drzl:gen     # マイグレーションファイル生成
pnpm drzl:migrate # 適用
```

生成される SQL（想定）:

```sql
ALTER TABLE "closed_days" ADD CONSTRAINT "closed_days_date_unique" UNIQUE("date");
```

### 2. Repository インターフェース追加

**ファイル:** `src/domain/repositories/closedDayRepository.ts`

```typescript
export interface ClosedDayRepository {
  // 既存
  listByMonth(year: number, month: number): Promise<ClosedDayEntity[]>;

  // 追加
  deleteByMonth(year: number, month: number): Promise<void>;
  createMany(closedDays: ClosedDayEntity[]): Promise<ClosedDayEntity[]>;
}
```

| メソッド | 目的 | syncMonth での役割 |
| --- | --- | --- |
| `deleteByMonth` | 指定月の休業日を全削除 | 前半: 既存データをクリア |
| `createMany` | 複数の休業日を一括作成 | 後半: 新しいデータを挿入 |

#### なぜ `syncMonth` をリポジトリに置かないか

`syncMonth` は「削除 → イベント重複チェック → 作成」のオーケストレーション。イベント重複チェックはビジネスロジックなので Service 層の責務。リポジトリは純粋なデータアクセスに限定する。

### 3. Drizzle 実装の追加

**ファイル:** `src/infrastructure/db/repositories/drizzleClosedDayRepository.ts`

#### `deleteByMonth`

既存の `listByMonth` と同じ `EXTRACT` パターンで DELETE:

```typescript
async deleteByMonth(year: number, month: number): Promise<void> {
  await db
    .delete(closedDays)
    .where(
      and(
        sql`EXTRACT(YEAR FROM ${closedDays.date}) = ${year}`,
        sql`EXTRACT(MONTH FROM ${closedDays.date}) = ${month}`,
      ),
    );
}
```

#### `createMany`

Drizzle の `insert().values()` でバルクインサート:

```typescript
async createMany(entities: ClosedDayEntity[]): Promise<ClosedDayEntity[]> {
  if (entities.length === 0) return [];

  const insertData: DrizzleClosedDayInsert[] = entities.map((entity) => ({
    id: entity.id,
    date: dateTimeFromISO(entity.date).toJSDate(),
  }));

  await db.insert(closedDays).values(insertData);
  return entities;
}
```

**日付変換:** Entity の `date`（`YYYY-MM-DD` 文字列）→ `dateTimeFromISO()` で Luxon DateTime → `toJSDate()` で JS Date → DB の `timestamp with timezone`。
`DrizzleEventRepository.create()` と同じパターン。

---

## トランザクションについて

`syncMonth` の delete → insert はトランザクションで囲むべきか検討した結果、**トランザクションなし（順次実行）** とする。

### 判断根拠

途中失敗（delete 成功 → insert 失敗）した場合、その月の休業日が空になる。しかしこれは「通常営業（デフォルト状態）」への復帰であり、安全側に倒れる失敗モード。

| 判断材料 | 評価 |
|---|---|
| 同時実行リスク | 極めて低い（管理者のみの操作） |
| データ量 | 最大5〜6レコード/月 |
| 失敗時の影響 | デフォルト状態に戻るだけ（安全側に倒れる） |
| リカバリ | 再保存で即復旧 |

### アーキテクチャ上の理由

トランザクションを導入する場合、どこに責務を持たせるかが問題になる:

- **Repository に複合操作（`syncMonth`）を追加**: Repository がオーケストレーションに踏み込み、責務が曖昧になる
- **Service 層で `db.transaction()` を呼ぶ**: Service → Infrastructure の直接依存となり、Clean Architecture に違反する
- **Unit of Work パターン**: この規模では過剰

いずれもアーキテクチャの複雑化に対してメリットが見合わない。Repository は `deleteByMonth` と `createMany` を独立した原子操作として提供し、Service が順次呼び出す設計が最も自然。

なお、Neon HTTP driver (`drizzle-orm/neon-http`) でも `db.transaction()` は Neon の HTTP transaction API 経由で利用可能。技術的制約ではなく設計判断としてトランザクションを使わない。

---

## 完了条件

### 自動チェック

- [ ] `pnpm check` が通る（tsc + lint + format）

### 手動確認

- [ ] `pnpm drzl:gen` でマイグレーションファイルが生成される
- [ ] `pnpm drzl:migrate` でマイグレーションが適用できる
- [ ] Drizzle Studio で `closed_days` テーブルの `date` カラムに UNIQUE 制約がついていることを確認
- [ ] 既存の events ページ（`/events`）で休業日の表示が壊れていないことを確認（`listByMonth` の後方互換性）

**Note:** `deleteByMonth` / `createMany` はこの時点では呼び出し元がないため、型チェックのみで動作確認は Phase 3 完了時にまとめて行う。

---

## 変更ファイル一覧

| ファイル | 変更種別 |
| --- | --- |
| `src/infrastructure/db/schema.ts` | 修正（`.unique()` 追加） |
| `src/domain/repositories/closedDayRepository.ts` | 修正（メソッド追加） |
| `src/infrastructure/db/repositories/drizzleClosedDayRepository.ts` | 修正（メソッド実装） |
| `drizzle/0008_*.sql` | 新規（自動生成マイグレーション） |
