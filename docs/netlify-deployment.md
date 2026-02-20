# Netlifyデプロイメント設定

## 概要

このプロジェクトはNetlifyにデプロイ可能で、Production環境とDeploy Preview環境で異なる環境変数を使用します。

## 環境変数の設定

### 自動設定される環境変数（設定不要）

Netlifyが自動的に提供する環境変数:

| 環境変数 | 説明 |
|---------|------|
| `DEPLOY_PRIME_URL` | 現在のデプロイのプライマリURL |

### Netlify UIで設定が必要な環境変数

以下の環境変数をNetlify管理画面で設定してください:

#### 1. BETTER_AUTH_SECRET（Production環境用）

```
Key: BETTER_AUTH_SECRET
Value: <強力なランダム文字列を生成>
Scopes: ☑ Production
```

生成方法:

```bash
# Node.jsで生成
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# またはOpenSSLで生成
openssl rand -base64 32
```

#### 2. BETTER_AUTH_SECRET（Preview/Branch環境用）

```
Key: BETTER_AUTH_SECRET
Value: <別の強力なランダム文字列を生成>
Scopes: ☑ Deploy Previews ☑ Branch deploys
```

#### 3. DATABASE_URL

Neon Databaseの接続文字列を設定:

```
Key: DATABASE_URL
Value: postgresql://user:password@host/database?sslmode=require
Scopes: ☑ Production ☑ Deploy Previews ☑ Branch deploys
```

**注意**: Preview環境用に別のデータベースを使用することを推奨します。

#### 4. その他の環境変数

プロジェクトで使用している他の環境変数（Cloudinaryなど）も同様に設定してください。

## Netlify UIでの設定手順

1. **Netlifyダッシュボードにログイン**
2. **対象サイトを選択**
3. **Site settings** → **Environment variables** をクリック
4. **Add a variable** をクリック
5. 上記の環境変数を入力
6. 適切なScopesを選択
7. **Create variable** をクリック

## netlify.toml の設定

プロジェクトルートの `netlify.toml` ファイルで以下が設定されています:

### Production環境

- `BETTER_AUTH_URL`: 本番ドメイン（要変更）
- `NEXT_PUBLIC_BETTER_AUTH_URL`: 本番ドメイン（要変更）

### Deploy Preview環境

- `BETTER_AUTH_URL`: `$DEPLOY_PRIME_URL`（自動設定）
- `NEXT_PUBLIC_BETTER_AUTH_URL`: `$DEPLOY_PRIME_URL`（自動設定）

## デプロイ前の確認事項

### 1. netlify.toml の本番URLを変更

```toml
[context.production.environment]
  BETTER_AUTH_URL = "https://your-actual-domain.com"  # ← ここを変更
  NEXT_PUBLIC_BETTER_AUTH_URL = "https://your-actual-domain.com"  # ← ここを変更
```

### 2. 環境変数の確認

Netlify CLIを使用して環境変数を確認:

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

### 3. ビルドテスト

ローカルでNetlifyビルドをテスト:

```bash
# Netlify CLIでビルド
netlify build

# ローカルでプレビュー
netlify dev
```

## デプロイフロー

### Production環境へのデプロイ

1. `main` ブランチにマージ
2. Netlifyが自動的にビルド・デプロイ
3. `https://your-production-domain.com` で公開

### Deploy Preview環境

1. プルリクエストを作成
2. Netlifyが自動的にPreview環境を作成
3. `https://deploy-preview-<PR番号>--<サイト名>.netlify.app` でプレビュー可能

## トラブルシューティング

### ビルドエラーが発生する場合

1. **環境変数の確認**: 必要な環境変数がすべて設定されているか確認
2. **ビルドログの確認**: Netlifyのビルドログでエラー内容を確認
3. **ローカルでテスト**: `netlify build` でローカル環境でテスト

### 認証エラーが発生する場合

1. **BETTER_AUTH_SECRET**: 正しく設定されているか確認
2. **BETTER_AUTH_URL**: 環境に応じた正しいURLが設定されているか確認
3. **DATABASE_URL**: データベース接続文字列が正しいか確認

### Preview環境でURLが正しくない場合

1. `netlify.toml` で `$DEPLOY_PRIME_URL` が正しく設定されているか確認
2. ビルドログで環境変数の値を確認:

   ```bash
   echo "BETTER_AUTH_URL: $BETTER_AUTH_URL"
   ```

## セキュリティのベストプラクティス

1. **環境ごとに異なるシークレットを使用**: Production と Preview で異なる `BETTER_AUTH_SECRET` を設定
2. **機密情報はUIで設定**: `netlify.toml` には機密情報を含めない
3. **Preview環境用の別データベース**: 本番データを保護するため、Preview環境用に別のデータベースを使用
4. **環境変数のスコープを適切に設定**: 必要な環境のみにスコープを限定

## 参考リンク

- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
- [Netlify Build Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Better Auth Documentation](https://www.better-auth.com/docs)
