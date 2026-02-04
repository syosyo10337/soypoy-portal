# SOY-POY Event Renderer Specification

## 概要

構造化されたイベントデータから、2つの異なる出力形式を生成するレンダラーシステムの仕様。

```
┌─────────────────────────────────┐
│  構造化フォーム入力              │
│  (時間, 料金, 場所, 出演者...)   │
└────────────┬────────────────────┘
             │
      ┌──────┴──────┐
      ↓             ↓
┌──────────┐  ┌──────────────┐
│ Instagram │  │   Website    │
│ Renderer  │  │   Renderer   │
└─────┬────┘  └──────┬───────┘
      ↓              ↓
┌──────────┐  ┌──────────────┐
│ ■ 日時   │  │ 日時         │
│ 📍 場所  │  │ ─────────    │
│ #tag     │  │ (太字+下線)  │
└──────────┘  └──────────────┘
```

## 設計原則

1. **Structured Input**: ユーザーはフォームで構造化データを入力
2. **Dual Output**: 同じデータから Instagram/Website の2形式を生成
3. **Instagram Decoration**: Instagram出力は ■, 📍, # などの記号で装飾
4. **Website Simplicity**: Website出力は記号なし、シンプルな見出し（太字+下線）

---

## 1. 入力データ構造

### EventEntity（拡張後）

```typescript
interface EventEntity {
  // 基本情報
  id: string;
  title: string;
  date: string;                    // YYYY-MM-DD
  type: EventType;
  publicationStatus: PublicationStatus;
  thumbnail?: string | null;

  // 時間
  doorTime?: string;               // HH:MM
  startTime?: string;              // HH:MM
  endTime?: string;                // HH:MM

  // 料金
  pricing?: PricingTier[];

  // 場所
  venue?: Venue;

  // 説明（自由テキスト）
  description?: string;

  // 出演者
  performers?: Performer[];

  // ハッシュタグ
  hashtags?: string[];
}

interface PricingTier {
  label: string;      // "一般", "学生"
  amount: number;     // 1000
  note?: string;      // "ドリンク付き"
}

interface Venue {
  type: "preset" | "custom";
  presetId?: string;           // "soypoy"
  customName?: string;
  instagramHandle?: string;    // "robert.shimokitazawa" (without @)
}

interface Performer {
  name: string;
  role?: string;               // "MC", "ゲスト"
  instagramHandle?: string;    // "yamada_taro" (without @)
}
```

---

## 2. Instagram Renderer

### 出力フォーマット

Instagram用の装飾付きプレーンテキストを生成。

### 装飾ルール

| セクション | 装飾 | 例 |
|-----------|------|-----|
| タイトル | 【】 | 【第15回オープンマイク🎤】 |
| 見出し | ■ | ■ 日時 |
| 箇条書き | ・ | ・一般：¥1,000 |
| 場所 | 📍 | 📍 SOY-POY @handle |
| 区切り線 | ——— | ——— |
| ハッシュタグ | # | #soypoy #下北沢 |
| メンション | @ | @yamada_taro |

### 出力テンプレート

```
【{title}】

■ 日時
{date}（{weekday}）
{doorTime ? `開場｜${doorTime}` : ''}
{startTime ? `開始｜${startTime}` : ''}
{endTime ? `終了｜${endTime}` : ''}

■ 料金
{pricing.map(p => `・${p.label}：¥${p.amount}${p.note ? `（${p.note}）` : ''}`)}

■ 内容
{description}

■ 出演
{performers.map(p => `・${p.name}${p.role ? `（${p.role}）` : ''} ${p.instagramHandle ? `@${p.instagramHandle}` : ''}`)}

———

📍 {venue.name} {venue.instagramHandle ? `@${venue.instagramHandle}` : ''}

{hashtags.map(t => `#${t}`).join(' ')}
```

### 実装

```typescript
// src/utils/eventRenderers/instagramRenderer.ts

interface InstagramRenderOptions {
  includeHashtags?: boolean;      // default: true
  includeLocation?: boolean;      // default: true
  maxLength?: number;             // default: 2200
}

function renderInstagramCaption(
  event: EventEntity,
  options?: InstagramRenderOptions
): string {
  const lines: string[] = [];

  // タイトル
  lines.push(`【${event.title}】`);
  lines.push("");

  // 日時セクション
  if (event.date || event.doorTime || event.startTime) {
    lines.push("■ 日時");
    if (event.date) {
      lines.push(formatDateJapanese(event.date));
    }
    if (event.doorTime) {
      lines.push(`開場｜${event.doorTime}`);
    }
    if (event.startTime) {
      lines.push(`開始｜${event.startTime}`);
    }
    if (event.endTime) {
      lines.push(`終了｜${event.endTime}`);
    }
    lines.push("");
  }

  // 料金セクション
  if (event.pricing?.length) {
    lines.push("■ 料金");
    for (const tier of event.pricing) {
      const note = tier.note ? `（${tier.note}）` : "";
      lines.push(`・${tier.label}：¥${tier.amount.toLocaleString()}${note}`);
    }
    lines.push("");
  }

  // 内容セクション
  if (event.description) {
    lines.push("■ 内容");
    lines.push(event.description);
    lines.push("");
  }

  // 出演者セクション
  if (event.performers?.length) {
    lines.push("■ 出演");
    for (const p of event.performers) {
      const role = p.role ? `（${p.role}）` : "";
      const handle = p.instagramHandle ? ` @${p.instagramHandle}` : "";
      lines.push(`・${p.name}${role}${handle}`);
    }
    lines.push("");
  }

  // 区切り線
  lines.push("———");
  lines.push("");

  // 場所
  if (options?.includeLocation !== false && event.venue) {
    const venueName = getVenueName(event.venue);
    const handle = event.venue.instagramHandle
      ? `@${event.venue.instagramHandle}`
      : "";
    lines.push(`📍 ${venueName} ${handle}`.trim());
    lines.push("");
  }

  // ハッシュタグ
  if (options?.includeHashtags !== false && event.hashtags?.length) {
    lines.push(event.hashtags.map(tag => `#${tag}`).join(" "));
  }

  return lines.join("\n").trim();
}
```

---

## 3. Website Renderer

### 出力フォーマット

セマンティックHTMLを生成。装飾記号（■, 📍等）は**表示しない**。

### スタイリング

```css
/* 見出し: 太字 + 下線 */
.event-section-heading {
  font-weight: bold;
  border-bottom: 2px solid currentColor;
  padding-bottom: 0.25rem;
  margin-bottom: 0.5rem;
}
```

### 出力構造

```typescript
interface WebsiteRenderResult {
  sections: RenderSection[];
}

interface RenderSection {
  type: "time" | "pricing" | "description" | "performers" | "location";
  label: string;
  content: string;  // HTML string
}
```

### 出力例

```html
<article class="event-detail">
  <h1 class="event-title">第15回オープンマイク🎤</h1>

  <section class="event-section">
    <h2 class="event-section-heading">日時</h2>
    <div class="event-section-content">
      <time datetime="2025-01-24">2025年1月24日（土）</time>
      <dl class="time-list">
        <dt>開場</dt><dd>18:30</dd>
        <dt>開始</dt><dd>19:00</dd>
      </dl>
    </div>
  </section>

  <section class="event-section">
    <h2 class="event-section-heading">料金</h2>
    <div class="event-section-content">
      <ul class="pricing-list">
        <li>一般：¥1,000（ドリンク付き）</li>
        <li>学生：¥800</li>
      </ul>
    </div>
  </section>

  <section class="event-section">
    <h2 class="event-section-heading">内容</h2>
    <div class="event-section-content">
      <p>音楽、朗読、コント、ダンスなど...</p>
    </div>
  </section>

  <section class="event-section">
    <h2 class="event-section-heading">出演</h2>
    <div class="event-section-content">
      <ul class="performer-list">
        <li>
          <span class="performer-name">山田太郎</span>
          <span class="performer-role">MC</span>
        </li>
        <li>
          <span class="performer-name">鈴木花子</span>
        </li>
      </ul>
    </div>
  </section>

  <section class="event-section">
    <h2 class="event-section-heading">場所</h2>
    <div class="event-section-content">
      <address class="venue">SOY-POY</address>
    </div>
  </section>
</article>
```

### 実装

```typescript
// src/utils/eventRenderers/websiteRenderer.ts

function renderWebsiteContent(event: EventEntity): WebsiteRenderResult {
  const sections: RenderSection[] = [];

  // 日時セクション
  if (event.date || event.doorTime || event.startTime) {
    sections.push({
      type: "time",
      label: "日時",
      content: renderTimeSection(event),
    });
  }

  // 料金セクション
  if (event.pricing?.length) {
    sections.push({
      type: "pricing",
      label: "料金",
      content: renderPricingSection(event.pricing),
    });
  }

  // 内容セクション
  if (event.description) {
    sections.push({
      type: "description",
      label: "内容",
      content: `<p>${escapeHtml(event.description)}</p>`,
    });
  }

  // 出演者セクション
  if (event.performers?.length) {
    sections.push({
      type: "performers",
      label: "出演",
      content: renderPerformersSection(event.performers),
    });
  }

  // 場所セクション
  if (event.venue) {
    sections.push({
      type: "location",
      label: "場所",
      content: renderLocationSection(event.venue),
    });
  }

  return { sections };
}
```

---

## 4. 比較表

| 要素 | Instagram | Website |
|------|-----------|---------|
| タイトル | 【タイトル】 | `<h1>タイトル</h1>` |
| 見出し | ■ 日時 | **日時** + 下線 |
| 箇条書き | ・項目 | `<li>項目</li>` |
| 場所 | 📍 SOY-POY | SOY-POY（プレーン） |
| 時間 | 開場｜18:30 | `<dt>開場</dt><dd>18:30</dd>` |
| 料金 | ¥1,000 | ¥1,000 |
| 区切り | ——— | `<hr>` or なし |
| ハッシュタグ | #soypoy | 非表示 or リンク |
| @メンション | @handle | 非表示 or リンク |

---

## 5. プリセット定義

### 会場プリセット

```typescript
// src/domain/entities/event/venue.ts

export const PRESET_VENUES = {
  soypoy: {
    id: "soypoy",
    name: "SOY-POY",
    nameWithParent: "SOY-POY（ロバート下北沢）",
    instagramHandle: "robert.shimokitazawa",
    address: "東京都世田谷区北沢2-...",
  },
} as const;

export type PresetVenueId = keyof typeof PRESET_VENUES;
```

### デフォルトハッシュタグ

```typescript
export const DEFAULT_HASHTAGS = [
  "soypoy",
  "下北沢",
  "shimokitazawa",
] as const;

export const SUGGESTED_HASHTAGS = [
  "オープンマイク",
  "ライブ",
  "音楽",
  "イベント",
  "東京",
] as const;
```

---

## 6. バリデーション

### Instagram制限

| 制限項目 | 値 |
|---------|-----|
| キャプション文字数 | 2,200文字 |
| ハッシュタグ数 | 30個 |
| 1ハッシュタグの長さ | 制限なし（実用上100文字程度） |

### Zodスキーマ

```typescript
// 料金
const pricingTierSchema = z.object({
  label: z.string().min(1, "ラベルを入力してください"),
  amount: z.number().min(0, "金額は0以上"),
  note: z.string().optional(),
});

// 場所
const venueSchema = z.object({
  type: z.enum(["preset", "custom"]),
  presetId: z.string().optional(),
  customName: z.string().optional(),
  instagramHandle: z.string()
    .regex(/^[a-zA-Z0-9._]+$/)
    .optional(),
});

// 出演者
const performerSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  role: z.string().optional(),
  instagramHandle: z.string()
    .regex(/^[a-zA-Z0-9._]+$/)
    .optional(),
});

// ハッシュタグ（#なし）
const hashtagSchema = z.string()
  .min(1)
  .regex(/^[^#\s]+$/, "#やスペースは含めない");

// 時間（HH:MM）
const timeSchema = z.string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  .optional();
```

---

## 7. 説明文（description）の扱い

### 現状
- 単純なテキスト入力（1行）

### 改善後
- 複数行テキストエリア
- **マークアップは不要**（構造化フィールドが別にあるため）
- 自由記述エリアとして使用

### 説明文内のパース（オプション）

説明文内で以下のパターンを検出してもよい：

| パターン | 用途 |
|---------|------|
| `@username` | Instagram リンク化（Website） |
| `『タイトル』` | 作品タイトル強調 |

ただし、基本は**プレーンテキストとして扱う**。

---

## 8. 後方互換性

### 既存イベント

- 新フィールドはすべて `nullable`
- 既存の `description` はそのまま表示
- 構造化フィールドが `null` の場合はセクションをスキップ

### 表示ロジック

```typescript
function renderEvent(event: EventEntity) {
  // 構造化フィールドがあれば使用
  if (hasStructuredFields(event)) {
    return renderStructuredEvent(event);
  }

  // なければ従来の description をそのまま表示
  return renderLegacyEvent(event);
}

function hasStructuredFields(event: EventEntity): boolean {
  return !!(
    event.doorTime ||
    event.startTime ||
    event.pricing?.length ||
    event.venue ||
    event.performers?.length
  );
}
```

---

## 9. ファイル構成

```
src/
├── utils/
│   └── eventRenderers/
│       ├── index.ts
│       ├── instagramRenderer.ts    # Instagram出力生成
│       ├── websiteRenderer.ts      # Website HTML生成
│       └── helpers.ts              # 共通ヘルパー（日付フォーマット等）
│
├── domain/
│   └── entities/
│       └── event/
│           ├── index.ts            # EventEntity（拡張）
│           └── venue.ts            # プリセット定義
│
└── components/
    └── admin/
        └── EventFormFields/
            ├── EventTimeFields.tsx
            ├── EventPricingField.tsx
            ├── EventVenueField.tsx
            ├── EventPerformersField.tsx
            ├── EventHashtagsField.tsx
            └── EventDescriptionField.tsx  # Textarea化
```
