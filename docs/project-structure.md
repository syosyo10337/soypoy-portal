# Project Structure

## ディレクトリ構成

### ルートディレクトリ

```
/
├── bin/                    # 開発用スクリプト
├── docker/                 # Docker設定
├── docs/                   # プロジェクトドキュメント
├── public/                 # 静的ファイル（cssのurlで利用するものなど）
├── src/                   # ソースコード
└── 設定ファイル群
```

### ソースコード構成 (`/src/`)

#### 1. App Router (`/src/app/`) - プレゼンテーション層

Next.js App Routerを使用したUI層。ページとコンポーネントを管理。

```
app/
├── (user)/                # ユーザー向けページ（ルートグループ）
│   ├── (home)/            # ホームページ（ネストされたルートグループ）
│   │   ├── _components/   # ホームページ専用コンポーネント
│   │   │   ├── HeroSection/
│   │   │   ├── PickUpSection/
│   │   │   └── WhatUpSection/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── about/             # アバウトページ
│   ├── events/            # イベント一覧ページ
│   │   └── _components/   # イベントページ専用コンポーネント
│   ├── whats-up/          # What's Upページ
│   └── layout.tsx         # ユーザー向けレイアウト（Header/Footer）
├── admin/                 # 管理画面（Refine）
│   ├── events/            # イベント管理
│   │   ├── (list)/        # 一覧表示
│   │   ├── [id]/          # 詳細・編集
│   │   │   ├── edit/
│   │   │   └── page.tsx
│   │   └── create/        # 新規作成
│   ├── layout.tsx         # 管理画面レイアウト
│   ├── loading.tsx
│   └── page.tsx
├── api/                   # API Routes
│   └── trpc/              # tRPC API
│       └── [trpc]/
│           └── route.ts
├── layout.tsx             # ルートレイアウト
└── not-found.tsx          # 404ページ
```

**特徴**:

- ルートグループで`(user)`と`admin`を明確に分離
- ページごとに専用コンポーネントを`_components/`に配置
- ネストされたルートグループ`(user)/(home)`でルートページを管理
- 管理画面はRefineフレームワークを使用
- tRPC APIは`/api/trpc`エンドポイントで提供

#### 2. Domain層 (`/src/domain/`) - ドメイン層

ビジネスエンティティとリポジトリインターフェースを定義。

```
domain/
├── entities/              # ドメインエンティティ
│   ├── event.ts          # イベントエンティティ
│   └── eventType.ts      # イベントタイプエンティティ
└── repositories/          # リポジトリインターフェース
    └── eventRepository.ts # イベントリポジトリインターフェース
```

**特徴**:

- 外部依存なし（フレームワーク非依存）
- ビジネスルールを表現
- リポジトリパターンでデータアクセスを抽象化

#### 3. Services層 (`/src/services/`) - アプリケーション層

ビジネスロジックとユースケースを実装。

```
services/
└── eventService.ts        # イベントサービス
```

**特徴**:

- ドメイン層のみに依存
- ビジネスロジックを担当
- リポジトリを依存性注入で受け取る

#### 4. Infrastructure層 (`/src/infrastructure/`) - インフラストラクチャ層

外部システム（Neon Database + Drizzle ORM）との接続を実装。

```
infrastructure/
├── db/                    # Neon Database + Drizzle実装
│   ├── index.ts           # データベース接続設定
│   ├── schema.ts          # Drizzleスキーマ定義
│   └── repositories/      # リポジトリ実装
│       └── drizzleEventRepository.ts
├── trpc/                  # tRPC設定
│   ├── context.ts         # tRPCコンテキスト
│   ├── router.ts          # ルーター統合
│   ├── routers/           # ルーター実装
│   └── schemas/           # Zodスキーマ
└── refine/                # Refine設定
    └── data-provider.ts   # Refineデータプロバイダー
```

**特徴**:

- ドメインのリポジトリインターフェースを実装
- Neon Database（PostgreSQL）との接続を担当
- Drizzle ORMを使用した型安全なデータアクセス
- データ変換とエラーハンドリング

#### 5. 共通リソース

##### Components (`/src/components/`) - 共通コンポーネント

```
components/
├── admin/                 # 管理画面専用コンポーネント
│   ├── AdminSidebar.tsx
│   ├── EventFormFields/   # イベントフォームフィールド
│   └── EventStatusBadge.tsx
├── BubleLabel/            # バブルラベルコンポーネント
├── Footer/                # フッターコンポーネント
├── Header/                # ヘッダーコンポーネント
├── refine-ui/             # Refine用カスタムUIコンポーネント
│   ├── buttons/           # アクションボタン（create, edit, delete等）
│   ├── form/              # フォーム関連（自動保存インジケーター等）
│   ├── layout/            # レイアウト（パンくず、ローディング等）
│   └── views/             # ビュー（list, create, edit, show）
└── shadcn/                # shadcn/uiコンポーネント
```

##### Assets (`/src/assets/`) - 共通アセット

```
assets/
├── fonts/                 # フォントファイル
│   ├── anymale/
│   └── bernard/
├── icons/                 # アイコンファイル
├── globals.css            # グローバルスタイル
└── no-image.png          # デフォルト画像
```

##### Utils (`/src/utils/`) - ユーティリティ

```text
utils/
├── cn.ts                  # className結合ユーティリティ
└── date.ts                # 日付処理ユーティリティ
```

##### Constant (`/src/constant/`) - 定数

```text
constant/
├── adminRoleLabel.ts      # 管理者ロールラベル
├── eventPublicationStatusLabel.ts  # 公開ステータスラベル
└── pickupEvents.ts        # ピックアップイベント定数
```

##### Types (`/src/types/`) - 型定義

```text
types/
└── svg.d.ts              # SVG型定義
```

## Clean Architecture 依存関係ルール

### 基本原則: **依存は常に中心（domain）に向かう**

```
┌─────────────────────────────────────────────┐
│  app/ (Presentation Layer) - 最外層         │
│    ↓ 依存OK                                 │
│  ┌───────────────────────────────────────┐ │
│  │  infrastructure/ (Infrastructure)    │ │  外層
│  │    ↓ 依存OK                           │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │  services/ (Application)        │ │ │  中間層
│  │  │    ↓ 依存OK                     │ │ │
│  │  │  ┌───────────────────────────┐ │ │ │
│  │  │  │  domain/ (Domain)        │ │ │ │  核心
│  │  │  └───────────────────────────┘ │ │ │
│  │  └─────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

❌ 逆方向の依存は禁止（内側が外側に依存してはいけない）
```

### ✅ 許可された依存関係（外側 → 内側）

```
app/           → services/        ✅ (外→中)
app/           → domain/          ✅ (外→核心)
app/           → infrastructure/  ✅ (同層)
services/      → domain/          ✅ (中→核心)
infrastructure/ → domain/         ✅ (外→核心)
infrastructure/ → services/       ✅ (外→中)
```

**重要**: どの層も**より内側の層**に依存できるが、**外側の層**には依存できない

### ❌ 禁止された依存関係（内側 → 外側）

```
domain/        → services/        ❌ (核心→中)
domain/        → infrastructure/  ❌ (核心→外)
domain/        → app/             ❌ (核心→最外)
services/      → infrastructure/  ❌ (中→外) ※依存性注入で回避
services/      → app/             ❌ (中→最外)
```

**理由**: 内側の層は外側の層の実装詳細を知ってはいけない（ビジネスロジックの独立性を保つ）

## ファイル配置の特徴

### 1. フロントエンドの最小化

- ページごとに専用コンポーネントを`_components/`に配置
- 共通コンポーネントは`/src/components/`に集約
- アセットは用途別に適切に配置

### 2. 静的ファイルの配置

- **`/public/layouts/`**: 背景画像などレイアウト用の画像
- **`/src/assets/`**: アプリケーション内で使用するアセット
- **`/src/components/*/assets/`**: コンポーネント専用のアセット
