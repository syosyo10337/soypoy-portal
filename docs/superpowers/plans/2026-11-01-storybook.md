# Storybook 導入 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 共有 UI コンポーネントをアプリや DB なしで単体確認できる Storybook を導入し、CI でビルドを検証する。

**Architecture:** `@storybook/nextjs-vite` を Docker コンテナ内で動かし、ポート 6006 を公開する。Story はコンポーネントの隣に置き、`.storybook/preview.ts` で `layout.tsx` と同じフォントと背景を再現する。CI には独立した `Storybook ビルド` ジョブを追加する。

**Tech Stack:** Storybook / `@storybook/nextjs-vite` / Vite / Next.js 16 / Tailwind CSS v4 / GitHub Actions

**Spec:** `docs/superpowers/specs/2026-11-01-storybook-design.md`

---

## 前提

- OrbStack を起動し、`docker compose ps` が成功する状態にする
- このリポジトリにテストフレームワークはないため、検証は `build-storybook`、`./bin/check`、ブラウザでの表示確認で行う
- `pnpm` や `node` をホストで直接実行しない。必ず `./bin/*` を使う
- `git add` は各タスクに書かれたファイルだけを指定する。未コミットの `src/app/admin/(authenticated)/admins/(list)/_components/AdminsTable/index.tsx` と `docs/superpowers/plans/2026-08-16-staticize-event-data.md` は含めない
- すべてのコミットメッセージの末尾に次の行を付ける

```text
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

## ファイル構成

| ファイル | 操作 | 責務 |
| --- | --- | --- |
| `package.json`, `pnpm-lock.yaml` | 変更 | 依存関係と script |
| `.storybook/main.ts` | 作成 | Story の探索範囲、フレームワーク、addon |
| `.storybook/preview.ts` | 作成 | グローバル CSS、フォント、背景、Next.js 設定 |
| `compose.yml` | 変更 | ポート 6006 の公開 |
| `bin/storybook` | 作成 | コンテナ内で Storybook を起動 |
| `bin/README.md` | 変更 | コマンドの説明 |
| `tsconfig.json` | 変更 | `.storybook` を型チェック対象に追加 |
| `.gitignore`, `biome.json` | 変更 | `storybook-static` の除外 |
| `src/components/shadcn/button.stories.tsx` | 作成 | Tailwind とバリアントの確認 |
| `src/components/BubleLabel/index.stories.tsx` | 作成 | `next/image` と静的画像の確認 |
| `src/components/PageTitle/index.stories.tsx` | 作成 | カスタムフォントの確認 |
| `.github/workflows/ci.yml` | 変更 | `Storybook ビルド` ジョブ |
| `CLAUDE.md` | 変更 | コマンド、配置ルール、古い記述の修正 |

---

### Task 1: 作業ブランチの作成

**Files:**
- Commit: `docs/superpowers/specs/2026-11-01-storybook-design.md`
- Commit: `docs/superpowers/plans/2026-11-01-storybook.md`

- [ ] **Step 1: ブランチを切る**

```bash
git switch -c feat/storybook
```

- [ ] **Step 2: spec とプランをコミットする**

```bash
git add docs/superpowers/specs/2026-11-01-storybook-design.md docs/superpowers/plans/2026-11-01-storybook.md
git commit -m "docs: Storybook 導入の設計とプランを追加"
```

---

### Task 2: 依存関係のインストールと互換性確認

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: 依存関係を追加する**

```bash
./bin/pnpm add -D storybook @storybook/nextjs-vite @storybook/addon-docs vite
```

Expected: 4 パッケージが `devDependencies` に追加される。

- [ ] **Step 2: Next.js 16 に対応していることを確認する**

```bash
./bin/pnpm view @storybook/nextjs-vite@$(./bin/pnpm list @storybook/nextjs-vite --depth 0 --json | grep -o '"version": "[^"]*"' | head -1 | cut -d'"' -f4) peerDependencies
```

Expected: `next` の範囲に `^16` が含まれる。また、Step 1 の出力に `next` や `vite` の peer dependency 警告がない。

含まれない場合はここで実装を止め、ユーザーに報告して方針を見直す。

- [ ] **Step 3: script を追加する**

`package.json` の `scripts` の `"drzl:studio"` の行を次の 3 行に置き換える。

```json
    "drzl:studio": "./bin/runenv drizzle-kit studio --host 0.0.0.0",
    "storybook": "storybook dev -p 6006 --host 0.0.0.0 --no-open",
    "build-storybook": "storybook build"
```

- [ ] **Step 4: コミットする**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore(deps): Storybook を追加"
```

---

### Task 3: Storybook の設定

**Files:**
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`
- Modify: `tsconfig.json`
- Modify: `.gitignore`
- Modify: `biome.json`

- [ ] **Step 1: `.storybook/main.ts` を作成する**

```ts
import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  framework: "@storybook/nextjs-vite",
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs"],
};

export default config;
```

- [ ] **Step 2: `.storybook/preview.ts` を作成する**

```ts
import type { Preview } from "@storybook/nextjs-vite";
import "@/assets/styles/globals.css";
import {
  anymale,
  bernardMT,
  bricolageGrotesque,
  notoSansJP,
  shipporiMincho,
  zenOldMincho,
} from "@/assets/fonts";

// src/app/layout.tsx の <html> と <body> に合わせる
// Dialog などのポータルにも効くよう、decorator の要素ではなくドキュメントに付与する
document.documentElement.classList.add(
  bricolageGrotesque.variable,
  notoSansJP.variable,
  anymale.variable,
  bernardMT.variable,
  zenOldMincho.variable,
  shipporiMincho.variable,
);
document.body.classList.add(
  "antialiased",
  "font-noto-sans-jp",
  "bg-soypoy-main",
);

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
```

- [ ] **Step 3: `tsconfig.json` の `include` に追加する**

`".next/dev/types/**/*.ts"` の行を次の 2 行に置き換える。

```json
    ".next/dev/types/**/*.ts",
    ".storybook/**/*"
```

- [ ] **Step 4: `.gitignore` に追加する**

`# production` の `/build` の次の行に追加する。

```text
/storybook-static
```

- [ ] **Step 5: `biome.json` の除外に追加する**

`"!**/build",` の次の行に追加する。

```json
      "!**/storybook-static",
```

- [ ] **Step 6: 型と lint を確認する**

```bash
./bin/check
```

Expected: エラーなく終了する。

```bash
./bin/pnpm biome lint .storybook
```

Expected: `Checked 2 files` と表示される。対象が 0 件の場合は `biome.json` の `files.includes` を見直す。

- [ ] **Step 7: コミットする**

```bash
git add .storybook tsconfig.json .gitignore biome.json
git commit -m "feat(storybook): Storybook の設定を追加"
```

---

### Task 4: Story の追加とビルド確認

**Files:**
- Create: `src/components/shadcn/button.stories.tsx`
- Create: `src/components/BubleLabel/index.stories.tsx`
- Create: `src/components/PageTitle/index.stories.tsx`

- [ ] **Step 1: `src/components/shadcn/button.stories.tsx` を作成する**

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const meta = {
  title: "shadcn/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "ボタン",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = {
  args: { variant: "destructive" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
```

- [ ] **Step 2: `src/components/BubleLabel/index.stories.tsx` を作成する**

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EventType } from "@/domain/entities";
import { BubleLabel } from ".";

const meta = {
  title: "Components/BubleLabel",
  component: BubleLabel,
  tags: ["autodocs"],
  args: {
    variant: EventType.Music,
    size: 48,
  },
  argTypes: {
    variant: {
      control: "select",
      options: Object.values(EventType),
    },
  },
} satisfies Meta<typeof BubleLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: ({ size }) => (
    <div className="flex flex-wrap gap-4">
      {Object.values(EventType).map((variant) => (
        <BubleLabel key={variant} variant={variant} size={size} />
      ))}
    </div>
  ),
};
```

- [ ] **Step 3: `src/components/PageTitle/index.stories.tsx` を作成する**

```tsx
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PageTitle } from ".";

const meta = {
  title: "Components/PageTitle",
  component: PageTitle,
  tags: ["autodocs"],
  args: {
    title: "Events",
  },
} satisfies Meta<typeof PageTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  args: { subtitle: "Schedule" },
};
```

- [ ] **Step 4: Storybook をビルドする**

```bash
./bin/pnpm build-storybook
```

Expected: `storybook-static` が生成され、エラーなく終了する。

- [ ] **Step 5: 型、lint、format を確認する**

```bash
./bin/check
```

Expected: エラーなく終了する。

- [ ] **Step 6: コミットする**

```bash
git add src/components/shadcn/button.stories.tsx src/components/BubleLabel/index.stories.tsx src/components/PageTitle/index.stories.tsx
git commit -m "feat(storybook): Button、BubleLabel、PageTitle の Story を追加"
```

---

### Task 5: Docker と起動コマンド

**Files:**
- Modify: `compose.yml`
- Create: `bin/storybook`
- Modify: `bin/README.md`

- [ ] **Step 1: `compose.yml` の `ports` に追加する**

`- "4983:4983"` の次の行に追加する。

```yaml
      - "6006:6006"
```

- [ ] **Step 2: `bin/storybook` を作成する**

```bash
#!/bin/bash

# Storybookをdocker compose経由で起動するシェルスクリプト
# 使用方法: ./bin/storybook
#
# ./bin/pnpm の一時コンテナはポートを公開しないため、
# 停止中は --service-ports 付きで起動する

set -euo pipefail

CONTAINER_RUNNING=$(docker compose ps --status running --services | grep app || true)

echo "🔹 Storybook: http://localhost:6006"

if [ -z "$CONTAINER_RUNNING" ]; then
  docker compose run --rm --service-ports app pnpm storybook
else
  docker compose exec app pnpm storybook
fi
```

- [ ] **Step 3: 実行権限を付ける**

```bash
chmod +x bin/storybook
```

- [ ] **Step 4: `bin/README.md` に追記する**

``- `./bin/dev`: コンテナ内で開発サーバーを起動します`` の次の行に追加する。

```markdown
- `./bin/storybook`: コンテナ内で Storybook を起動します（port 6006）
```

- [ ] **Step 5: 起動中のコンテナがあれば再作成する**

```bash
docker compose ps --status running --services
```

`app` が表示された場合だけ、ポートを反映するために次を実行する。

```bash
docker compose up -d --force-recreate app
```

- [ ] **Step 6: Storybook を起動してブラウザで確認する**

`./bin/storybook` をバックグラウンドで起動し、`http://localhost:6006` を開く。

Expected:

- サイドバーに `shadcn/Button`、`Components/BubleLabel`、`Components/PageTitle` が表示される
- `Button` に Tailwind のスタイルが適用されている
- `BubleLabel` の `AllVariants` で全画像が表示される
- `PageTitle` の見出しが AnyMale、サブタイトルが Bernard MT で表示され、背景がベージュ（`#F3F0E6`）である
- ブラウザのコンソールにエラーが出ていない

確認後、起動した Storybook を停止する。

- [ ] **Step 7: コミットする**

```bash
git add compose.yml bin/storybook bin/README.md
git commit -m "feat(storybook): Docker の起動コマンドを追加"
```

---

### Task 6: CI ジョブの追加

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: `jobs` の末尾に `storybook` ジョブを追加する**

`run: pnpm format:check` の次に、空行を挟んで追加する。

```yaml

  storybook:
    name: Storybook ビルド
    runs-on: ubuntu-latest
    permissions:
      contents: read

    steps:
      - uses: actions/checkout@v6

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v6
        with:
          node-version-file: ".node-version"
          cache: "pnpm"

      - run: pnpm install --frozen-lockfile

      - name: Storybook ビルド
        run: pnpm build-storybook
```

- [ ] **Step 2: コミットする**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: Storybook ビルドのジョブを追加"
```

ジョブの実行結果は PR を作成したときに確認する。

---

### Task 7: ドキュメントの更新

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: 古いフレームワークの記述を直す**

```markdown
- **Framework**: Next.js 15 (App Router) + React 19
```

を次に置き換える。

```markdown
- **Framework**: Next.js 16 (App Router) + React 19
```

- [ ] **Step 2: コマンドを追加する**

`./bin/build            # Run production build locally` の次の行に追加する。

```bash
./bin/storybook        # Start Storybook (port 6006)
```

- [ ] **Step 3: Story の配置ルールを追加する**

``- Co-located assets use `assets/` subdirectory within component folder`` の次の行に追加する。

```markdown
- Stories are co-located with their component as `*.stories.tsx`
```

- [ ] **Step 4: SVGR の記述を削除する**

次の行を削除する。

```markdown
- SVGs are transformed to React components via SVGR webpack loader
```

- [ ] **Step 5: コミットする**

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md に Storybook の情報を追加"
```

---

### Task 8: 最終確認

- [ ] **Step 1: 全体を確認する**

```bash
./bin/check
```

Expected: エラーなく終了する。

```bash
./bin/pnpm build-storybook
```

Expected: エラーなく終了する。

- [ ] **Step 2: 生成物と無関係な変更がコミットされていないことを確認する**

```bash
git status --short
```

Expected: `storybook-static` が表示されず、`AdminsTable/index.tsx` と `2026-08-16-staticize-event-data.md` は未コミットのまま残っている。

```bash
git diff --stat main...HEAD
```

Expected: 「ファイル構成」の表と spec、プランのファイルだけが表示される。
