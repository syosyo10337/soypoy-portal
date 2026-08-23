# Netlifyデプロイメント設定

> **Note:** このドキュメントは元々、Better Auth（`BETTER_AUTH_SECRET`/`BETTER_AUTH_URL`）とNeon Database（`DATABASE_URL`）のNetlify環境変数設定ガイドでした。それらの機能はDB削除・管理画面撤去に伴い削除済みです。以下は現在も有効なNetlifyビルド/Cloudinary関連の内容のみを残したものです。
>
> `netlify.toml` にはまだ `BETTER_AUTH_URL` / `APP_ENV` の設定が残っていますが、対応する読み取りコードは既に存在しません。ホスティング構成（`netlify.toml`）自体のクリーンアップはこのドキュメント更新の対象外で、別途対応予定です。

## 概要

このプロジェクトはNetlifyにデプロイされ、`main` ブランチへのマージで本番環境に、プルリクエストでDeploy Preview環境に自動デプロイされます。

## 環境変数

イベント/休業日データは `src/data/` の静的ファイルで管理されているためDBの接続情報は不要です。実行時に必要な環境変数は次のみです。

| 環境変数 | 用途 |
|---------|------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `next-cloudinary`（`<CldImage>`）がイベントサムネイル表示に使用 |

`netlify.toml` の `[build.environment]` に設定済みです。値を変更する場合は `netlify.toml` を直接編集するか、Netlifyダッシュボード（Site settings → Environment variables）から上書きしてください。

## Netlify CLIでの確認

```bash
# Netlify CLIをインストール
npm install -g netlify-cli

# ログイン
netlify login

# サイトにリンク
netlify link

# 環境変数を確認
netlify env:list
```

ローカルでNetlifyビルドをテストする場合:

```bash
netlify build
```

## デプロイフロー

### Production環境へのデプロイ

1. `main` ブランチにマージ
2. Netlifyが自動的にビルド・デプロイ
3. 本番URLで公開

### Deploy Preview環境

1. プルリクエストを作成
2. Netlifyが自動的にPreview環境を作成
3. `https://deploy-preview-<PR番号>--<サイト名>.netlify.app` でプレビュー可能

## トラブルシューティング

### ビルドエラーが発生する場合

1. **環境変数の確認**: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` が `netlify.toml` に設定されているか確認
2. **ビルドログの確認**: Netlifyのビルドログでエラー内容を確認
3. **ローカルでテスト**: `./bin/build` でローカル環境でビルドを確認

## 参考リンク

- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
- [Netlify Build Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
