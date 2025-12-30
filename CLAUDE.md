# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack (http://localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run Vitest test suite
npm run setup        # Install deps + generate Prisma client + run migrations
npm run db:reset     # Reset database (destructive)
```

Run a single test file:
```bash
npx vitest run src/lib/__tests__/file-system.test.ts
```

## Architecture

UIGen is an AI-powered React component generator built with Next.js 15 App Router.

### Core Flow

```
User prompt → ChatInterface → POST /api/chat → Claude AI with tools
    → Tool execution on VirtualFileSystem → UI updates → Save to Prisma
```

### Key Concepts

**Virtual File System** (`src/lib/file-system.ts`): In-memory file system that AI tools operate on. Files never touch disk. Serialized to JSON for database storage.

**AI Tools** (`src/lib/tools/`):
- `str_replace_editor`: Create/edit files via string replacement
- `file_manager`: Rename/delete files

**Provider Pattern** (`src/lib/provider.ts`): Returns Claude Haiku if `ANTHROPIC_API_KEY` is set, otherwise uses `MockLanguageModel` with static component templates.

### State Management

Two React contexts coordinate state:
- `ChatContext` (`src/lib/contexts/chat-context.tsx`): Messages, chat status via `useChat` hook
- `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`): Virtual files, selected file

Both sync through `handleToolCall` when AI generates file changes.

### API Route

`POST /api/chat` (`src/app/api/chat/route.ts`):
- Accepts `messages`, `files` (serialized VFS), `projectId`
- Runs agentic loop (up to 40 steps)
- Uses Anthropic prompt caching for system message
- Saves project state to Prisma on completion

### Authentication

JWT-based sessions in httpOnly cookies. Server actions in `src/actions/index.ts`: `signUp`, `signIn`, `signOut`, `getUser`.

### Database

SQLite via Prisma. Two models:
- `User`: email, password (bcrypt hashed)
- `Project`: name, messages (JSON), data (JSON file system), optional userId

## Code Conventions

- Entry point for generated components must be `/App.jsx`
- Use `@/` import alias for project files in generated code
- Styling via Tailwind CSS (not hardcoded values)
- Tests live in `__tests__/` directories alongside components
- UI components use shadcn/ui patterns (`src/components/ui/`)

## Environment Variables

- `ANTHROPIC_API_KEY`: Optional. Uses mock provider if not set.
- `JWT_SECRET`: Defaults to "development-secret-key" in dev.
