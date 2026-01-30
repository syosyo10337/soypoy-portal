# Neon Local 開発環境セットアップ

`./bin/dev` で自動的に Neon のエフェメラルブランチが作成され、開発環境が構築されます。

## 仕組み

```
./bin/dev
    │
    ├─► db コンテナ (neon_local)
    │      └─► Neon クラウドにエフェメラルブランチを自動作成
    │
    └─► app コンテナ (Next.js)
           └─► db コンテナ経由でエフェメラルブランチに接続
```

- コンテナ起動時：親ブランチ（development）からエフェメラルブランチを自動作成
- コンテナ終了時：エフェメラルブランチを自動削除

## 前提条件

1. Neon プロジェクトへのアクセス権限
2. Docker Desktop がインストール済み
3. `.env.keys` ファイル（チームリードから取得）

**Mac の場合**: Docker Desktop の設定で VM を **gRPC FUSE** に変更してください（VirtioFS にバグがあるため）。

## セットアップ

### 1. Neon API キーの取得

1. [Neon Console](https://console.neon.tech) にログイン
2. Account Settings → API Keys → Create new API Key
3. キーをコピー

### 2. セットアップスクリプトの実行

```bash
./bin/setup
```

このスクリプトは以下を行います：
1. `.env.share` から `.env.local` を生成
2. 対話形式で `NEON_API_KEY` を設定

### 3. 開発サーバーの起動

```bash
./bin/dev
```

これだけで：
1. Neon にエフェメラルブランチが作成される
2. Next.js アプリがそのブランチに接続
3. http://localhost:3000 で開発開始

### 4. 終了

```bash
# Ctrl+C または別ターミナルで
docker compose down
```

エフェメラルブランチは自動削除されます。

## 環境変数ファイルの構成

| ファイル | 用途 | Git 管理 |
|---------|------|---------|
| `.env.share` | 共有環境変数（NEON_API_KEY 以外） | Yes |
| `.env.local` | 個人環境変数（NEON_API_KEY 含む） | No |
| `.env.keys` | 復号キー | No（別途共有） |

## Git ブランチ連携

Neon Local は Git ブランチごとに異なるデータベースブランチを作成できます。

`compose.yml` で以下のボリュームマウントが設定されています：

```yaml
volumes:
  - ./.neon_local:/tmp/.neon_local
  - ./.git/HEAD:/tmp/.git/HEAD:ro,consistent
```

これにより、Git ブランチを切り替えると自動的に対応する Neon ブランチに切り替わります。

## トラブルシューティング

### db コンテナが起動しない

- `NEON_API_KEY` が正しく設定されているか確認
- Docker Desktop が起動しているか確認
- `npx dotenvx get -f .env.local` で環境変数を確認

### 接続エラー

- db コンテナのログを確認: `docker compose logs db`
- Neon Dashboard でブランチが作成されているか確認

### Mac で動作しない

Docker Desktop → Settings → General → Virtual Machine options で **gRPC FUSE** を選択

### NEON_API_KEY を再設定したい

```bash
npx dotenvx set NEON_API_KEY "your-new-api-key" -f .env.local
```

## 参考リンク

- [Neon Local - 公式ドキュメント](https://neon.com/docs/local/neon-local)
- [Docker Hub - neondatabase/neon_local](https://hub.docker.com/r/neondatabase/neon_local)
- [Guide: Neon Local with Docker Compose](https://neon.com/guides/neon-local-docker-compose-javascript)
