# CLAUDE.md - AI Assistant Guide for SOY-POY Portal

This document provides essential context for AI assistants working on the SOY-POY Portal codebase.

## Project Overview

SOY-POY Portal is a full-stack web application for a community bar's event management platform. It features a public-facing website for event discovery and an admin panel for content management.

**Tech Stack:**
- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL (Neon serverless) + Drizzle ORM
- **API**: tRPC for type-safe client-server communication
- **Authentication**: Better Auth (admin authentication with role-based access)
- **Admin**: Refine framework with custom components
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Animation**: Motion (Framer Motion successor)
- **Image Management**: Cloudinary + Next Cloudinary
- **Env Management**: dotenvx (encrypted environment variables)
- **Linting/Formatting**: Biome (NOT ESLint/Prettier)
- **Package Manager**: pnpm

## Quick Commands

```bash
# Development
pnpm dev              # Start dev server with dotenvx (port 3000)
./bin/dev             # Start via Docker container (recommended)

# Code Quality
pnpm check            # Run tsc + lint:fix + format (use before commits)
pnpm lint             # Lint only
pnpm lint:fix         # Lint with auto-fix
pnpm format           # Format code
pnpm tsc              # Type check

# Database
pnpm db:migrate       # Apply migrations (used in production build)
pnpm db:seed          # Seed database with initial data
pnpm drzl:gen         # Generate migrations after schema changes
pnpm drzl:migrate     # Apply migrations to database
pnpm drzl:studio      # Open Drizzle Studio GUI

# Docker Wrapper Scripts (from host machine)
./bin/check           # Run code quality checks in container
./bin/lint            # Lint in container
./bin/format          # Format in container
./bin/pnpm [cmd]      # Run any pnpm command in container
./bin/node [file]     # Run Node.js script in container
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
│   ├── db/              # Drizzle ORM + PostgreSQL
│   ├── trpc/            # tRPC routers and schemas
│   └── refine/          # Refine data provider
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
- Database storage: `timestamp with timezone` type
- Convert between Date objects and database timestamps as needed

## tRPC API Structure

### Available Routers

**Events Router (`events.*`):**
- `events.list` - Get all published events
- `events.listByMonth({ year, month })` - Get events for specific month
- `events.getById(id)` - Get single event
- `events.create(data)` - Create new event (requires admin auth)
- `events.update({ id, data })` - Update event (requires admin auth)
- `events.delete(id)` - Delete event (requires admin auth)

**Closed Days Router (`closedDays.*`):**
- `closedDays.listByMonth({ year, month })` - Get closed days for month

**Admins Router (`admins.*`):** (requires admin authentication)
- `admins.list` - Get all admin users
- `admins.getById(id)` - Get single admin user
- `admins.create(data)` - Create new admin (SuperAdmin only)
- `admins.update({ id, data })` - Update admin (SuperAdmin only)
- `admins.delete(id)` - Delete admin (SuperAdmin only)
- `admins.resetPassword({ userId })` - Reset admin password (SuperAdmin only)

**Auth Router (`auth.*`):** (requires admin authentication)
- `auth.changePassword({ oldPassword, newPassword })` - Change own password

### Adding New API Routes

1. Define Zod schema in `src/infrastructure/trpc/schemas/`
2. Create router in `src/infrastructure/trpc/routers/`
3. Add to main router in `src/infrastructure/trpc/router.ts`
4. Services are injected via tRPC context

## Database Schema

### Tables

**events:**
- `id` (text, PK)
- `publicationStatus` (enum: Draft, Published, Archived)
- `title` (varchar 255)
- `date` (timestamp with timezone)
- `description` (text, nullable)
- `thumbnail` (text, nullable)
- `type` (enum: Art, Comedy, Dance, Design, Impro, Impro_Kanji, Movie, Music, Photo, Talk, Theater, Workshop, Other)

**closed_days:**
- `id` (text, PK)
- `date` (timestamp with timezone)

**admin_user:** (Better Auth)
- `id` (text, PK)
- `name` (text)
- `email` (text, unique)
- `emailVerified` (boolean)
- `image` (text, nullable)
- `role` (enum: Admin, SuperAdmin)
- `banned` (boolean)
- `banReason` (text, nullable)
- `banExpires` (timestamp, nullable)
- `createdAt`, `updatedAt` (timestamp)

**admin_session:** (Better Auth)
- `id` (text, PK)
- `userId` (text, FK to admin_user)
- `token` (text, unique)
- `expiresAt` (timestamp)
- `ipAddress`, `userAgent` (text, nullable)
- `createdAt`, `updatedAt` (timestamp)

**admin_account:** (Better Auth)
- `id` (text, PK)
- `userId` (text, FK to admin_user)
- `accountId`, `providerId` (text)
- `password` (text, nullable)
- `accessToken`, `refreshToken`, `idToken` (text, nullable)
- `accessTokenExpiresAt`, `refreshTokenExpiresAt` (timestamp, nullable)
- `scope` (text, nullable)
- `createdAt`, `updatedAt` (timestamp)

**verification:** (Better Auth)
- `id` (text, PK)
- `identifier`, `value` (text)
- `expiresAt` (timestamp)
- `createdAt`, `updatedAt` (timestamp)

### Adding New Tables

Follow the guide in `docs/database-setup.md`:
1. Define entity in `src/domain/entities/`
2. Define repository interface in `src/domain/repositories/`
3. Add Drizzle schema in `src/infrastructure/db/schema.ts`
4. Implement repository in `src/infrastructure/db/repositories/`
5. Create service in `src/services/`
6. Run `pnpm drzl:gen` then `pnpm drzl:migrate`

## Authentication & Authorization

This project uses **Better Auth** for admin authentication:

### Key Concepts

- **Two Role Levels**:
  - `Admin` - Can manage events and content
  - `SuperAdmin` - Can manage events, content, and other admin users
- **Session-based Auth**: Secure session tokens stored in database
- **Protected Routes**: Admin routes in `/admin/(authenticated)/` require authentication
- **tRPC Middleware**: `adminProcedure` and `superAdminProcedure` protect API routes

### Configuration Files

- `src/infrastructure/auth/server.ts` - Server-side auth config
- `src/infrastructure/auth/client.ts` - Client-side auth hooks
- `src/infrastructure/trpc/context.ts` - Auth middleware for tRPC procedures

### Admin Operations

- Login/logout handled by Better Auth
- Password reset functionality (SuperAdmin only)
- Session management with expiry
- Ban/unban users (SuperAdmin only)

### Security Notes

- Passwords are hashed using Better Auth's secure hashing
- Sessions expire automatically
- CSRF protection built-in
- SQL injection prevented by Drizzle ORM parameterization
- XSS prevented by React's automatic escaping

## Admin Panel

The admin panel uses Refine framework at `/admin`:
- **Authentication**: Protected by Better Auth middleware (see above)
- **Login**: `/admin/login` for admin access
- **Custom UI**: `src/components/refine-ui/`
- **Data Provider**: Bridges Refine to tRPC in `src/infrastructure/refine/data-provider.ts`
- **Views**: list-view, create-view, edit-view, show-view
- **Protected Routes**: `/admin/(authenticated)/` requires authentication

## Important Notes

### Language

- Comments in code are primarily in Japanese
- Documentation in `/docs` is in Japanese
- The team communicates in Japanese

### Environment Variables

プロジェクトでは **dotenvx** を使用して暗号化された環境変数を管理しています。

**ファイル構造:**
```
soypoy-potal/
├── .env.local.base          # Git管理、dotenvx暗号化（共有設定）
├── .env.local         # Git管理外、平文（個人設定：NEON_API_KEY）
├── .env.keys          # Git管理外（dotenvx復号キー）
└── ...
```

**ファイルの役割:**
- `.env.local.base` - チーム共有の設定（暗号化）。Gitにコミット済み
- `.env.local` - 個人用の設定（平文）。`.env.local.base`の値を上書き
- `.env.keys` - dotenvxの復号キー。チームリードから取得

**主な変数:**
| 変数名 | 配置場所 | 説明 |
|--------|----------|------|
| `NETLIFY_DATABASE_URL` | .env.local.base | 本番用PostgreSQL接続文字列 |
| `BETTER_AUTH_SECRET` | .env.local.base | Better Auth秘密鍵 |
| `BETTER_AUTH_URL` | .env.local.base | 認証ベースURL |
| `CLOUDINARY_*` | .env.local.base | Cloudinary APIクレデンシャル |
| `NEON_PROJECT_ID` | .env.local.base | NeonプロジェクトID |
| `PARENT_BRANCH_ID` | .env.local.base | Neon親ブランチID |
| `NEON_API_KEY` | .env.local | Neon APIキー（個人） |

**セットアップ手順:**
```bash
# 1. .env.keys を取得（チームリードから）

# 2. .env.local を作成してNEON_API_KEYを設定
echo "NEON_API_KEY=your_api_key_here" > .env.local
# キーは https://console.neon.tech/app/settings/api-keys で取得

# 3. 開発サーバー起動
./bin/dev
```

**変数の管理:**
```bash
# 環境変数を表示（復号済み）
npx dotenvx get -f .env.local.base

# 変数を追加/更新（暗号化）
npx dotenvx set NEW_VAR "value" -f .env.local.base

# 特定の変数を取得
npx dotenvx get NEON_PROJECT_ID -f .env.local.base
```

**重要:** `.env.local.base` を変更したら必ずコミットしてください（暗号化済みで安全）

### Testing

No test framework is currently configured. Code quality is maintained through:
- TypeScript strict mode
- Biome linting
- Zod runtime validation

### Don't Forget

- Run `pnpm check` before committing (type check + lint + format)
- The project uses Docker dev containers for consistent environments
- Use `./bin/dev` to start development server (auto-handles env decryption)
- SVGs are transformed to React components via SVGR webpack loader
- Unique IDs are generated using `nanoid`
- Images are uploaded to Cloudinary (use next-cloudinary components)
- Animations use Motion library (Framer Motion's successor)
- Date fields in DB are `timestamp with timezone` (not varchar)

## Common Tasks

### Add a New Page

1. Create route in `src/app/(user)/[route-name]/page.tsx`
2. Add page-specific components in `_components/` subdirectory
3. Use services from `src/services/` for data fetching
4. For admin pages: Create in `src/app/admin/(authenticated)/[route-name]/`

### Add a New UI Component

1. For shadcn components: Add to `src/components/shadcn/`
2. For custom shared components: Add to `src/components/[ComponentName]/`
3. Use Tailwind + `cn()` utility for styling
4. For animations: Use Motion library components

### Add Image Upload

1. Use `next-cloudinary` components (e.g., `<CldUploadWidget>`)
2. Compress images client-side with `browser-image-compression` before upload
3. Store Cloudinary URL in database
4. Use `<CldImage>` component for optimized image display

### Modify Event Types

1. Update enum in `src/domain/entities/event.ts`
2. Update Drizzle schema enum in `src/infrastructure/db/schema.ts`
3. Update Zod schema in `src/infrastructure/trpc/schemas/`
4. Generate and run migration: `pnpm drzl:gen` then `pnpm drzl:migrate`

### Add Protected Admin Route

1. Create new tRPC procedure in router
2. Use `adminProcedure` or `superAdminProcedure` middleware
3. Implement business logic in service layer
4. Add Zod validation schema for input
5. Create Refine-based UI in `/admin/(authenticated)/`

### Modify Admin Roles/Permissions

1. Update `AdminUserRole` enum in `src/domain/entities/auth.ts`
2. Update database schema in `src/infrastructure/db/authSchema.ts`
3. Create and apply migration
4. Update tRPC middleware in `src/infrastructure/trpc/context.ts`
5. Update UI role selectors in admin panel

## Related Documentation

- `README.md` - Setup instructions and basic usage
- `docs/project-structure.md` - Detailed directory structure
- `docs/database-setup.md` - Database operations guide
- `.github/copilot-instructions.md` - Code review style guide
