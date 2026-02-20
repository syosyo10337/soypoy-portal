# Neon DBブランチ操作ガイド

このプロジェクトでは、各開発者がNeonの個人用ブランチを使って開発します。

## ブランチ構成

```
production (本番)
  └── development (開発マスター)
        ├── dev-taro (開発者Aの個人ブランチ)
        ├── dev-hanako (開発者Bの個人ブランチ)
        └── ...
```

## シナリオ別操作

### 1. 初めて開発する（初回セットアップ）

```bash
./bin/setup
```

このコマンドで以下が自動実行されます:

- Neon CLIのインストール確認
- Neonへの認証（ブラウザが開きます）
- 個人ブランチ `dev-{ユーザー名}` の作成
- `.env.local.dev` の生成

### 2. DBを使わずに開発する

`.env.local.dev` がない状態で開発サーバーを起動すると、`.env.local` のDB設定（共有のdevelopment）が使われます。

```bash
# .env.local.dev を削除または作成しない
rm .env.local.dev  # 既にある場合

# 開発サーバー起動
./bin/dev
```

> **注意**: この場合、DB操作は共有の `development` ブランチに影響します。読み取り専用の作業や、フロントエンドのみの開発に適しています。

### 3. ブランチをリセットして再作成する

developmentの最新データで完全にやり直したい場合:

```bash
./bin/setup --reset
```

これは以下を実行します:

1. 既存の個人ブランチを削除
2. developmentから新しいブランチを作成
3. `.env.local.dev` を再生成

### 4. ブランチを削除する（クリーンアップ）

プロジェクトを離れる時や、不要になったブランチを削除する場合:

```bash
./bin/cleanup
```

確認プロンプトの後、以下を実行します:

- Neonブランチの削除
- `.env.local.dev` の削除

### 5. 手動で特定のブランチに接続する

自動セットアップを使わず、特定のブランチに接続したい場合:

```bash
# 1. 接続文字列を取得
neon connection-string <branch-name> --project-id <project-id>

# 2. .env.local.dev を手動作成
cat > .env.local.dev << EOF
NETLIFY_DATABASE_URL="<取得した接続文字列>"
NEON_BRANCH_NAME="<branch-name>"
EOF
```

> **警告**: 本番ブランチ（`production`）に接続すると、予期せぬデータ変更が発生する可能性があります。本番への直接接続は避けてください。

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `./bin/setup` | 初回セットアップ（ブランチ作成） |
| `./bin/setup --reset` | ブランチを削除して再作成 |
| `./bin/cleanup` | ブランチを削除 |
| `./bin/dev` | 開発サーバー起動（自動でdevelopmentから同期） |
