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

// ✅ GOOD: リポジトリインターフェース（読み取り専用。データは静的ファイル管理のため書き込みメソッドはない）
export interface EventRepository {
  list(): Promise<EventEntity[]>;
  findById(id: string): Promise<EventEntity | undefined>;
}
```

---

### Infrastructure層 (`src/infrastructure/`)

**責務:**

- ドメインのリポジトリインターフェースの具体実装
- データアクセス（DBはなく、`src/data/`配下の静的TypeScriptファイルを読み込むのみ）

**サブレイヤー:**

#### **Static** (`infrastructure/static/`)

```typescript
// ✅ 責務: src/data/*.ts の配列をリポジトリインターフェース経由で返すだけ
export class StaticEventRepository implements EventRepository {
  async list(): Promise<EventEntity[]> {
    return events; // src/data/events.ts の配列
  }
}
```

- DB接続・外部API呼び出し・バリデーションは行わない（データは`src/data/`の時点で型チェック済み）
- かつて存在した`infrastructure/db/`（Drizzle）、`infrastructure/trpc/`（tRPCルーター/Zodスキーマ）、`infrastructure/refine/`（Refineデータプロバイダー）、`infrastructure/storage/`（Cloudinaryアップロード）はDB削除・管理画面撤去に伴い削除済み

---

### Service層 (`src/services/`)

**責務:**

- ビジネスロジックのオーケストレーション
- 複数のRepositoryの組み合わせ

**実装例:**

```typescript
// ✅ GOOD: Service層はRepositoryから受け取ったデータにビジネスロジックを適用するだけ
export class EventService {
  constructor(private repository: EventRepository) {}

  async getPickupEvents(): Promise<EventEntity[]> {
    // 1. ピックアップ指定のイベントを取得
    const pickupEvents = await this.repository.listPickup();
    if (pickupEvents.length >= PICKUP_EVENTS_LIMIT) {
      return pickupEvents;
    }
    // 2. 不足分は直近の公開イベントで埋める（フォールバックのオーケストレーション）
    const remaining = PICKUP_EVENTS_LIMIT - pickupEvents.length;
    const fallbackEvents = await this.repository.listLatestPublished(
      remaining,
      pickupEvents.map((e) => e.id),
    );
    return [...pickupEvents, ...fallbackEvents];
  }
}
```

DBやtRPCがあった当時はService層がアップロード処理（Storage層）とバリデーション（Schema層）のオーケストレーションも担っていたが、静的データ化に伴いその役割は不要になった。現在はRepositoryから返る`EventEntity[]`に対する純粋なビジネスロジック（ピックアップ件数のフォールバックなど）のみを担う。

---

### App層 (`src/app/`, `src/components/`)

**責務:**

- UI表示
- ユーザー操作のハンドリング

**例:**

```typescript
// ✅ GOOD: UIコンポーネント（src/app/(user)/events/_components/EventList/EventListItem.tsx）
export function EventListItem({ event }: { event: EventEntity }) {
  return (
    <Link href={`/events/${event.id}`}>
      <CldImage src={event.thumbnail} alt={event.title} width={...} height={...} />
      {/* ... */}
    </Link>
  );
}
```

管理画面（フォーム入力・画像アップロードUI）は削除済み。イベントの追加・編集は`src/data/events.ts`を直接コミットして行うため、App層に入力フォームは存在しない。
