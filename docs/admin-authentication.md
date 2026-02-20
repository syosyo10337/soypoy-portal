# 管理画面の認証

## 概要

SOY-POYの管理画面は、BetterAuthを使用した認証システムで保護されています。
一般ユーザーによるアカウント作成は無効化されており、管理者のみがアカウントを発行できます。

## 認証方式

- **認証ライブラリ**: BetterAuth
- **認証方法**: Email + Password
- **サインアップ**: 無効（`disableSignUp: true`）
- **アカウント作成**: 管理者のみ（adminプラグイン経由）

## ローカル開発用アカウント

開発環境でのテスト用に、以下のデフォルト管理者アカウントが用意されています。

| 項目 | 値 |
|------|-----|
| Email | `admin@soypoy.local` |
| Password | `admin1234` |
| Role | `admin` |

### アカウントの作成方法

ローカル環境で管理者アカウントを作成するには、以下のコマンドを実行します：

```bash
# Docker環境
docker compose exec app pnpm db:seed

# 直接実行
pnpm db:seed
```

**注意**: このスクリプトは `NODE_ENV=production` の場合は実行されません。

## 本番環境でのアカウント作成

本番環境では、adminプラグインのAPIを使用してアカウントを作成します。

### API経由での作成

管理者権限を持つユーザーが、以下のAPIを使用して新しいユーザーを作成できます：

```typescript
// クライアント側
import { authClient } from "@/infrastructure/auth/client";

await authClient.admin.createUser({
  email: "newuser@example.com",
  password: "securepassword",
  name: "New User",
  role: "user", // または "admin"
});
```

### 初回セットアップ

本番環境の初回セットアップ時は、データベースに直接管理者アカウントを挿入する必要があります。
その後は、adminプラグインのAPIを使用して追加のアカウントを作成できます。

## adminプラグインの機能

BetterAuthのadminプラグインにより、以下の機能が利用可能です：

- **ユーザー作成**: `authClient.admin.createUser()`
- **ユーザー一覧取得**: `authClient.admin.listUsers()`
- **ユーザー削除**: `authClient.admin.removeUser()`
- **ロール変更**: `authClient.admin.setRole()`
- **ユーザーBAN**: `authClient.admin.banUser()` / `authClient.admin.unbanUser()`

## データベーススキーマ

adminプラグインにより、`user`テーブルに以下のカラムが追加されています：

| カラム | 型 | 説明 |
|--------|-----|------|
| `role` | text | ユーザーロール（`user` / `admin`） |
| `banned` | boolean | BANステータス |
| `ban_reason` | text | BAN理由 |
| `ban_expires` | timestamp | BAN期限 |
