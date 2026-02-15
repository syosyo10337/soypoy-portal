# ADR-002: 集約間バリデーションを Service 層で行う

## ステータス

**承認** (2026-02)

## コンテキスト

休業日管理機能の `syncMonth` において、「イベントが登録されている日には休業日を設定できない」というビジネスルールを実装する必要がある。

この制約は **ClosedDay と Event という2つの独立した集約** にまたがるバリデーションであり、実装方法によってアーキテクチャへの影響が異なる。

### 具体的な処理

```
syncMonth(year, month, dates)
  ├─ Event の存在確認（SELECT FROM events）
  ├─ アプリ内で日付比較
  ├─ 既存 ClosedDay の削除（DELETE FROM closed_days）
  └─ 新規 ClosedDay の作成（INSERT INTO closed_days）
```

DB 往復が3回発生する。SQL の視点では、サブクエリや JOIN を使えば1〜2回に削減可能。

## 検討した選択肢

### 選択肢1: Service 層でバリデーション（アプリケーションロジック）

Service が EventRepository と ClosedDayRepository をそれぞれ呼び出し、アプリケーションコード内で日付を突合する。

```typescript
// ClosedDayService
async syncMonth(year, month, dates) {
  const events = await this.eventRepository.listByMonth(year, month);
  const eventDates = events.map(e => e.date.split("T")[0]);
  const conflicts = dates.filter(d => eventDates.includes(d));
  if (conflicts.length > 0) throw new ClosedDayConflictError(conflicts);

  await this.repository.deleteByMonth(year, month);
  return await this.repository.createMany(newClosedDays);
}
```

**利点**:
- 各 Repository は自分の集約のテーブルしか知らない（集約境界を維持）
- ビジネスルールがアプリケーションコードに明示的に表現される
- テスト時に Repository をモックすることで、DB なしでロジックを検証可能

**欠点**:
- DB 往復が3回（events SELECT + closed_days DELETE + closed_days INSERT）
- SQL なら1〜2回で完結する処理にオーバーヘッドがある

### 選択肢2: Repository 内で SQL サブクエリ（データベースロジック）

ClosedDayRepository が events テーブルに直接アクセスし、SQL 内で重複チェックと書き込みを一括実行する。

```typescript
// DrizzleClosedDayRepository
async syncMonth(year, month, dates) {
  await db.execute(sql`
    DELETE FROM closed_days WHERE ...;
    INSERT INTO closed_days (id, date)
    SELECT ... WHERE NOT EXISTS (
      SELECT 1 FROM events WHERE events.date::date = ANY(${dates})
    );
  `);
}
```

**利点**:
- DB 往復が1回で完結
- SQL レベルでの原子性が保証される

**欠点**:
- ClosedDayRepository が events テーブルの構造に依存する（集約境界の侵害）
- ビジネスルールが SQL 内に埋もれ、可読性が低下する
- Repository のテストに実際の DB（または両テーブルのセットアップ）が必要
- events テーブルのスキーマ変更が ClosedDayRepository に波及する

### 選択肢3: DB トリガー / CHECK 制約

データベース側で制約を定義し、アプリケーションは意識しない。

```sql
CREATE TRIGGER check_event_conflict
BEFORE INSERT ON closed_days
FOR EACH ROW EXECUTE FUNCTION check_no_event_on_date();
```

**利点**:
- DB レベルで確実にルールが適用される
- アプリケーションコードがシンプル

**欠点**:
- ビジネスルールがアプリケーションの外（DB）に分散する
- Drizzle ORM のマイグレーション管理と相性が悪い
- エラーメッセージのカスタマイズが困難（どの日付が重複したかを返しにくい）
- テストが DB 依存になる

## 決定

**選択肢1: Service 層でバリデーション** を採用する。

### 決定理由

| 要因 | 評価 |
|------|------|
| 集約境界の維持 | Repository が他テーブルに依存しない → 選択肢1 |
| ルールの可視性 | ビジネスルールがコードで明示される → 選択肢1 |
| テスタビリティ | モックで検証可能 → 選択肢1 |
| パフォーマンス | 選択肢2が優位だが、許容範囲内 → 下記参照 |

### パフォーマンスの許容判断

| 要素 | 状況 |
|------|------|
| データ量 | 月あたり最大5〜6件 |
| 実行頻度 | 月に1〜2回、管理者のみ |
| DB 往復コスト | 3回 × 数十ms = 100〜200ms 程度 |
| ユーザー体感 | ボタン押下後の保存処理。200ms は問題にならない |

秒間数百リクエストの API や万単位のレコードを扱う場合は、SQL に寄せる判断もありえる。しかし本プロジェクトの規模では、コードの明確さ・テスタビリティ・レイヤー分離を優先する。

### 受け入れるトレードオフ

1. **DB 往復のオーバーヘッド**
   - SQL 最適解と比べて1〜2回多い往復が発生する
   - → この規模では体感に影響しない

2. **データの一時的不整合リスク**
   - トランザクションなし（順次実行）のため、delete 後 insert 前に障害が起きると月の休業日が空になる
   - → 安全側に倒れる（デフォルト営業状態に戻るだけ）。再保存で復旧可能

## 影響

### 本 ADR が適用される範囲

このプロジェクトにおいて、**複数の集約をまたぐバリデーション** が必要な場合は、同じ方針（Service 層でのオーケストレーション）を採用する。

### エラークラスの配置方針

本 ADR に付随して、ビジネスルール違反のエラークラスの配置方針も定める:

| 配置先 | 基準 | 例 |
|---|---|---|
| `src/domain/errors/` | 単一集約内の不変条件違反 | タイトル空文字、日付不正 |
| `src/services/errors/` | 複数集約間の制約違反（本 ADR の対象） | イベント日と休業日の重複 |

### 関連ドキュメント

- [休業日管理機能 設計](../features/closed-days/00-overview.md)
- [Phase 2: Service 層](../features/closed-days/02-service.md)
