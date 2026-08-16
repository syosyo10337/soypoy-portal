# Cloudinary セットアップガイド

> **Note:** 以前はこのドキュメントは「管理画面からのCloudinary自動アップロード」フローの設定ガイドでした。DB削除・管理画面撤去の一環でそのアップロードフロー（`src/infrastructure/storage/cloudinaryUploader.ts`、`src/app/admin/events/create/_actions/uploadImage.ts`、サーバーサイドの`cloudinary`パッケージ、`CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET`環境変数）は削除されました。現在も生きている「画像表示」部分のみを残します。

## 📋 概要

画像はCloudinaryにホストされたものを**手動で**アップロードし、そのURLを `src/data/events.ts` の該当イベントの `thumbnail` フィールドに直接書き込みます。表示は `next-cloudinary` の `<CldImage>` コンポーネントが行います。

```
(手動) 画像をCloudinaryダッシュボードにアップロード → URLを src/data/events.ts に記載 → <CldImage> が表示
```

アップロードUI・アップロード用API・DBは存在しません。

## 🚀 セットアップ手順

### Step 1: Cloudinaryアカウント

このプロジェクト用のCloudinaryアカウント（Cloud Name）はチームで共有されています。新しいCloud Nameを使う場合のみ、<https://cloudinary.com/users/register_free> で新規登録してください。

### Step 2: 環境変数設定

`.env.local`（dotenvxで暗号化管理）に以下が設定されていることを確認してください。クライアントサイドの表示にのみ使用します。

```env
# Client-side display (next-cloudinary package)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

型定義は `src/types/cloudinary.d.ts` を参照。

### Step 3: 画像を追加する

1. <https://cloudinary.com/console/media_library> にアクセスし、画像をアップロード
2. アップロードされた画像のURL（`https://res.cloudinary.com/<cloud-name>/image/upload/...`）をコピー
3. `src/data/events.ts` の該当イベントの `thumbnail` フィールドにURLを設定してコミット

### Step 4: 表示の仕組み（実装済み・変更不要）

`next-cloudinary` の `<CldImage>` が `EventEntity.thumbnail` のURLを最適化して表示します。

```typescript
// src/app/(user)/events/[id]/_components/EventThumbnail.tsx
import { CldImage } from "next-cloudinary";

<CldImage
  src={src}
  alt={`${alt}のイベントサムネイル画像`}
  width={600}
  height={750}
  crop="fill"
  gravity="auto"
  preload
/>
```

同様の使用箇所: `src/app/(user)/events/_components/EventList/EventListItem.tsx`

## 📊 現在のデータ構造

```typescript
export interface EventEntity {
  id: string;
  thumbnail?: string | null;  // "https://res.cloudinary.com/..." または未設定
}
```

`thumbnail` が未設定の場合は `src/assets/no-image.png` にフォールバックします（`EventThumbnail`/`EventListItem` を参照）。

## 📚 参考リンク

- [Cloudinary公式ドキュメント](https://cloudinary.com/documentation)
- [Next.js + Cloudinary (next-cloudinary)](https://next.cloudinary.dev/)
- [画像最適化ガイド](https://cloudinary.com/documentation/image_optimization)
