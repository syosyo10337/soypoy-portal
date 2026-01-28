# Neonエフェメラルブランチでのローカル開発

チーム開発では、各開発者がNeonの個人用ブランチを使って開発します。
これにより、共有のdevelopブランチを汚さずに開発・テストができます。

## ブランチ構成

```
main (本番)
  └── develop (開発マスター - 共有)
        ├── feature/task-93 (開発者A用)
        ├── feature/task-94 (開発者B用)
        └── ...
```

## 前提条件

Neonプロジェクトへのアクセス権限が必要です。

**プロジェクトオーナーの場合**: そのまま進めます。

**チームメンバーの場合**: プロジェクトオーナーにNeon Dashboardから招待してもらいます。
1. オーナーがNeon Dashboard → プロジェクト → Settings → Membersを開く
2. 「Invite member」でメールアドレスを入力
3. 招待メールからアクセス権を受け入れる

## セットアップ手順

[Neon CLI Quickstart](https://neon.com/docs/reference/cli-quickstart)を参照してください。

**補足**: このプロジェクトのルートには、Neon CLIが使用する設定ファイル `.neon` があらかじめ含まれています。通常、このファイルを手動で作成・編集する必要はありません。

### 1. Neon CLIのインストール（初回のみ）

```bash
brew install neonctl
```

### 2. Neonへの認証（初回のみ）

```bash
neon auth
```

ブラウザが開き、Neonアカウントで認証します。

### 3. 個人用ブランチの作成

```bash
# プロジェクトIDを確認
neon projects list

# developブランチから個人用ブランチを作成
neon branches create \
  --project-id <project-id> \
  --name feature/your-branch-name \
  --parent develop
```

### 4. 接続文字列の取得

```bash
neon connection-string feature/your-branch-name --project-id <project-id>
```

### 5. .env.local.devの作成

プロジェクトルートで：

```bash
echo 'NETLIFY_DATABASE_URL="<取得した接続文字列>"' > .env.local.dev
```

または、エディタで直接作成・編集することもできます：

```bash
# エディタで作成（追加の環境変数を設定する場合に便利）
code .env.local.dev
```

**注意**: `.env.local.dev`は`.gitignore`に含まれているため、コミットされません。

### 6. 開発サーバーの起動

```bash
# Docker経由（推奨）
./bin/dev

# または直接実行
pnpm dev
```

**マイグレーションについて**: 新規ブランチはdevelopブランチから最新のスキーマとデータがコピーされるため、通常はマイグレーション不要です。ただし、ローカルで新しいスキーマ変更を適用する場合は `pnpm drzl:migrate` を実行してください。

## ブランチの削除

開発が完了したら、ブランチを削除してリソースを解放：

```bash
neon branches delete feature/your-branch-name --project-id <project-id>
```

## トラブルシューティング

### 接続エラーが発生する

- `.env.local.dev`の接続文字列が正しいか確認
- Neon Dashboardでブランチが存在するか確認

### 古いデータを使いたい

developブランチから新しいブランチを作り直すと、最新のdevelopデータがコピーされます。

### project-idがわからない

```bash
neon projects list
```

または、Neon Dashboardの「Settings」で確認できます。
