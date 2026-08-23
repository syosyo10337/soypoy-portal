# SOY-POY Portal
[![Netlify Status](https://api.netlify.com/api/v1/badges/cf2087d6-8935-4bf5-a173-760c2662b661/deploy-status)](https://app.netlify.com/projects/soypoy-portal/deploys)

SOY-POYのイベント管理・公開Webサイトです。

## Quick Start

```bash
# 1. リポジトリをクローン
git clone https://github.com/soypoy/soypoy-portal.git
cd soypoy-portal

# 2. .env.keys をチームリードから取得してプロジェクトルートに配置
#    （.env.local に暗号化保存されたCloudinary認証情報の復号に使用）

# 3. 開発サーバー起動
./bin/dev
```

ブラウザで http://localhost:3000 を開くとアプリケーションが表示されます。

## 前提条件

- [Docker Desktop](https://www.docker.com/)

VSCodeユーザーは [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 拡張機能でコンテナ内開発も可能です。

## 開発の流れ

### 毎日の開発

```bash
./bin/dev
```

イベント・休業日データは `src/data/events.ts` / `src/data/closedDays.ts` に直接コミットして編集します（管理画面はありません）。

### コード品質チェック（コミット前に実行）

```bash
./bin/check
```

TypeScriptの型チェック + Biome lint + format を実行します。

## よく使うコマンド

| コマンド | 説明 |
|---------|------|
| `./bin/dev` | 開発サーバー起動 |
| `./bin/check` | lint + format（コミット前） |
| `./bin/pnpm <cmd>` | コンテナ内でpnpmコマンド実行 |

### コード品質

| コマンド | 説明 |
|---------|------|
| `pnpm lint` | Biome lint実行 |
| `pnpm lint:fix` | lint + 自動修正 |
| `pnpm format` | コードフォーマット |
| `pnpm tsc` | 型チェック |

## 環境変数

このプロジェクトは [dotenvx](https://dotenvx.com/) で環境変数を暗号化管理しています。

| ファイル | 内容 | Git |
|---------|------|-----|
| `.env.local` | 暗号化された環境変数 | コミット済み |
| `.env.keys` | 復号キー | **要取得** |

```bash
# 環境変数を確認
npx @dotenvx/dotenvx get -f .env.local

# 環境変数を追加・変更
npx @dotenvx/dotenvx set NEW_VAR "value" -f .env.local
```

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 15 (App Router) + React 19 |
| 言語 | TypeScript (strict) |
| データ | 静的TypeScriptデータ（`src/data/`、DBなし） |
| スタイル | Tailwind CSS v4 + shadcn/ui |
| Lint/Format | Biome |
| 環境変数 | dotenvx |

## ドキュメント

- [プロジェクト構成](docs/project-structure.md) - ディレクトリ構造
- [画像アップロード](docs/cloudinary-setup.md) - Cloudinary設定
- [binスクリプト](bin/README.md) - 開発用コマンド詳細

## 開発環境の停止

```bash
docker compose down
```

VSCode Dev Containerの場合は、コマンドパレットから `Dev Containers: Reopen Folder Locally` を選択。
