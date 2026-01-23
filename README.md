# SOY-POY Portal

SOY-POYのwebサイトプロジェクトです。

## 技術スタック

- **フロントエンド**
  - [Next.js](https://nextjs.org) - Reactフレームワーク
  - [TypeScript](https://www.typescriptlang.org/) - 型安全なJavaScript
  - [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク
  - [Biome](https://biomejs.dev/) - 高速なJavaScript/TypeScriptツールチェーン
  - [pnpm](https://pnpm.io/) - 高速なパッケージマネージャー
  - [dotenvx](https://dotenvx.com/) - 暗号化対応の環境変数管理


### Biomeについて

[Biome](https://biomejs.dev/)は、Rustで書かれた高速なJavaScript/TypeScriptツールチェーンです。このプロジェクトでは、コードの品質を保つために、linterとformatterとして利用しています。

#### 使用方法

- コードの静的解析（lint）:
```bash
pnpm lint        # コードの静的解析を実行
pnpm lint:fix    # 自動修正可能な問題を修正
```

- コードのフォーマット:
```bash
pnpm format      # コードのフォーマットを実行（--writeオプション付きで自動修正）
```

#### 設定

プロジェクトのルートディレクトリにある`biome.json`で、lintとformatのルールを設定しています。詳細な設定は[Biomeの公式ドキュメント](https://biomejs.dev/linter/rules/)を参照してください。


## 環境構築

### 前提条件

- [VSCode](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/)
- [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VSCode拡張機能

### 初回セットアップ

0. リポジトリをクローン
```bash
git clone [リポジトリURL]
cd soypoy-portal
```

1. `.env.keys`ファイルを取得する
   - masanaoから`.env.keys`ファイルをもらってください
   - プロジェクトルートに配置します

2. VSCodeでプロジェクトを開く
```bash
code .
```

3. VSCodeの通知から「Reopen in Container」を選択
   - または、コマンドパレット（Cmd/Ctrl + Shift + P）から「Dev Containers: Reopen in Container」を選択

4. コンテナのビルドと起動が完了するまで待機
   - 初回は依存関係のインストールに時間がかかる場合があります

**必須環境変数:**
- データベース接続（Neon PostgreSQL）
- Cloudinary画像アップロード設定

詳細は以下のドキュメントを参照:
- [Database Setup Guide](docs/database-setup.md)
- [Cloudinary Setup Guide](docs/cloudinary-setup.md)

### 環境変数管理（dotenvx）

このプロジェクトでは[dotenvx](https://dotenvx.com/)を使用して環境変数を暗号化管理しています。

#### 仕組み

- `.env.local` - 暗号化された環境変数（リポジトリにコミット済み）
- `.env.keys` - 復号化キー（**`.gitignore`に含まれているため共有が必要**）

#### セットアップ

1. `.env.keys`ファイルをmasanaoから取得
2. プロジェクトルートに配置
3. 完了！（手動での復号化は不要）

#### 開発時の起動

```bash
./bin/dev
```

内部で`dotenvx run -f .env.local -- next dev`が実行され、**自動的に環境変数が復号化**されます。手動で`dotenvx decrypt`を実行する必要はありません。

#### 個別の環境変数を確認する

特定の環境変数の値を確認したい場合：

```bash
npx dotenvx get DATABASE_URL -f .env.local
npx dotenvx get CLOUDINARY_API_KEY -f .env.local
```

すべての環境変数を一覧表示：

```bash
npx dotenvx get -f .env.local
```

#### 環境変数を追加・変更する

```bash
npx dotenvx set NEW_VAR "value" -f .env.local
```

設定後、`.env.local`の変更をコミットしてください。

#### ローカル開発用の個人設定（.env.local.dev）

チーム開発時、各開発者が個人用のNeonブランチを使う場合：

1. `.env.local.dev`ファイルをプロジェクトルートに作成
2. `NETLIFY_DATABASE_URL`を自分のブランチのURLで上書き

```bash
# .env.local.dev
NETLIFY_DATABASE_URL="postgresql://..."
```

このファイルは`.gitignore`に含まれており、コミットされません。
詳細は[Neonエフェメラルブランチ手順](docs/neon-local-branch.md)を参照してください。

## 開発サーバーの起動
dev containerを経由せずにコンテナを起動する場合は、以下のコマンドを利用します。

```bash
./bin/dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

## 開発環境の停止

開発環境を停止するには、以下のいずれかの方法を使用できます：

1. VSCodeのコマンドパレット（Mac: `Cmd + Shift + P`、Windows: `Ctrl + Shift + P`）を開き、`Dev Containers: Reopen Folder Locally` を選択

2. ターミナルから直接停止する場合：
```bash
docker compose down
```

### 開発コマンド
プロジェクトルートの`bin`ディレクトリには、ローカル環境からDockerコンテナ内のコマンドを実行するためのラッパースクリプトが格納されています。

詳細は[bin/README.md](bin/README.md)を参照してください。
