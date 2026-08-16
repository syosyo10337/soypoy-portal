# CLAUDE.md - AI Assistant Guide for SOY-POY Portal

This document provides essential context for AI assistants working on the SOY-POY Portal codebase.

## Project Overview

SOY-POY Portal is a Next.js web application for a community bar's event management platform. It is a public-facing website for event discovery; event/closed-day content is maintained by editing static data files directly (see [Static Event Data](#static-event-data)) rather than through an admin panel.

**Tech Stack:**

- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Data**: Static in-repo TypeScript data (`src/data/events.ts`, `src/data/closedDays.ts`) — no database, no admin panel. Events/closed-days are edited directly by committing to these files.
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Animation**: Motion (Framer Motion successor)
- **Image Management**: Cloudinary + Next Cloudinary
- **Env Management**: dotenvx (encrypted environment variables)
- **Linting/Formatting**: Biome (NOT ESLint/Prettier)
- **Package Manager**: pnpm

## Quick Commands

> **重要**: ローカルマシンから `pnpm` や `node` コマンドを直接実行しないでください。
> すべてのコマンドは `./bin/*` ラッパースクリプト経由でDockerコンテナ内で実行してください。
> AIアシスタントも同様に、`pnpm xxx` ではなく `./bin/pnpm xxx` や専用の `./bin/*` スクリプトを使用してください。

```bash
# Development
./bin/dev              # Start dev server (port 3000)
./bin/build            # Run production build locally

# Code Quality (use before commits)
./bin/check            # Run tsc + lint:fix + format
./bin/lint             # Lint only
./bin/lint:fix         # Lint with auto-fix
./bin/format           # Format code
./bin/pnpm tsc         # Type check

# General Purpose
./bin/pnpm [cmd]       # Run any pnpm command in container
./bin/node [file]      # Run Node.js script in container
./bin/runenv [cmd]     # Run command with dotenvx-decrypted env vars
```

## Architecture: Clean Architecture / DDD

This project follows Clean Architecture principles. **Respect dependency rules:**

```
src/
├── app/                 # Presentation Layer (Next.js routes)
├── components/          # Shared UI components
├── domain/              # Domain Layer (entities, repository interfaces)
│   ├── entities/        # Business models (EventEntity, ClosedDayEntity)
│   └── repositories/    # Data access interfaces
├── services/            # Application Layer (business logic)
├── infrastructure/      # Infrastructure Layer
│   └── static/          # Static-data repository implementations (src/data/*)
├── assets/              # Fonts, icons, styles
├── hooks/               # Custom React hooks
└── utils/               # Utility functions
```

### Dependency Rules

**Allowed:**

- `app/` → `services/` → `domain/`
- `infrastructure/` → `domain/`

**Forbidden:**

- `domain/` → anything (domain must be framework-agnostic)
- `services/` → `infrastructure/` (use dependency injection)

## Code Conventions

### File Organization

- Page-specific components go in `_components/` directory within that route
- Shared components go in `src/components/`
- Co-located assets use `assets/` subdirectory within component folder
- Use `Entity` suffix for domain models (e.g., `EventEntity`)
- Use `Repository` suffix for data interfaces (e.g., `EventRepository`)
- Use `Service` suffix for business logic classes (e.g., `EventService`)

### TypeScript

- Use `type` imports: `import type { X } from "..."`
- Path alias: `@/*` maps to `src/*`
- Prefer interfaces for entities, types for unions/utilities
- No inferrable type annotations (enforced by Biome)

### Biome Rules (Key Points)

- Double quotes for strings
- Semicolons required
- 2-space indentation
- No unused imports/variables (error)
- Self-closing elements required
- Organize imports automatically

### Styling

- Use Tailwind CSS utility classes
- Use `cn()` utility from `@/utils/cn` for conditional classes
- shadcn/ui components are in `src/components/shadcn/`
- Custom CSS files in `src/assets/styles/` for animations

**Color Theme:**

- Main: `#F3F0E6` (beige)
- Secondary: `#000000` (black)
- Accent: `#F0433C` (red)
- Muted: `#8E8E8E` (gray)

### Date Handling

- Use Luxon for date operations (not date-fns for complex operations)
- Timezone: Asia/Tokyo (hardcoded)
- Import utility: `import { dateTimeFromISO } from "@/utils/date"`
- Data storage: `EventEntity.date` / `ClosedDayEntity.date` are plain `YYYY-MM-DD` strings in `src/data/*.ts`

## Static Event Data

Events and closed days are **not** stored in a database — they live as plain TypeScript arrays, typed against the domain entities:

- `src/data/events.ts` — `export const events: EventEntity[]`
- `src/data/closedDays.ts` — `export const closedDays: ClosedDayEntity[]`

To add, edit, or remove an event or closed day, edit these files directly and open a PR — there is no admin panel and no migration step. `src/infrastructure/static/staticEventRepository.ts` / `staticClosedDayRepository.ts` read from these arrays; `src/services/eventService.ts` / `closedDayService.ts` contain the business logic (e.g. pickup-event backfill logic in `EventService.getPickupEvents()`). See `EventEntity` in `src/domain/entities/event/index.ts` for the exact shape (required fields, `EventType`/`PublicationStatus` enum values).

## Important Notes

### Language

- Comments in code are primarily in Japanese
- Documentation in `/docs` is in Japanese
- The team communicates in Japanese

### Environment Variables

The project uses **dotenvx** for encrypted environment variable management:

**Setup:**

1. Obtain `.env.keys` file from team lead (contains decryption keys)
2. Place in project root (automatically gitignored)
3. `.env.local` is already in repo (encrypted)
4. Environment variables are auto-decrypted when running `pnpm dev` or `./bin/dev`

**Key Variables:**

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name, used by `next-cloudinary`/`CldImage` to serve event thumbnails

**Managing Variables:**

```bash
# View environment variables
npx dotenvx get -f .env.local

# Add/update variable
npx dotenvx set NEW_VAR "value" -f .env.local

# Get specific variable
npx dotenvx get NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME -f .env.local
```

**Important:** Always commit `.env.local` after changes (it's encrypted and safe to commit)

### Testing

No test framework is currently configured. Code quality is maintained through:

- TypeScript strict mode
- Biome linting

### Don't Forget

- Run `./bin/check` before committing (type check + lint + format)
- **Never run `pnpm` directly on the host** — always use `./bin/*` wrapper scripts
- Use `./bin/dev` to start development server (auto-handles env decryption)
- SVGs are transformed to React components via SVGR webpack loader
- Event/closed-day `id`s are just unique strings hand-typed in `src/data/*.ts` — no generator is run
- Event thumbnails are Cloudinary URLs (uploaded manually via the Cloudinary dashboard) referenced in `src/data/events.ts`; display uses `next-cloudinary`'s `<CldImage>` component
- Animations use Motion library (Framer Motion's successor)
- `EventEntity.date` / `ClosedDayEntity.date` are plain `YYYY-MM-DD` strings in the data files (not DB timestamps)

## Common Tasks

### Add a New Page

1. Create route in `src/app/(user)/[route-name]/page.tsx`
2. Add page-specific components in `_components/` subdirectory
3. Use services from `src/services/` for data fetching

### Add a New UI Component

1. For shadcn components: Add to `src/components/shadcn/`
2. For custom shared components: Add to `src/components/[ComponentName]/`
3. Use Tailwind + `cn()` utility for styling
4. For animations: Use Motion library components

### Add an Event Thumbnail

1. Upload the image to Cloudinary manually (dashboard or `next-cloudinary` upload tooling outside the app) — there is no in-app upload flow
2. Set the resulting URL as the `thumbnail` field of the event in `src/data/events.ts`
3. Display uses the existing `<CldImage>` usages (e.g. `src/app/(user)/events/_components/EventList/EventListItem.tsx`)

### Modify Event Types

1. Update the `EventType` enum in `src/domain/entities/event/eventType.ts`
2. Update any events in `src/data/events.ts` that need the new/changed type

## Related Documentation

- `README.md` - Setup instructions and basic usage
- `docs/project-structure.md` - Detailed directory structure
- `.github/copilot-instructions.md` - Code review style guide
