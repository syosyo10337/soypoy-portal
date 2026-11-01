# Storybook 導入 設計

## 目的

共有 UI コンポーネントを、アプリや DB を起動せず単体で確認・開発できる環境を用意する。
今回は基盤の整備と、設定の動作確認を兼ねた最小限の Story までを対象とする。

## 方針

フレームワークは `@storybook/nextjs-vite` を採用する。

- `next/font`、`next/navigation`、`next/image` などを公式の仕組みで扱える
- webpack 版の `@storybook/nextjs` より起動が速い
- `@storybook/react-vite` と違い、Next.js 関連のモックを自前で用意しなくて済む

Next.js 16.2 との互換性はインストール時に確認する。問題があれば実装を止めて方針を見直す。

## 変更内容

### 依存関係

`./bin/pnpm add -D` で次を追加する。

- `storybook`
- `@storybook/nextjs-vite`
- `@storybook/addon-docs`
- `vite`

`storybook init` はサンプル Story を生成するため使わず、手動で構成する。

### Storybook 設定

`.storybook/main.ts`

- 対象は `src/**/*.stories.tsx`。Story はコンポーネントの隣に置く
- addon は `@storybook/addon-docs` のみ

`.storybook/preview.ts`

- `@/assets/styles/globals.css` を読み込む
- `src/app/layout.tsx` と同じフォント変数のクラスを `<html>` に、本文フォントと背景のクラスを `<body>` に付与する（`Dialog` などのポータルにも適用するため、decorator の要素には付けない）
- `nextjs.appDirectory: true` を設定する

### Docker と実行コマンド

- `compose.yml` の `ports` に `6006:6006` を追加する
- `package.json` に次の script を追加する
  - `storybook`: `storybook dev -p 6006 --host 0.0.0.0 --no-open`
  - `build-storybook`: `storybook build`
- `bin/storybook` を追加する
  - `app` コンテナが起動中なら `docker compose exec app pnpm storybook` を実行する
  - 停止中なら `docker compose run --rm --service-ports app pnpm storybook` を実行する
- 既存コンテナにポートを反映するため、導入後に 1 回コンテナの再作成が必要になる

### 付随する設定

- `tsconfig.json` の `include` に `.storybook/**/*` を追加する（`**/*` はドットディレクトリに一致しないため）
- `.gitignore` に `storybook-static` を追加する
- `biome.json` の `files.includes` で `storybook-static` を除外し、`.storybook` が lint と format の対象になることを確認する

### CI

`.github/workflows/ci.yml` に `storybook` ジョブを追加する。

- 名前は `Storybook ビルド`
- 既存の `static-analysis` と独立して実行し、失敗の原因を区別できるようにする
- 手順は checkout、pnpm と Node のセットアップ、`pnpm install --frozen-lockfile`、`pnpm build-storybook`
- `permissions` は `contents: read`
- トリガーと `paths-ignore` は既存のワークフローの設定をそのまま使う
- ビルド成果物の保存や公開は行わない

### 最初の Story

依存の異なる 3 つのコンポーネントを対象にする。

| 対象 | 確認すること |
| --- | --- |
| `src/components/shadcn/button.tsx` | バリアントと Tailwind のスタイル |
| `src/components/BubleLabel` | Next.js モジュールのモック |
| `src/components/PageTitle` | カスタムフォント |

### ドキュメント

`CLAUDE.md` を更新する。

- `./bin/storybook` をコマンド一覧に追加する
- Story の配置ルールを追記する
- 実態とずれている記述を直す（Next.js 15 → 16、存在しない SVGR の記述の削除）

## 対象外

- 上記 3 つ以外のコンポーネントの Story
- tRPC や Refine に依存する admin 系コンポーネントの Story（モックの設計が別途必要）
- Storybook の公開・ホスティング
- インタラクションテスト、Vitest 連携、a11y アドオン

## 検証

- `./bin/storybook` を起動し、`http://localhost:6006` で 3 つの Story が表示される
- `PageTitle` にカスタムフォントが適用され、背景がベージュで表示される
- `./bin/pnpm build-storybook` が成功する
- `./bin/check` が成功する
- PR の CI で `Storybook ビルド` ジョブが成功する
- Story を追加しても `next build` の成果物に影響しない（Story はアプリのルートから import されない）
