# Phase 4: Admin UI 層

## 現状

- 休業日の管理画面は存在しない
- 管理画面のサイドバー/ダッシュボードには「イベント管理」「管理者管理」「パスワード設定」のみ

---

## 変更内容

### 1. ルート構成

```text
src/app/admin/(authenticated)/closed-days/
├── page.tsx                    # メインページ（Server Component）
└── _components/
    ├── ClosedDaysCalendar.tsx   # メインコンポーネント（Client Component）
    ├── CalendarGrid.tsx         # 月間カレンダーグリッド
    ├── CalendarCell.tsx         # 個別日付セル
    └── MonthSelector.tsx        # 月ナビゲーション
```

### 2. ページコンポーネント

**`page.tsx`** — Server Component。レイアウトとタイトルのみ。

### 3. ClosedDaysCalendar（メインコンポーネント）

Client Component。以下を管理:

#### State

| state | 型 | 説明 |
| --- | --- | --- |
| `currentYear` | `number` | 表示中の年 |
| `currentMonth` | `number` | 表示中の月 |
| `closedDates` | `Set<string>` | 選択中の休業日（YYYY-MM-DD） |

保存中の状態は `syncMutation.isPending` を直接参照する（専用 state は不要）。

#### データ取得

tRPC クライアントを直接使用し、2つのクエリを並行で呼び出す:

- `trpc.closedDays.listByMonth` → 既存休業日を取得して `closedDates` を初期化
- `trpc.events.listByMonth` → イベント日を取得（トグル不可の判定用）

##### Refine の data-provider を使わない理由

現在の `dataProvider`（`src/app/admin/_providers/dataProvider.ts`）は `resourceHandlers` に登録されたリソース（`events`, `admins`）の標準 CRUD（`getList`, `getOne`, `create`, `update`, `delete`）のみをサポートしている。休業日管理は以下の点で合わない:

- `listByMonth` は year/month パラメータが必要だが、現在の `dataProvider.getList` はパラメータなしの全件取得のみ対応
- `syncMonth` は CRUD のどれにも当てはまらない一括同期操作

data-provider を拡張すれば対応可能だが、この画面専用のために汎用インターフェースを拡張するメリットが薄い。

##### 2つのクエリを1つの API にまとめない理由

`closedDays.listByMonth` と `events.listByMonth` を統合した API（例: `closedDays.getMonthData`）を作ることも可能だが、そうしない理由:

- **`httpBatchLink` による自動バッチ**: このプロジェクトの tRPC クライアントは `httpBatchLink` を使用しており、同一フレーム内の複数 tRPC 呼び出しが自動で1つの HTTP リクエストにまとめられる。クライアントで2つを並行呼び出ししても、ネットワーク往復は実質1回
- **API の凝集度**: 各ルーターが自分のリソースのみを返す設計を維持できる。closedDays ルーターが events のデータも返すと責務が混在する
- **再利用性**: 個別に呼べるため、他の画面でも使い回せる

#### データフロー

```text
1. 月選択 → listByMonth (closedDays + events) を fetch
2. カレンダー描画:
   - 全日付を表示
   - 平日 → グレーアウト（操作不可）
   - イベント日（金/土/日） → イベントマーク付き（操作不可）
   - 休業日（選択中） → ハイライト（トグル可能）
   - 通常営業日（金/土/日） → デフォルト（トグル可能）
3. セルクリック → closedDates の Set を更新（ローカル state のみ）
4. 保存ボタン → syncMonth 呼び出し
5. 成功 → トースト通知 / エラー → エラーメッセージ表示
```

### 4. CalendarGrid

月間カレンダーをグリッド表示:

- 7列（日〜土）× 最大6行
- 各セルは `CalendarCell` コンポーネント

### 5. CalendarCell の状態

| 状態 | 見た目 | クリック可否 |
| --- | --- | --- |
| 平日 | グレーアウト、テキスト薄い | 不可 |
| イベント日（金/土/日） | イベントアイコン or ラベル表示 | 不可 |
| 休業日（選択中） | アクセントカラー（`#F0433C`）でハイライト | 可（解除） |
| 通常営業日（金/土/日） | デフォルト | 可（休業日に設定） |

### 6. MonthSelector

前月/次月のナビゲーション。ユーザー向け events ページの `MonthNavigation` コンポーネントと同様のUIだが、URL パラメータではなく state で管理。

### 7. サイドバーへのリンク追加

管理画面のナビゲーションに「休業日管理」リンクを追加。既存の「イベント管理」「管理者管理」の並びに配置。

---

## 完了条件

### 自動チェック

- [ ] `pnpm check` が通る（tsc + lint + format）

### 手動確認（ブラウザ動作確認）

#### ページ表示

- [ ] `/admin/closed-days` にアクセスしてページが表示される
- [ ] 管理画面のサイドバー/ダッシュボードから「休業日管理」にナビゲーションできる

#### カレンダー描画

- [ ] 月の日数・曜日配置が正しい
- [ ] 平日セルがグレーアウトされている（操作不可）
- [ ] イベントがある金/土/日にイベントの存在が視覚的に分かる（操作不可）
- [ ] 既存の休業日がハイライト表示されている

#### トグル操作

- [ ] 通常営業日（金/土/日）をクリックすると休業日として選択される
- [ ] 選択済みの休業日をクリックすると解除される
- [ ] 平日セルをクリックしても反応しない
- [ ] イベント日セルをクリックしても反応しない

#### 保存

- [ ] 保存ボタンで休業日が保存される（トースト通知）
- [ ] ページリロード後もデータが保持されている
- [ ] 全て解除して保存すると、月の休業日が空になる

#### 月ナビゲーション

- [ ] 前月/次月ボタンで表示月が切り替わる
- [ ] 切り替え後、その月の休業日・イベントデータが再取得される

#### エンドツーエンド

- [ ] 管理画面で休業日を登録後、ユーザー向け events ページ（`/events`）の ScheduleAnnouncement に反映されている

---

## 変更ファイル一覧

| ファイル | 変更種別 |
| --- | --- |
| `src/app/admin/(authenticated)/closed-days/page.tsx` | 新規 |
| `src/app/admin/(authenticated)/closed-days/_components/*.tsx` | 新規 |
| 管理画面サイドバー / ダッシュボード | 修正（リンク追加） |
