# Phase 3: tRPC API 層

## 現状

### ルーター (`src/infrastructure/trpc/routers/closedDays.ts`)

```typescript
export const closedDaysRouter = router({
  listByMonth: publicProcedure
    .input(z.object({ year: z.number(), month: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.closedDayService.getClosedDaysByMonth(input.year, input.month);
    }),
});
```

- `listByMonth` のみ。public アクセス（認証不要）
- Zod スキーマは closedDays 専用ファイルなし（インラインで定義）

### Context (`src/infrastructure/trpc/context.ts`)

`closedDayService` は既に context に含まれている。変更不要。

---

## 変更内容

### 1. Zod スキーマの作成

**新規ファイル:** `src/infrastructure/trpc/schemas/closedDay.ts`

```typescript
import { DateTime } from "luxon";
import { z } from "zod";

const dateString = z.iso.date().refine((val) => {
  return DateTime.fromISO(val).isValid;
}, "有効な日付を指定してください");

export const syncMonthSchema = z
  .object({
    year: z.number().int().min(2000).max(2100),
    month: z.number().int().min(1).max(12),
    dates: z.array(dateString),
  })
  .superRefine((data, ctx) => {
    for (const [i, d] of data.dates.entries()) {
      const dt = DateTime.fromISO(d);
      if (dt.year !== data.year || dt.month !== data.month) {
        ctx.addIssue({
          code: "custom",
          path: ["dates", i],
          message: `${d} は ${data.year}年${data.month}月に属しません`,
        });
      }
    }
  });
```

| フィールド | バリデーション | 備考 |
| --- | --- | --- |
| `year` | 整数、2000〜2100 | 合理的な範囲に制限 |
| `month` | 整数、1〜12 | |
| `dates` (フォーマット) | `z.iso.date()` で ISO 8601 日付形式 | 空配列は許可（月の休業日をすべて解除） |
| `dates` (実在性) | Luxon で有効な日付か検証 | `2026-02-31` のような存在しない日付を拒否 |
| `dates` (cross-field) | `.superRefine()` で各日付が `year`/`month` に属するか検証 | 不正な日付のインデックスとパス付きでエラーを返す |

### 2. ルーターへの `syncMonth` 追加

**ファイル:** `src/infrastructure/trpc/routers/closedDays.ts`

```typescript
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ClosedDayConflictError } from "@/services/errors/closedDayConflictError";
import { adminProcedure, publicProcedure, router } from "../context";
import { syncMonthSchema } from "../schemas/closedDay";

export const closedDaysRouter = router({
  // 既存: 変更なし
  listByMonth: publicProcedure
    .input(z.object({ year: z.number(), month: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.closedDayService.getClosedDaysByMonth(
        input.year,
        input.month,
      );
    }),

  // 新規
  syncMonth: adminProcedure
    .input(syncMonthSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.closedDayService.syncMonth(
          input.year,
          input.month,
          input.dates,
        );
      } catch (error) {
        if (error instanceof ClosedDayConflictError) {
          throw new TRPCError({
            code: "CONFLICT",
            message: error.message,
          });
        }
        throw error;
      }
    }),
});
```

#### ポイント

- **認証:** `adminProcedure` を使用。Admin / SuperAdmin のみ実行可能
- **エラー変換:** Service 層の `ClosedDayConflictError` を `TRPCError` (code: `CONFLICT`) に変換。`message` に重複日付を含む（例: `"イベントが登録されている日付は休業日に設定できません: 2026-02-07, 2026-02-21"`）。UI ではこの message をそのままトースト表示する

---

## 完了条件

### 自動チェック

- [ ] `pnpm check` が通る（tsc + lint + format）

### 手動確認（Phase 1〜3 の一気通貫テスト）

Phase 3 は API レイヤーが完成する地点であり、Phase 1（DB/Repository）と Phase 2（Service）の動作確認もここでまとめて行う。

#### 正常系

- [ ] dev サーバー起動後、`syncMonth` を呼び出して休業日が登録される
- [ ] 登録後、`listByMonth` で登録した休業日が返ってくる
- [ ] 空配列（`dates: []`）で `syncMonth` を呼び出すと、月の休業日が全削除される
- [ ] 同じ月に対して再度 `syncMonth` を呼び出すと、既存データが新しいデータに置き換わる

#### エラー系

- [ ] イベントがある日付を含めて `syncMonth` を呼び出すと、`CONFLICT` エラーが返る
- [ ] エラーメッセージに重複している日付が含まれている
- [ ] エラー時、既存の休業日データが変更されていないことを確認（削除されていない）

#### 認証

- [ ] 未認証で `syncMonth` を呼び出すと `UNAUTHORIZED` が返る

#### リグレッション

- [ ] 既存の `closedDays.listByMonth` が正常に動作する
- [ ] 既存の events ページ（`/events`）の休業日表示が壊れていない

---

## 変更ファイル一覧

| ファイル | 変更種別 |
| --- | --- |
| `src/infrastructure/trpc/schemas/closedDay.ts` | 新規 |
| `src/infrastructure/trpc/routers/closedDays.ts` | 修正（`syncMonth` 追加） |
