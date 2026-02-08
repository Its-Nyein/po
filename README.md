# PO

A Tron-themed social network frontend built with React 19, TypeScript, and Vite.

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for bundling and dev server
- **TanStack React Query** for server state management
- **React Router v7** for client-side routing
- **Tailwind CSS 4** with custom Tron theme
- **shadcn/ui** component library (Radix UI primitives)
- **Three.js** via @react-three/fiber for 3D Tron effects
- **Axios** for HTTP requests
- **Lucide React** for icons
- **date-fns** for date formatting
- **Sonner** for toast notifications

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Setup

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/api/v1/ws/subscribe
```

4. Start the dev server:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # TypeScript check + Vite production build
pnpm preview      # Preview production build
pnpm lint         # ESLint
pnpm format       # Prettier formatting
```

Pre-commit hooks (Husky + lint-staged) auto-run ESLint and Prettier on staged files.

## Architecture

### Project Structure

```
src/
├── api/
│   ├── queries/        # TanStack React Query hooks
│   └── services/       # API service functions (Axios)
├── components/
│   ├── ui/             # shadcn/ui base components
│   ├── tron/           # Tron 3D effect components (Three.js)
│   ├── post-card.tsx       # Post display with rich content
│   ├── like-button.tsx     # Like toggle
│   ├── repost-button.tsx   # Repost toggle
│   ├── rich-content.tsx    # Renders #hashtags and @mentions as links
│   ├── mention-textarea.tsx # Textarea with @mention autocomplete dropdown
│   ├── password-input.tsx  # Password input with show/hide toggle
│   └── ...
├── contexts/           # React Context (auth)
├── features/           # Page-level components
│   ├── auth/           # Login, Register
│   ├── feed/           # Main feed
│   ├── post/           # Post comments page
│   ├── profile/        # User profile
│   ├── notifications/  # Notifications
│   ├── bookmarks/      # Bookmarks
│   ├── hashtag/        # Hashtag posts page
│   ├── user/           # Username resolver (redirects to profile)
│   ├── likes/          # Likers list
│   ├── search/         # User search
│   └── settings/       # Account settings
├── hooks/              # Custom hooks (mobile detection, WebSocket)
├── layouts/            # App and Auth layouts
├── lib/                # API client, auth hook, theme hook, utils
├── router/             # Route definitions
└── types/              # TypeScript type definitions
```

### Data Flow

```
API Client (Axios) -> Services -> React Query Hooks -> Components
```

- **API client** (`src/lib/api-client.ts`) — Axios instance with Bearer token interceptor. 401 responses auto-clear the token.
- **Services** (`src/api/services/`) — Thin wrappers around API endpoints for auth, posts, comments, likes, reposts, follows, hashtags, users, notifications, and bookmarks.
- **React Query hooks** (`src/api/queries/`) — TanStack Query hooks with 1-min stale time. Mutations automatically invalidate relevant query keys.
- **WebSocket** (`src/hooks/use-websocket.ts`) — Connects to the backend WebSocket, sends auth token, and invalidates React Query caches on real-time events.

### Auth

React Context (`src/contexts/auth-context.tsx`) manages user state. JWT token is stored in localStorage and verified on app mount.

### Routing

React Router v7 with two layout groups:

| Route              | Page              | Auth     |
| ------------------ | ----------------- | -------- |
| `/`                | Feed              | Required |
| `/comments/:id`    | Post comments     | Required |
| `/profile/:id`     | User profile      | Required |
| `/likes/:type/:id` | Likers list       | Required |
| `/search`          | User search       | Required |
| `/notifications`   | Notifications     | Required |
| `/bookmarks`       | Bookmarks         | Required |
| `/hashtag/:tag`    | Hashtag posts     | Required |
| `/user/:username`  | Username resolver | Required |
| `/settings`        | Account settings  | Required |
| `/login`           | Login             | Public   |
| `/register`        | Register          | Public   |

## Features

- **Feed** with post creation, editing, deletion, and toggle between all posts / following
- **Likes** on posts and comments with real-time counts
- **Reposts** — toggle repost on any post, with notification to post author
- **Comments** with threaded display under each post
- **Bookmarks** to save posts for later
- **Follow system** with follower/following lists on profiles
- **Hashtags** — `#tag` in post content renders as a clickable link to `/hashtag/:tag`, showing all posts with that tag
- **Mentions** — `@username` in post/comment content renders as a clickable link to the user's profile; typing `@` in any textarea shows an autocomplete dropdown of followed users with keyboard navigation (arrow keys, Enter, Escape)
- **Rich content rendering** — Hashtags and mentions are parsed and displayed as interactive links
- **Real-time notifications** via WebSocket for likes, comments, follows, reposts, and mentions
- **Account settings** — edit profile, change password, and delete account with confirmation dialog
- **User search** by name
- **Tron visual theme** — Custom 3D grid, reticle, scanlines, and status strip using Three.js

## UI Theme

- **Colors**: Primary cyan (`#00d4ff`), dark background (`#0a0a0f`)
- **Fonts**: Orbitron (headings), Rajdhani (body)
- **Components**: shadcn/ui with Tron-styled variants
- **3D Effects**: TronGrid3D, TronReticle, TronScanlines, TronStatusStrip

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig and vite).
