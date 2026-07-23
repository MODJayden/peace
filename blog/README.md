# SirPeace Frontend

React + Vite + Redux Toolkit frontend for SirPeace.

## Setup

1. `cp .env.example .env` and set `VITE_API_URL` to your backend's API base (e.g. `http://localhost:5000/api/v1`).
2. `npm install`
3. `npm run dev` for local development, `npm run build` for a production build (output in `dist/`).

## Stack

- React 19 + Vite, JavaScript/JSX only (no TypeScript)
- Redux Toolkit (createSlice/createAsyncThunk/extraReducers) — no Context API
- React Router DOM, React Hook Form + Zod
- Tailwind CSS v4 with the SirPeace brand tokens in `src/index.css`
- shadcn/ui-style primitives built on Radix UI (`src/components/ui`)
- TipTap rich text editor for the article composer
- Route-level code splitting via `React.lazy` + `Suspense`

## Structure

- `src/features/*` — one folder per Redux slice (auth, articles, categories, tags, comments, bookmarks, notifications, analytics, admin, newsletter)
- `src/pages` — route-level pages, including `dashboard/` (author) and `admin/` (admin/super admin)
- `src/components` — `ui/` primitives, `layout/`, `article/`, `common/`
- `src/routes` — router, `ProtectedRoute`, `RoleRoute`
