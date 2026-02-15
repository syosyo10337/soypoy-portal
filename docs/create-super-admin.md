# 本番環境でのスーパー管理者作成手順

## 概要

本番環境では、セキュリティ上の理由からシードスクリプトは実行できません。
初回セットアップ時や緊急時には、以下の手順でスーパー管理者を作成してください。

## 手順

### 1. パスワードハッシュの生成

ローカル環境で以下のスクリプトを実行し、パスワードハッシュを生成します。

```bash
# プロジェクトルートで実行
node --input-type=module -e "
import { scryptAsync } from '@noble/hashes/scrypt.js';
import { bytesToHex, randomBytes } from '@noble/hashes/utils.js';

async function hash(password) {
  const salt = bytesToHex(randomBytes(16));
  const key = await scryptAsync(password.normalize('NFKC'), salt, {
    N: 16384, r: 16, p: 1, dkLen: 64,
    maxmem: 128 * 16384 * 16 * 2
  });
  console.log(\`\${salt}:\${bytesToHex(key)}\`);
}

// ここに安全なパスワードを入力
hash('YOUR_SECURE_PASSWORD_HERE');
"
```

出力例：

```
a1b2c3d4e5f6...:7890abcdef...
```

### 2. データベースへの挿入

本番データベースに接続し、以下のSQLを実行します。

```sql
-- ユーザーの作成
INSERT INTO "admin_user" (
  id, 
  email, 
  name, 
  email_verified, 
  role, 
  created_at, 
  updated_at
) VALUES (
  'super_admin_001',
  'super@your-domain.com',
  'Super Admin',
  true,
  'super_admin',
  NOW(),
  NOW()
);

-- アカウント（認証情報）の作成
INSERT INTO "admin_account" (
  id, 
  account_id, 
  provider_id, 
  user_id, 
  password, 
  created_at, 
  updated_at
) VALUES (
  'acc_super_001',
  'super_admin_001',
  'credential',
  'super_admin_001',
  'ここに手順1で生成したハッシュを貼り付け',
  NOW(),
  NOW()
);
```

### 3. 確認

作成したアカウントでログインできることを確認してください。

## 緊急時の対応

### スーパー管理者全員がロックアウトされた場合

1. 上記の手順で新しいスーパー管理者を作成
2. または、既存ユーザーのパスワードをリセット：

```sql
-- 既存ユーザーのパスワードを更新
UPDATE "admin_account"
SET password = 'ここに新しいハッシュ',
    updated_at = NOW()
WHERE user_id = '対象ユーザーのID';

-- 全セッションを無効化
DELETE FROM "admin_session"
WHERE user_id = '対象ユーザーのID';
```

## セキュリティ上の注意

- パスワードは必ず12文字以上の強力なものを使用
- ハッシュ生成に使用したパスワードは安全に管理
- 本番DBへのアクセスは最小限の人数に制限
- 作業後は履歴をクリア（`history -c`）
