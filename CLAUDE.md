# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Yaycha v2 — a Tron-themed social network frontend built with React 19, TypeScript, and Vite. The backend API is separate (not in this repo) and expected at `VITE_API_BASE_URL` (default: `http://localhost:8000/api/v1`).

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # TypeScript check + Vite production build
pnpm preview      # Preview production build
pnpm lint         # ESLint
pnpm format       # Prettier formatting
```

Pre-commit hooks (Husky + lint-staged) auto-run eslint --fix and prettier --write on staged files.

## Architecture

### Routing (`src/router/route.tsx`)

React Router v7 with two layout groups:

- **AppLayout** (protected) — wraps `/`, `/comments/:id`, `/profile/:id`, `/likes/:type/:id`, `/search`, `/notifications`
- **AuthLayout** (public) — wraps `/login`, `/register`

`ProtectedRoute` checks auth context and redirects unauthenticated users.

### Data Flow

- **API client** (`src/lib/api-client.ts`) — Axios instance with Bearer token interceptor from localStorage. 401 responses trigger auto-logout.
- **Services** (`src/api/services/`) — thin wrappers around API endpoints (auth, post, comment, like, follow, user, notification).
- **React Query hooks** (`src/api/queries/`) — TanStack Query hooks that call services. Configured with 1-min staleTime, 1 retry. Mutations invalidate relevant query keys on success.
- **WebSocket** (`src/hooks/use-websocket.ts`) — connects to `VITE_WS_URL`, sends auth token, and invalidates React Query caches on real-time events.

### Auth

React Context (`src/contexts/auth-context.tsx`) manages user state. Token stored in localStorage, verified on app mount via `auth.service.verify()`.

### UI & Styling

- **shadcn/ui** components in `src/components/ui/` (configured via `components.json`, uses `@` path alias)
- **Tron theme** — custom 3D components in `src/components/tron/` (TronGrid3D, TronReticle, TronScanlines, TronStatusStrip) using Three.js via @react-three/fiber
- **Tailwind CSS 4** with `@theme` directive, CSS variables for Tron colors (primary cyan `#00d4ff`, dark background `#0a0a0f`)
- **Fonts**: Orbitron (headings), Rajdhani (body) via @fontsource

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig and vite).

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/api/v1/ws/subscribe
```

## Types

Core types in `src/types/`: User, Post, Comment, PostLike, CommentLike, Notification, Follow. All API responses follow these shapes.
