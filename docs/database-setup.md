# Neon Database + Drizzle ORM セットアップ・追加ガイド

このドキュメントでは、SOY-POYプロジェクトにおけるNeon DatabaseとDrizzle ORMの初期設定方法と、新しいデータベーステーブルの追加方法について説明します。

## 目次

1. [初期設定](#初期設定)
2. [環境変数の設定](#環境変数の設定)
3. [新しいテーブルの追加手順](#新しいテーブルの追加手順)
4. [Clean Architecture との統合](#clean-architecture-との統合)
5. [実際の例：Eventテーブルの実装](#実際の例eventテーブルの実装)
6. [マイグレーション](#マイグレーション)
7. [トラブルシューティング](#トラブルシューティング)

## 初期設定

### 1. Neon Database の作成

1. [Neon](https://neon.tech/)でアカウントを作成
2. 新しいプロジェクトを作成
3. 接続文字列（Connection String）を取得
   - 形式: `postgresql://user:password@host/database?sslmode=require`

### 2. Netlify環境での設定

Netlifyでは、データベース接続文字列が`NETLIFY_DATABASE_URL`環境変数として自動的に提供されます。

## 環境変数の設定

### ローカル開発環境

プロジェクトルートに `.env.local` ファイルを作成し、以下の環境変数を設定：

```bash
# Neon Database接続文字列
NETLIFY_DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# または、ローカル開発用にDATABASE_URLを使用する場合
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### Netlify環境

Netlifyのダッシュボードで環境変数を設定：

- `NETLIFY_DATABASE_URL`: Neon Databaseの接続文字列（自動設定される場合あり）

## 新しいテーブルの追加手順

新しいテーブル（例：`Member`）を追加する場合の手順：

### Step 1: Domain Layer の作成

#### 1.1 エンティティの定義

`src/domain/entities/member.ts`

```typescript
/**
 * メンバーエンティティ
 * ドメイン層のメンバーを表す
 */
export interface MemberEntity {
  id: string;
  name: string;
  role: string;
  email: string;
  joinDate: string;
  profileImageUrl: string | "";
}
```

#### 1.2 リポジトリインターフェースの定義

`src/domain/repositories/memberRepository.ts`

```typescript
import type { MemberEntity } from "../entities/member";

/**
 * メンバーリポジトリインターフェース
 * データアクセスの抽象化
 */
export interface MemberRepository {
  /**
   * 全てのメンバーを取得
   */
  findAll(): Promise<MemberEntity[]>;

  /**
   * IDによるメンバー取得
   */
  findById(id: string): Promise<MemberEntity | undefined>;

  /**
   * メンバーを作成
   */
  create(member: MemberEntity): Promise<MemberEntity>;

  /**
   * メンバーを更新
   */
  update(
    id: string,
    member: Partial<Omit<MemberEntity, "id">>,
  ): Promise<MemberEntity>;

  /**
   * メンバーを削除
   */
  delete(id: string): Promise<void>;
}
```

### Step 2: Infrastructure Layer の実装

#### 2.1 Drizzleスキーマの定義

`src/infrastructure/db/schema.ts`に追加

```typescript
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const members = pgTable("members", {
  id: text().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  joinDate: varchar({ length: 255 }).notNull(),
  profileImageUrl: text(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

export type DrizzleMember = InferSelectModel<typeof members>;
export type DrizzleMemberInsert = InferInsertModel<typeof members>;
```

#### 2.2 リポジトリの実装

`src/infrastructure/db/repositories/drizzleMemberRepository.ts`

```typescript
import { eq } from "drizzle-orm";
import type { MemberEntity } from "@/domain/entities/member";
import type { MemberRepository } from "@/domain/repositories/memberRepository";
import { db } from "../index";
import type { DrizzleMember, DrizzleMemberInsert } from "../schema";
import { members } from "../schema";

/**
 * Drizzleを使用したMemberRepository実装
 */
export class DrizzleMemberRepository implements MemberRepository {
  /**
   * 全てのメンバーを取得
   */
  async findAll(): Promise<MemberEntity[]> {
    const drizzleMembers = await db.select().from(members);
    return drizzleMembers.map(this.toDomainEntity);
  }

  /**
   * IDによるメンバー取得
   */
  async findById(id: string): Promise<MemberEntity | undefined> {
    const [drizzleMember] = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1);

    return drizzleMember ? this.toDomainEntity(drizzleMember) : undefined;
  }

  /**
   * メンバーを作成
   */
  async create(member: MemberEntity): Promise<MemberEntity> {
    const insertData: DrizzleMemberInsert = {
      id: member.id,
      name: member.name,
      role: member.role,
      email: member.email,
      joinDate: member.joinDate,
      profileImageUrl: member.profileImageUrl || null,
    };

    await db.insert(members).values(insertData);

    return member;
  }

  /**
   * メンバーを更新
   */
  async update(
    id: string,
    member: Partial<Omit<MemberEntity, "id">>,
  ): Promise<MemberEntity> {
    const updateData: Partial<DrizzleMemberInsert> = {
      ...(member.name !== undefined && { name: member.name }),
      ...(member.role !== undefined && { role: member.role }),
      ...(member.email !== undefined && { email: member.email }),
      ...(member.joinDate !== undefined && { joinDate: member.joinDate }),
      ...(member.profileImageUrl !== undefined && {
        profileImageUrl: member.profileImageUrl || null,
      }),
    };

    await db.update(members).set(updateData).where(eq(members.id, id));

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Member with id ${id} not found after update`);
    }

    return updated;
  }

  /**
   * メンバーを削除
   */
  async delete(id: string): Promise<void> {
    await db.delete(members).where(eq(members.id, id));
  }

  /**
   * Drizzleのメンバーデータをドメインエンティティに変換
   */
  private toDomainEntity(drizzleMember: DrizzleMember): MemberEntity {
    return {
      id: drizzleMember.id,
      name: drizzleMember.name,
      role: drizzleMember.role,
      email: drizzleMember.email,
      joinDate: drizzleMember.joinDate,
      profileImageUrl: drizzleMember.profileImageUrl ?? "",
    };
  }
}
```

### Step 3: Services Layer の実装

`src/services/memberService.ts`

```typescript
import type { MemberEntity } from "@/domain/entities/member";
import type { MemberRepository } from "@/domain/repositories/memberRepository";
import { DrizzleMemberRepository } from "@/infrastructure/db/repositories/drizzleMemberRepository";

/**
 * メンバーサービス
 * ビジネスロジックを担当
 */
export class MemberService {
  constructor(private repository: MemberRepository) {}

  /**
   * 全てのメンバーを取得
   */
  async getAllMembers(): Promise<MemberEntity[]> {
    return await this.repository.findAll();
  }

  /**
   * IDによるメンバー取得
   */
  async getMemberById(id: string): Promise<MemberEntity | undefined> {
    return await this.repository.findById(id);
  }

  /**
   * メンバーを作成
   */
  async createMember(member: MemberEntity): Promise<MemberEntity> {
    return await this.repository.create(member);
  }

  /**
   * メンバーを更新
   */
  async updateMember(
    id: string,
    member: Partial<Omit<MemberEntity, "id">>,
  ): Promise<MemberEntity> {
    return await this.repository.update(id, member);
  }

  /**
   * メンバーを削除
   */
  async deleteMember(id: string): Promise<void> {
    return await this.repository.delete(id);
  }
}

// デフォルトのサービスインスタンス（Drizzle実装を使用）
export const memberService = new MemberService(
  new DrizzleMemberRepository(),
);
```

### Step 4: App Layer での使用

`src/app/members/page.tsx`

```typescript
import { memberService } from "@/services/memberService";

export default async function MembersPage() {
  const members = await memberService.getAllMembers();

  return (
    <div>
      <h1>Members</h1>
      {members.map((member) => (
        <div key={member.id}>
          <h2>{member.name}</h2>
          <p>Role: {member.role}</p>
          <p>Email: {member.email}</p>
        </div>
      ))}
    </div>
  );
}
```

## Clean Architecture との統合

このプロジェクトではClean Architectureを採用しており、以下の依存関係ルールを守る必要があります：

### ✅ 許可される依存関係

- `app/` → `services/` → `domain/`
- `infrastructure/` → `domain/`

### ❌ 禁止される依存関係

- `domain/` → `infrastructure/`, `services/`, `app/`
- `services/` → `infrastructure/`, `app/`

### 依存性注入パターン

```typescript
// ✅ GOOD: サービスはリポジトリインターフェースに依存
export class MemberService {
  constructor(private repository: MemberRepository) {} // ← インターフェース
}

// ✅ GOOD: インフラストラクチャはドメインインターフェースを実装
export class DrizzleMemberRepository implements MemberRepository {
  // implementation
}

// ✅ GOOD: サービス層で依存関係を組み立て
export const memberService = new MemberService(new DrizzleMemberRepository());
```

## 実際の例：Eventテーブルの実装

現在のプロジェクトには、すでにEventテーブルの実装例があります：

### ファイル構造

```
src/
├── domain/
│   ├── entities/event.ts              # エンティティ定義
│   └── repositories/eventRepository.ts # リポジトリインターフェース
├── infrastructure/db/
│   ├── index.ts                       # データベース接続設定
│   ├── schema.ts                      # Drizzleスキーマ定義
│   └── repositories/
│       └── drizzleEventRepository.ts  # Drizzle実装
└── services/
    └── eventService.ts                # ビジネスロジック
```

### 主要な実装ポイント

1. **ドメインエンティティ** (`src/domain/entities/event.ts`)
   - 純粋なTypeScriptインターフェース
   - 外部依存関係なし

2. **リポジトリインターフェース** (`src/domain/repositories/eventRepository.ts`)
   - データアクセスの抽象化
   - 実装詳細に依存しない

3. **Drizzleスキーマ** (`src/infrastructure/db/schema.ts`)
   - PostgreSQLテーブル定義
   - 型安全性を保証
   - ENUM型の使用例

4. **Drizzle実装** (`src/infrastructure/db/repositories/drizzleEventRepository.ts`)
   - ドメインインターフェースの具体実装
   - DrizzleからDomainEntityへの変換処理

## マイグレーション

### スキーマ変更の生成

スキーマを変更した後、マイグレーションファイルを生成：

```bash
pnpm drzl:gen
```

### マイグレーションの実行

生成されたマイグレーションをデータベースに適用：

```bash
pnpm drzl:migrate
```

### Drizzle Studio

データベースの内容をブラウザで確認：

```bash
pnpm drzl:studio
```

## トラブルシューティング

### 環境変数が設定されていない

エラー: `NETLIFY_DATABASE_URL environment variable is not set`

**解決方法**:

- ローカル開発: `.env.local`に`NETLIFY_DATABASE_URL`または`DATABASE_URL`を設定
- Netlify: 環境変数設定で`NETLIFY_DATABASE_URL`を確認

### 接続エラー

エラー: `Connection refused` または `SSL connection required`

**解決方法**:

- 接続文字列に`?sslmode=require`が含まれているか確認
- Neon Dashboardで接続文字列を再確認

### マイグレーションエラー

エラー: `relation "table_name" does not exist`

**解決方法**:

- `pnpm drzl:gen`でマイグレーションファイルを生成
- `pnpm drzl:migrate`でマイグレーションを実行
