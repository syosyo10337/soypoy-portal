# アーキテクチャと責務分離

## 🎯 層ごとの責務

### Domain層 (`src/domain/`)

**責務:**

- 純粋なビジネスルール
- エンティティ定義
- リポジトリインターフェース

**禁止事項:**

- ❌ フレームワークへの依存
- ❌ 外部ライブラリへの依存
- ❌ Infrastructure/Service/App層への依存

**例:**

```typescript
// ✅ GOOD: 純粋なエンティティ
export interface EventEntity {
  id: string;
  thumbnail?: string;  // URL文字列のみ
}

// ✅ GOOD: リポジトリインターフェース
export interface EventRepository {
  create(entity: EventEntity): Promise<EventEntity>;
}
```

---

### Infrastructure層 (`src/infrastructure/`)

**責務:**

- 外部システムとの連携
- データ永続化の具体実装
- バリデーションスキーマ
- 型変換

**サブレイヤー:**

#### 1. **Schemas** (`infrastructure/schemas/`)

```typescript
// ✅ 責務: バリデーション + 型変換のみ
export const requiredImageFieldSchema = z.discriminatedUnion(...);
export function extractExistingImageUrl(value: ImageFieldValue): string;

// ❌ 禁止: 外部APIアクセス
// export async function extractImageUrl() {
//   await uploadImageToCloudinary();  // NG!
// }
```

#### 2. **Storage** (`infrastructure/storage/`)

```typescript
// ✅ 責務: 外部ストレージとの連携
export async function uploadImageToCloudinary({ file }): Promise<string>;
export async function deleteImageFromCloudinary(url: string): Promise<void>;
```

#### 3. **Database** (`infrastructure/db/`)

```typescript
// ✅ 責務: DB操作の具体実装
export class DrizzleEventRepository implements EventRepository {
  async create(entity: EventEntity): Promise<EventEntity>;
}
```

#### 4. **tRPC** (`infrastructure/trpc/`)

```typescript
// ✅ 責務: API定義とルーティング
export const eventsRouter = router({
  create: publicProcedure.input(createEventSchema).mutation(...),
});
```

---

### Service層 (`src/services/`)

**責務:**

- ビジネスロジックのオーケストレーション
- 複数のInfrastructure層コンポーネントの組み合わせ
- トランザクション管理

**正しい実装例:**

```typescript
// ✅ GOOD: Service層がオーケストレーション
export class EventService {
  async createEvent(input: ...) {
    // 1. 画像の種類を判定 (Schema層のヘルパー使用)
    if (isNewImage(thumbnail) && thumbnail.type === "new") {
      // 2. 新規画像はアップロード (Storage層を使用)
      thumbnailUrl = await uploadImageToCloudinary({ file: thumbnail.file });
    } else {
      // 3. 既存画像はURL抽出 (Schema層のヘルパー使用)
      thumbnailUrl = extractExistingImageUrl(thumbnail);
    }

    // 4. DBに保存 (Repository層を使用)
    return await this.repository.create({
      thumbnail: thumbnailUrl,
      ...
    });
  }
}
```

**アンチパターン:**

```typescript
// ❌ BAD: Schema層がアップロード処理を持つ
// infrastructure/schemas/imageFieldSchema.ts
export async function extractImageUrl(value: ImageFieldValue) {
  if (value.type === "new") {
    return await uploadImageToCloudinary({ file: value.file });  // NG!
  }
}
```

**なぜダメ?**

- スキーマの責務: バリデーション + 型変換
- アップロードの責務: 外部ストレージ連携
- **単一責任の原則 (SRP) 違反**

---

### App層 (`src/app/`, `src/components/`)

**責務:**

- UI表示
- ユーザー操作のハンドリング
- フォーム管理

**例:**

```typescript
// ✅ GOOD: UIコンポーネント
export function EventThumbnailField({ control }) {
  return (
    <Controller
      render={({ field }) => (
        <ImageUploader
          value={imageFieldToImageValue(field.value)}
          onChange={(value) => field.onChange(imageValueToImageField(value))}
        />
      )}
    />
  );
}
```
